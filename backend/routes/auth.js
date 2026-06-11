const express = require('express');
const {
  buildSession,
  createId,
  createRecoveryCode,
  findUserByIdentifier,
  maskValue,
  normalize,
  readStore,
  writeStore,
} = require('../lib/authStore');

const router = express.Router();

function isStrongPassword(password) {
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  );
}

function requireString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isProfessionalRole(role) {
  return role === 'medical_professional' || role === 'nutritionist';
}

router.post('/register', (req, res) => {
  const username = requireString(req.body.username);
  const email = requireString(req.body.email);
  const phone = requireString(req.body.phone);
  const password = requireString(req.body.password);
  const role = requireString(req.body.role) || 'consumer';
  const licenseNumber = requireString(req.body.licenseNumber);
  const licenseIssuer = requireString(req.body.licenseIssuer);
  const deviceId = requireString(req.body.deviceId) || createId('device');

  if (!username || !email || !phone || !password) {
    return res.status(400).json({ error: 'Username, email, phone, and password are required.' });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and include upper, lower, number, and symbol.' });
  }

  if (isProfessionalRole(role) && (!licenseNumber || !licenseIssuer)) {
    return res.status(400).json({ error: 'Professional accounts require license details.' });
  }

  const store = readStore();

  if (
    store.users.some(
      (user) =>
        normalize(user.username) === normalize(username) ||
        normalize(user.email) === normalize(email) ||
        normalize(user.phone) === normalize(phone),
    )
  ) {
    return res.status(409).json({ error: 'An account with that username, email, or phone already exists.' });
  }

  const status = isProfessionalRole(role) ? 'pending_verification' : 'verified';
  const now = new Date().toISOString();

  const user = {
    id: createId('user'),
    username,
    email,
    password,
    role,
    status,
    licenseNumber,
    licenseIssuer,
    deviceId,
    lastDeviceId: deviceId,
    lastLoginAt: now,
    createdAt: now,
  };

  store.users.push(user);
  writeStore(store);

  return res.status(201).json({
    message:
      status === 'pending_verification'
        ? 'Account created. Your professional credentials are pending review.'
        : 'Account created and signed in successfully.',
    session: buildSession(user, deviceId),
  });
});

router.post('/login', (req, res) => {
  const username = requireString(req.body.username);
  const password = requireString(req.body.password);
  const deviceId = requireString(req.body.deviceId) || createId('device');

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const store = readStore();
  const user = store.users.find((account) => normalize(account.username) === normalize(username));

  if (!user) {
    return res.status(404).json({ error: 'No account found with that username.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  const newDeviceLogin = Boolean(user.lastDeviceId && user.lastDeviceId !== deviceId);
  const now = new Date().toISOString();

  user.lastLoginAt = now;
  user.lastDeviceId = deviceId;

  store.users = store.users.map((account) => (account.id === user.id ? user : account));
  writeStore(store);

  const securityNotice = newDeviceLogin
    ? 'This login came from a new device. In production, the owner should be notified by email and text immediately.'
    : undefined;

  return res.json({
    message: newDeviceLogin ? 'Login successful. Security notice queued.' : 'Login successful.',
    session: buildSession(user, deviceId, securityNotice),
    securityNotice,
  });
});

router.post('/recovery/request', (req, res) => {
  const identifier = requireString(req.body.identifier);
  const target = requireString(req.body.target) === 'username' ? 'username' : 'password';

  if (!identifier) {
    return res.status(400).json({ error: 'An email address or phone number is required.' });
  }

  const store = readStore();
  const user = findUserByIdentifier(store, identifier);

  if (!user) {
    return res.status(404).json({ error: 'No account matches that email or phone number.' });
  }

  const challengeId = createId('challenge');
  const challengeCode = createRecoveryCode();

  store.recoveryChallenges = store.recoveryChallenges.filter((challenge) => challenge.expiresAt > Date.now());
  store.recoveryChallenges.push({
    id: challengeId,
    userId: user.id,
    target,
    code: challengeCode,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });
  writeStore(store);

  return res.json({
    message: `Recovery code prepared for your ${maskValue(user.email)} and ${maskValue(user.phone)} contact methods.`,
    challengeId,
    challengeCode,
  });
});

router.post('/recovery/confirm', (req, res) => {
  const challengeId = requireString(req.body.challengeId);
  const code = requireString(req.body.code);
  const target = requireString(req.body.target) === 'username' ? 'username' : 'password';
  const newValue = requireString(req.body.newValue);

  if (!challengeId || !code || !newValue) {
    return res.status(400).json({ error: 'Challenge id, code, and the new value are required.' });
  }

  const store = readStore();
  const challenge = store.recoveryChallenges.find((item) => item.id === challengeId);

  if (!challenge || challenge.expiresAt <= Date.now()) {
    return res.status(400).json({ error: 'That recovery code has expired. Request a new one.' });
  }

  if (challenge.code !== code) {
    return res.status(401).json({ error: 'Invalid recovery code.' });
  }

  const user = store.users.find((account) => account.id === challenge.userId);

  if (!user) {
    return res.status(404).json({ error: 'The linked account no longer exists.' });
  }

  if (target === 'username') {
    if (store.users.some((account) => normalize(account.username) === normalize(newValue) && account.id !== user.id)) {
      return res.status(409).json({ error: 'That username is already in use.' });
    }

    user.username = newValue;
  } else {
    if (!isStrongPassword(newValue)) {
      return res.status(400).json({ error: 'The new password must meet the password rules.' });
    }

    user.password = newValue;
  }

  store.recoveryChallenges = store.recoveryChallenges.filter((item) => item.id !== challengeId);
  store.users = store.users.map((account) => (account.id === user.id ? user : account));
  writeStore(store);

  return res.json({
    message: target === 'username' ? 'Username updated successfully. You can sign in again now.' : 'Password reset successfully. You can sign in again now.',
  });
});

module.exports = router;
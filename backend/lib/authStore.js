const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '..', 'data', 'auth-store.json');

function ensureStoreFile() {
  const directory = path.dirname(storePath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify({ users: [], recoveryChallenges: [], notifications: [] }, null, 2));
  }
}

function readStore() {
  ensureStoreFile();

  try {
    const raw = fs.readFileSync(storePath, 'utf8');
    const parsed = JSON.parse(raw);

    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      recoveryChallenges: Array.isArray(parsed.recoveryChallenges) ? parsed.recoveryChallenges : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
    };
  } catch {
    return { users: [], recoveryChallenges: [], notifications: [] };
  }
}

function writeStore(store) {
  ensureStoreFile();
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function maskValue(value) {
  const normalized = String(value || '').trim();

  if (!normalized) {
    return '';
  }

  if (normalized.includes('@')) {
    const [name, domain] = normalized.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  }

  if (normalized.length <= 4) {
    return '****';
  }

  return `${normalized.slice(0, 2)}***${normalized.slice(-2)}`;
}

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

function createRecoveryCode() {
  return crypto.randomInt(100000, 999999).toString();
}

function findUserByIdentifier(store, identifier) {
  const lookup = normalize(identifier);

  return store.users.find(
    (user) =>
      normalize(user.username) === lookup ||
      normalize(user.email) === lookup ||
      normalize(user.phone) === lookup,
  );
}

function buildSession(user, deviceId, securityNotice) {
  return {
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    deviceId,
    lastLoginAt: user.lastLoginAt,
    securityNotice,
  };
}

function getStorePath() {
  return storePath;
}

module.exports = {
  buildSession,
  createId,
  createRecoveryCode,
  findUserByIdentifier,
  getStorePath,
  maskValue,
  normalize,
  readStore,
  writeStore,
};

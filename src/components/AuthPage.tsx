import { useEffect, useState, type FormEvent } from 'react';

type UserRole = 'consumer' | 'medical_professional' | 'nutritionist';

type SessionUser = {
  username: string;
  email: string;
  role: UserRole;
  status: 'verified' | 'pending_verification';
  deviceId: string;
  lastLoginAt: string;
  securityNotice?: string;
};

type AuthPageProps = {
  onLogin: (session: SessionUser) => void;
};

type AuthMode = 'login' | 'signup' | 'recover';
type RecoveryTarget = 'username' | 'password';

type RecoveryChallenge = {
  challengeId: string;
  code: string;
};

const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : '';

function getDeviceId() {
  const storageKey = 'ingredia_device_id';
  const existing = localStorage.getItem(storageKey);

  if (existing) {
    return existing;
  }

  const generated =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  localStorage.setItem(storageKey, generated);
  return generated;
}

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.');
  }

  return payload as T;
}

function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  );
}

function roleLabel(role: UserRole) {
  return role
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('consumer');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseIssuer, setLicenseIssuer] = useState('');

  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [recoveryTarget, setRecoveryTarget] = useState<RecoveryTarget>('password');
  const [recoveryChallenge, setRecoveryChallenge] = useState<RecoveryChallenge | null>(null);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryValue, setRecoveryValue] = useState('');

  const deviceId = getDeviceId();

  useEffect(() => {
    setError('');
    setMessage('');
    setRecoveryChallenge(null);
    setRecoveryCode('');
    setRecoveryValue('');
  }, [mode]);

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!loginUsername || !loginPassword) {
      setError('Enter your username and password.');
      return;
    }

    try {
      const response = await postJson<{
        session: SessionUser;
        message: string;
        securityNotice?: string;
      }>('/api/auth/login', {
        username: loginUsername,
        password: loginPassword,
        deviceId,
      });

      onLogin({
        ...response.session,
        securityNotice: response.securityNotice,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed.');
    }
  }

  async function handleSignupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!signupUsername || !signupEmail || !signupPassword) {
      setError('Complete all required signup fields.');
      return;
    }

    if (!isStrongPassword(signupPassword)) {
      setError('Password must be at least 8 characters and include upper case letters, lower case letters, number, and symbol.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if ((signupRole === 'medical_professional' || signupRole === 'nutritionist') && (!licenseNumber || !licenseIssuer)) {
      setError('Professional accounts need license information before signup.');
      return;
    }

    try {
      const response = await postJson<{
        session: SessionUser;
        message: string;
      }>('/api/auth/register', {
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
        licenseNumber,
        licenseIssuer,
        deviceId,
      });

      setMessage(response.message);
      onLogin(response.session);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Signup failed.');
    }
  }

  async function handleRecoveryRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!recoveryIdentifier) {
      setError('Enter your email or phone number.');
      return;
    }

    try {
      const response = await postJson<{
        challengeId: string;
        challengeCode: string;
        message: string;
      }>('/api/auth/recovery/request', {
        identifier: recoveryIdentifier,
        target: recoveryTarget,
      });

      setRecoveryChallenge({
        challengeId: response.challengeId,
        code: response.challengeCode,
      });
      setMessage(response.message);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Recovery request failed.');
    }
  }

  async function handleRecoveryConfirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!recoveryChallenge) {
      setError('Start the recovery request first.');
      return;
    }

    if (!recoveryCode || !recoveryValue) {
      setError('Enter the recovery code and your new credential.');
      return;
    }

    try {
      const response = await postJson<{ message: string }>('/api/auth/recovery/confirm', {
        challengeId: recoveryChallenge.challengeId,
        code: recoveryCode,
        target: recoveryTarget,
        newValue: recoveryValue,
      });

      setMessage(response.message);
      setMode('login');
      setRecoveryChallenge(null);
      setRecoveryCode('');
      setRecoveryValue('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Recovery confirmation failed.');
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f0fdf4,transparent_45%),linear-gradient(180deg,#07130a_0%,#132018_55%,#f8fafc_55%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950 text-white shadow-2xl shadow-emerald-950/20">
            <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.3),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.25),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))] p-8 sm:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
                  Ingredia authentication
                </p>
                <h1 className="mt-4 max-w-lg text-4xl font-black tracking-tight sm:text-5xl">
                  Login by username, protect access, and handle recovery safely.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  This flow supports username/password sign-in, email or phone based recovery, and role-aware onboarding for medical professionals and nutritionists.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Login</p>
                    <p className="mt-2 text-sm text-slate-200">Use a username and password. Device changes are flagged for notification.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Recovery</p>
                    <p className="mt-2 text-sm text-slate-200">Reset a forgotten username or password with your email or phone number.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Verification</p>
                    <p className="mt-2 text-sm text-slate-200">Professional accounts require license data and stay pending until reviewed.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm text-emerald-50">
                <p className="font-semibold">What you still need from your end</p>
                <p className="mt-2 leading-6 text-emerald-50/90">
                  To make the email and text notifications real, connect an email provider and an SMS provider. To make professional verification real, wire the license check to the official databases your project is allowed to use.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-200/60 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                  Account access
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Recover access'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-emerald-200 hover:text-emerald-700"
              >
                {showPassword ? 'Hide passwords' : 'Show passwords'}
              </button>
            </div>

            <div className="mt-6 flex rounded-full bg-slate-100 p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-full px-3 py-2 transition ${mode === 'login' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-full px-3 py-2 transition ${mode === 'signup' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => setMode('recover')}
                className={`flex-1 rounded-full px-3 py-2 transition ${mode === 'recover' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Recover
              </button>
            </div>

            {message && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Username</span>
                  <input
                    value={loginUsername}
                    onChange={(event) => setLoginUsername(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    placeholder="your.username"
                    autoComplete="username"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </label>

                <button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700">
                  Sign in
                </button>
              </form>
            )}

            {mode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Username</span>
                  <input
                    value={signupUsername}
                    onChange={(event) => setSignupUsername(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    placeholder="Pick a username"
                    autoComplete="username"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(event) => setSignupEmail(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Phone</span>
                  <input
                    value={signupPhone}
                    onChange={(event) => setSignupPhone(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    placeholder="(555) 555-5555"
                    autoComplete="tel"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Account type</span>
                  <select
                    value={signupRole}
                    onChange={(event) => setSignupRole(event.target.value as UserRole)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="consumer">Consumer</option>
                    <option value="nutritionist">Nutritionist</option>
                    <option value="medical_professional">Medical Professional</option>
                  </select>
                </label>

                {(signupRole === 'nutritionist' || signupRole === 'medical_professional') && (
                  <div className="sm:col-span-2 grid gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-900">
                      {roleLabel(signupRole)} verification
                    </p>
                    <p className="text-sm leading-6 text-amber-900/80">
                      Enter license details so the account can be checked against the official registry during review.
                    </p>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-amber-900">License number</span>
                      <input
                        value={licenseNumber}
                        onChange={(event) => setLicenseNumber(event.target.value)}
                        className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                        placeholder="License / registration number"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-amber-900">Issuing body</span>
                      <input
                        value={licenseIssuer}
                        onChange={(event) => setLicenseIssuer(event.target.value)}
                        className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                        placeholder="State medical board, nutrition board, etc."
                      />
                    </label>
                  </div>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(event) => setSignupPassword(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupConfirmPassword}
                    onChange={(event) => setSignupConfirmPassword(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    placeholder="Repeat the password"
                    autoComplete="new-password"
                  />
                </label>

                <div className="sm:col-span-2 grid gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">Password rules</p>
                  <p>At least 8 characters, with uppercase, lowercase, a number, and a symbol.</p>
                </div>

                <button className="sm:col-span-2 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700">
                  Create account
                </button>
              </form>
            )}

            {mode === 'recover' && (
              <div className="mt-6 space-y-4">
                <form onSubmit={handleRecoveryRequest} className="grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Email or phone</span>
                    <input
                      value={recoveryIdentifier}
                      onChange={(event) => setRecoveryIdentifier(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                      placeholder="Email address or phone number"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">What did you forget?</span>
                    <select
                      value={recoveryTarget}
                      onChange={(event) => setRecoveryTarget(event.target.value as RecoveryTarget)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    >
                      <option value="password">Password</option>
                      <option value="username">Username</option>
                    </select>
                  </label>

                  <button className="sm:col-span-2 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700">
                    Send recovery code
                  </button>
                </form>

                {recoveryChallenge && (
                  <form onSubmit={handleRecoveryConfirm} className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
                      <p className="font-semibold">Development recovery code</p>
                      <p className="mt-1 text-sky-900/80">
                        In production this code should be sent to the user’s email and phone. For local testing, the server returns the code so you can complete the reset.
                      </p>
                      <p className="mt-2 font-mono text-lg tracking-[0.3em]">{recoveryChallenge.code}</p>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Recovery code</span>
                      <input
                        value={recoveryCode}
                        onChange={(event) => setRecoveryCode(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                        placeholder="Enter the code you received"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">
                        {recoveryTarget === 'password' ? 'New password' : 'New username'}
                      </span>
                      <input
                        type={recoveryTarget === 'password' && !showPassword ? 'password' : 'text'}
                        value={recoveryValue}
                        onChange={(event) => setRecoveryValue(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                        placeholder={recoveryTarget === 'password' ? 'Choose a new password' : 'Choose a new username'}
                      />
                    </label>

                    <button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700">
                      Confirm recovery
                    </button>
                  </form>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
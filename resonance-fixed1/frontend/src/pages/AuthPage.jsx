import React, { useState } from 'react';
import { theme } from '../theme/colors';
import { apiFetchRaw } from '../api';
import { signInWithGoogle } from '../firebase';
const c = theme.colors;
const ROLES = ['Parent', 'Spouse', 'Child', 'Sibling'];

export default function AuthPage({ onLogin, onBack }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleGoogleSignIn = async () => {
  setError('');
  setLoading(true);
  try {
    const { idToken, name, email } = await signInWithGoogle();
    localStorage.setItem('resonance_token', idToken);
    onLogin({ name, email, role: null });
  } catch (err) {
    setError(err.message || 'Google sign-in failed.');
  } finally {
    setLoading(false);
  }
};
  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (isRegister && !name.trim()) { setError('Please enter your name.'); return; }
    if (isRegister && !role) { setError('Please select who you are caring for.'); return; }
    setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const body = isRegister
        ? { name: name.trim(), email, password, role }
        : { email, password };
      const res = await apiFetchRaw(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Authentication failed');
      }
      const data = await res.json();
      if (data.access_token) localStorage.setItem('resonance_token', data.access_token);
      onLogin({ name: data.name || (isRegister ? name.trim() : email.split('@')[0]), email, role: data.role || role });
    } catch (err) {
      if (err.message.includes('fetch') || err.message.includes('Failed') || err.message.includes('NetworkError')) {
        setError('Cannot reach the server. Make sure the backend is running and port 8000 is set to Public.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    background: c.bgCard, border: `1px solid ${c.border}`,
    borderRadius: '2px', color: c.textPrimary,
    fontSize: '0.88rem', outline: 'none',
    marginBottom: '1rem', transition: 'border-color 0.2s',
  };
  const labelStyle = {
    fontSize: '0.7rem', letterSpacing: '1.5px', color: c.textMuted,
    textTransform: 'uppercase', display: 'block', marginBottom: '6px',
  };

  return (
    <div style={{ background: c.bg, minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '-10%', top: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(92,138,58,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <button onClick={onBack} style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'transparent', border: 'none', color: c.textMuted, fontSize: '0.75rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = c.textSecondary}
        onMouseLeave={e => e.currentTarget.style.color = c.textMuted}>
        ← Back
      </button>

      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', borderRight: `1px solid ${c.border}`, background: c.bgMid }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: '3.5rem', fontWeight: 300, letterSpacing: '10px', color: c.bone, marginBottom: '0.5rem' }}>RESONANCE</h1>
          <p style={{ fontFamily: theme.fonts.serif, fontStyle: 'italic', color: c.textSecondary, fontSize: '0.95rem', marginBottom: '3rem' }}>you care for them, we care for you</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: '✦', text: 'Track your burnout before it burns you out' },
              { icon: '◈', text: "A private journal that holds what you can't say aloud" },
              { icon: '⬡', text: 'A companion who understands the invisible weight' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', textAlign: 'left' }}>
                <span style={{ color: c.gold, fontSize: '0.9rem', marginTop: '2px', flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: '0.85rem', color: c.textSecondary, lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{ fontFamily: theme.fonts.serif, fontSize: '1.6rem', fontWeight: 400, color: c.bone, marginBottom: '0.35rem' }}>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: c.textMuted, marginBottom: '2rem' }}>
            {isRegister ? 'A safe space, just for caretakers' : 'Sign in to continue your journey'}
          </p>

          {isRegister && (
            <>
              <label style={labelStyle}>Your first name</label>
              <input style={inputStyle} placeholder="e.g. Priya" value={name} onChange={e => setName(e.target.value)}
                onFocus={e => e.target.style.borderColor = c.borderLight}
                onBlur={e => e.target.style.borderColor = c.border} />
              <label style={labelStyle}>I am caring for a</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                {ROLES.map(r => (
                  <button key={r} onClick={() => setRole(r)} style={{
                    flex: 1, padding: '8px 4px',
                    border: `1px solid ${role === r ? c.gold : c.border}`,
                    borderRadius: '2px', fontSize: '0.75rem',
                    background: role === r ? 'rgba(201,168,76,0.15)' : 'transparent',
                    color: role === r ? c.gold : c.textSecondary, transition: 'all 0.15s',
                  }}>{r}</button>
                ))}
              </div>
            </>
          )}

          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)}
            onFocus={e => e.target.style.borderColor = c.borderLight}
            onBlur={e => e.target.style.borderColor = c.border} />

          <label style={labelStyle}>Password</label>
          <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            onFocus={e => e.target.style.borderColor = c.borderLight}
            onBlur={e => e.target.style.borderColor = c.border} />

          {error && (
            <p style={{ color: c.danger, fontSize: '0.8rem', marginBottom: '1rem', padding: '0.6rem', background: 'rgba(181,64,64,0.1)', border: `1px solid rgba(181,64,64,0.3)`, borderRadius: '2px' }}>
              {error}
            </p>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '0.85rem', background: c.bgCard,
            border: `1px solid ${c.borderLight}`, borderRadius: '2px',
            color: loading ? c.textMuted : c.bone, fontSize: '0.82rem',
            letterSpacing: '2px', textTransform: 'uppercase', transition: 'all 0.2s', marginBottom: '1.25rem',
          }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = c.gold; e.currentTarget.style.color = c.gold; } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderLight; e.currentTarget.style.color = loading ? c.textMuted : c.bone; }}>
            {loading ? 'Please wait…' : (isRegister ? 'Create account' : 'Sign in')}
          </button>
           {/* ← ADD THIS BLOCK */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', background: c.border }} />
            <span style={{ fontSize: '0.7rem', color: c.textMuted, letterSpacing: '1px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: c.border }} />
          </div>

          <button onClick={handleGoogleSignIn} disabled={loading} style={{
            width: '100%', padding: '0.85rem',
            background: 'transparent', border: `1px solid ${c.border}`,
            borderRadius: '2px', color: c.textSecondary, fontSize: '0.82rem',
            letterSpacing: '1px', transition: 'all 0.2s', marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = c.borderLight}
            onMouseLeave={e => e.currentTarget.style.borderColor = c.border}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: c.textMuted }}>
            {isRegister ? 'Already have an account? ' : 'No account? '}
            <span onClick={() => { setIsRegister(!isRegister); setError(''); }} style={{ color: c.textSecondary, cursor: 'pointer', borderBottom: `1px solid ${c.border}` }}>
              {isRegister ? 'Sign in' : 'Create one'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { theme } from '../theme/colors';

const ROLES = ['Parent', 'Spouse', 'Child', 'Sibling'];

export default function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (isRegister && !name.trim()) { setError('Please enter your name.'); return; }
    // In production: call /auth/register or /auth/login
    onLogin({ name: isRegister ? name.trim() : email.split('@')[0], email, role });
  };

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.9rem',
    border: `0.5px solid ${theme.colors.tan}`,
    borderRadius: '8px', background: '#fff',
    fontSize: '0.9rem', color: theme.colors.text,
    outline: 'none', marginBottom: '1rem',
    fontFamily: theme.fonts.sans,
  };

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: theme.fonts.serif, color: theme.colors.kombuGreen, fontSize: '2.2rem', letterSpacing: '6px', fontWeight: 400, margin: 0 }}>RESONANCE</h1>
          <p style={{ color: theme.colors.mossGreen, fontStyle: 'italic', marginTop: '4px', fontSize: '0.85rem' }}>for the invisible patient</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', border: `0.5px solid ${theme.colors.tan}`, padding: '2rem' }}>
          <h2 style={{ fontFamily: theme.fonts.serif, fontWeight: 400, color: theme.colors.cafeNoir, fontSize: '1.3rem', marginBottom: '0.3rem' }}>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: theme.colors.mossGreen, marginBottom: '1.5rem' }}>
            {isRegister ? 'A safe space, just for caretakers' : 'Sign in to continue your journey'}
          </p>

          {isRegister && (
            <>
              <label style={{ fontSize: '0.75rem', color: theme.colors.mossGreen, letterSpacing: '0.3px', display: 'block', marginBottom: '5px' }}>Your first name</label>
              <input style={inputStyle} placeholder="e.g. Priya" value={name} onChange={e => setName(e.target.value)} />

              <label style={{ fontSize: '0.75px', color: theme.colors.mossGreen, letterSpacing: '0.3px', display: 'block', marginBottom: '8px', fontSize: '0.75rem' }}>I am caring for a</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                {ROLES.map(r => (
                  <button key={r} onClick={() => setRole(r)}
                    style={{
                      flex: 1, padding: '7px 4px', border: `0.5px solid ${role === r ? theme.colors.kombuGreen : theme.colors.tan}`,
                      borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer',
                      background: role === r ? theme.colors.kombuGreen : '#fff',
                      color: role === r ? theme.colors.bone : theme.colors.mossGreen,
                      fontFamily: theme.fonts.sans,
                    }}
                  >{r}</button>
                ))}
              </div>
            </>
          )}

          <label style={{ fontSize: '0.75rem', color: theme.colors.mossGreen, display: 'block', marginBottom: '5px' }}>Email</label>
          <input style={inputStyle} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />

          <label style={{ fontSize: '0.75rem', color: theme.colors.mossGreen, display: 'block', marginBottom: '5px' }}>Password</label>
          <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

          {error && <p style={{ color: '#D9534F', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{error}</p>}

          <button onClick={handleSubmit} style={{
            width: '100%', padding: '0.75rem', background: theme.colors.kombuGreen,
            color: theme.colors.bone, border: 'none', borderRadius: '25px',
            fontSize: '0.88rem', cursor: 'pointer', letterSpacing: '0.5px', fontFamily: theme.fonts.sans,
          }}>
            {isRegister ? 'Create account' : 'Sign in'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: theme.colors.mossGreen, marginTop: '1rem' }}>
            {isRegister ? 'Already have an account? ' : 'No account? '}
            <span onClick={() => setIsRegister(!isRegister)} style={{ color: theme.colors.kombuGreen, cursor: 'pointer', fontWeight: 500 }}>
              {isRegister ? 'Sign in' : 'Create one'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { theme } from '../theme/colors';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const FALLBACKS = [
  "That makes so much sense. What you're carrying is invisible to most people, but it's very real.",
  "You don't have to explain yourself here. What you're feeling is a completely normal part of this journey.",
  "You are the invisible patient. And your exhaustion is valid — even when no one else sees it.",
  "It's okay to feel angry, or resentful, or just completely done. Those feelings don't make you a bad caretaker.",
  "Take a slow breath. You are doing something incredibly hard, and you deserve care too.",
  "I hear you. Is there one small thing — even tiny — you could do for yourself today?",
];

export default function ChatPage({ user, entries, burnoutZone }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello. I'm glad you're here. You don't have to be strong right now. How are you doing?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          burnout_zone: burnoutZone,
          journal_context: entries.slice(0, 3).map(e => `Mood: ${e.moodLabel}. "${e.text.slice(0, 120)}"`).join('\n'),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch {
      const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
      setMessages(prev => [...prev, { role: 'ai', text: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  const zoneColor = burnoutZone === 'Critical Burnout' ? '#D9534F' : burnoutZone === 'Warning' ? '#BA7517' : '#3B6D11';

  return (
    <div>
      {/* Burnout strip */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fff', border: `0.5px solid ${theme.colors.tan}`,
        borderRadius: '10px', padding: '0.6rem 1rem', marginBottom: '1rem',
      }}>
        <span style={{ fontSize: '0.72rem', color: theme.colors.mossGreen, letterSpacing: '0.5px' }}>Your burnout zone</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: zoneColor }}>{burnoutZone}</span>
      </div>

      {/* Chat log */}
      <div ref={logRef} style={{
        minHeight: '280px', maxHeight: '380px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: '10px',
        marginBottom: '0.75rem', padding: '0.25rem 0',
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            maxWidth: '82%',
            padding: '0.65rem 0.95rem',
            borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            background: m.role === 'user' ? theme.colors.kombuGreen : '#fff',
            color: m.role === 'user' ? theme.colors.bone : theme.colors.cafeNoir,
            fontFamily: m.role === 'ai' ? theme.fonts.serif : theme.fonts.sans,
            fontSize: '0.9rem', lineHeight: 1.65,
            border: m.role === 'ai' ? `0.5px solid ${theme.colors.tan}` : 'none',
          }}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{
            alignSelf: 'flex-start', padding: '0.65rem 0.95rem',
            background: '#fff', border: `0.5px solid ${theme.colors.tan}`,
            borderRadius: '14px 14px 14px 3px', fontSize: '0.85rem',
            color: theme.colors.mossGreen, fontStyle: 'italic',
          }}>
            Resonance is with you…
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Say anything…"
          style={{
            flex: 1, padding: '0.65rem 1rem',
            border: `0.5px solid ${theme.colors.tan}`,
            borderRadius: '20px', background: '#fff',
            fontSize: '0.9rem', color: theme.colors.text,
            fontFamily: theme.fonts.sans, outline: 'none',
          }}
        />
        <button onClick={send} disabled={!input.trim() || loading} style={{
          padding: '0.65rem 1.2rem', background: theme.colors.kombuGreen,
          color: theme.colors.bone, border: 'none', borderRadius: '20px',
          fontSize: '0.85rem', cursor: 'pointer', fontFamily: theme.fonts.sans,
          opacity: !input.trim() || loading ? 0.5 : 1,
        }}>
          Send
        </button>
      </div>
    </div>
  );
}

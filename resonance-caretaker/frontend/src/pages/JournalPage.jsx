import React, { useState } from 'react';
import { theme } from '../theme/colors';

const MOODS = [
  { score: 1, label: 'Overwhelmed', emoji: '😞' },
  { score: 2, label: 'Heavy', emoji: '😔' },
  { score: 3, label: 'Okay', emoji: '😐' },
  { score: 4, label: 'Lighter', emoji: '🙂' },
  { score: 5, label: 'Grateful', emoji: '😌' },
];

export default function JournalPage({ user, entries, setEntries }) {
  const [mood, setMood] = useState(null);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  const canSave = mood !== null && text.trim().length > 10;

  const handleSave = async () => {
    const entry = {
      text: text.trim(),
      mood,
      moodLabel: MOODS.find(m => m.score === mood)?.label,
      date: new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      ts: Date.now(),
    };

    // In production: POST /journal/vent with { content: entry.text }
    setEntries(prev => [entry, ...prev]);
    setText('');
    setMood(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontWeight: 400, color: theme.colors.cafeNoir, fontSize: '1.2rem' }}>Today's entry</h2>
        <p style={{ fontSize: '0.8rem', color: theme.colors.mossGreen, marginTop: '2px' }}>Write freely. Only you can see this.</p>
      </div>

      {/* Mood picker */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        {MOODS.map(m => (
          <button key={m.score} onClick={() => setMood(m.score)} style={{
            flex: 1, padding: '10px 4px', border: `0.5px solid ${mood === m.score ? theme.colors.kombuGreen : theme.colors.tan}`,
            borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
            background: mood === m.score ? theme.colors.kombuGreen : '#fff',
            transition: 'all 0.15s',
          }}>
            <div style={{ fontSize: '1.1rem' }}>{m.emoji}</div>
            <div style={{ fontSize: '0.62rem', marginTop: '3px', color: mood === m.score ? theme.colors.bone : theme.colors.mossGreen, fontFamily: theme.fonts.sans }}>{m.label}</div>
          </button>
        ))}
      </div>

      {/* Text area */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What's on your mind today? There's no right way to start."
        style={{
          width: '100%', minHeight: '160px', padding: '1rem',
          border: `0.5px solid ${theme.colors.tan}`, borderRadius: '12px',
          background: theme.colors.bone, fontFamily: theme.fonts.serif,
          fontSize: '1.05rem', color: theme.colors.cafeNoir, resize: 'none',
          lineHeight: 1.7, outline: 'none',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
        {saved && <span style={{ fontSize: '0.82rem', color: theme.colors.mossGreen, fontStyle: 'italic' }}>Entry saved.</span>}
        <button onClick={handleSave} disabled={!canSave} style={{
          padding: '0.6rem 1.6rem', background: canSave ? theme.colors.kombuGreen : theme.colors.tan,
          color: theme.colors.bone, border: 'none', borderRadius: '20px',
          fontSize: '0.82rem', cursor: canSave ? 'pointer' : 'default',
          fontFamily: theme.fonts.sans, letterSpacing: '0.5px', transition: 'background 0.2s',
        }}>
          Save entry
        </button>
      </div>

      {/* Past entries */}
      {entries.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontFamily: theme.fonts.serif, fontWeight: 400, color: theme.colors.cafeNoir, fontSize: '1rem', marginBottom: '1rem' }}>Recent entries</h3>
          {entries.slice(0, 5).map((e, i) => (
            <div key={e.ts} style={{
              background: '#fff', border: `0.5px solid ${theme.colors.tan}`,
              borderRadius: '10px', padding: '0.9rem 1rem', marginBottom: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.88rem' }}>{MOODS.find(m => m.score === e.mood)?.emoji}</span>
                <span style={{ fontSize: '0.7rem', color: theme.colors.mossGreen }}>{e.moodLabel}</span>
                <span style={{ fontSize: '0.7rem', color: theme.colors.tan, marginLeft: 'auto' }}>{e.date}</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: theme.colors.cafeNoir, fontFamily: theme.fonts.serif, fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
                {e.text.length > 160 ? e.text.slice(0, 160) + '…' : e.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

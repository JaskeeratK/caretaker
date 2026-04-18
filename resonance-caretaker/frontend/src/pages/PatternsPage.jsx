import React, { useMemo } from 'react';
import { theme } from '../theme/colors';

const UNSAID_INSIGHTS = [
  {
    label: 'Suppressed emotion',
    color: '#FAEEDA',
    textColor: '#633806',
    insight: "You often describe things as 'fine' or 'okay' on days where your mood score was lowest. It looks like you might be holding more than you're letting yourself say.",
    evidence: 'Positive language detected alongside low mood scores across recent entries',
    minEntries: 2,
  },
  {
    label: 'Repetition loop',
    color: '#E1F5EE',
    textColor: '#085041',
    insight: "The theme of feeling unseen keeps surfacing — in different words, on different days. This isn't just venting. It's something that may need attention.",
    evidence: 'Similar emotional themes identified across multiple recent entries',
    minEntries: 3,
  },
  {
    label: 'Emotional drop',
    color: '#FAECE7',
    textColor: '#712B13',
    insight: "Your mood has been declining while your language stays neutral or reassuring. That gap — between how things sound and how they actually feel — is worth paying attention to.",
    evidence: 'Declining mood trend vs. neutral language tone detected',
    minEntries: 4,
  },
];

export default function PatternsPage({ entries }) {
  const moodHistory = useMemo(() => {
    const last7 = entries.slice(0, 7).reverse();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
    return days.map((day, i) => ({
      day,
      mood: last7[i]?.mood ?? null,
    }));
  }, [entries]);

  const avgMood = entries.length
    ? (entries.slice(0, 7).reduce((a, e) => a + e.mood, 0) / Math.min(entries.length, 7)).toFixed(1)
    : null;

  if (!entries.length) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <p style={{ fontFamily: theme.fonts.serif, color: theme.colors.mossGreen, fontSize: '1rem', fontStyle: 'italic' }}>
          Write a few journal entries to see your patterns here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontWeight: 400, color: theme.colors.cafeNoir, fontSize: '1.2rem' }}>Your patterns</h2>
        <p style={{ fontSize: '0.8rem', color: theme.colors.mossGreen, marginTop: '2px' }}>What your journal reveals — including what you might not be saying.</p>
      </div>

      {/* Stat row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
        {[
          { label: 'Entries this week', value: Math.min(entries.length, 7) },
          { label: 'Average mood', value: avgMood ? `${avgMood} / 5` : '—' },
          { label: 'Trend', value: entries.length >= 2 && entries[0].mood < entries[1].mood ? 'Declining' : entries.length >= 2 && entries[0].mood > entries[1].mood ? 'Improving' : 'Steady' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#fff', border: `0.5px solid ${theme.colors.tan}`, borderRadius: '10px', padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '0.7rem', color: theme.colors.mossGreen, marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 500, color: theme.colors.cafeNoir }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Mood chart */}
      <div style={{ background: '#fff', border: `0.5px solid ${theme.colors.tan}`, borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: theme.colors.mossGreen, marginBottom: '0.75rem', letterSpacing: '0.3px' }}>Mood this week</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
          {moodHistory.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{
                width: '100%',
                height: d.mood ? `${Math.round((d.mood / 5) * 68)}px` : '4px',
                background: d.mood ? theme.colors.kombuGreen : theme.colors.tan,
                borderRadius: '3px 3px 0 0',
                opacity: d.mood ? 0.4 + (d.mood / 5) * 0.6 : 0.3,
                transition: 'height 0.3s',
              }} />
              <div style={{ fontSize: '0.62rem', color: theme.colors.mossGreen }}>{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Unsaid Layer */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.72rem', color: theme.colors.mossGreen, letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
          Unsaid layer — what the patterns suggest
        </div>
        {UNSAID_INSIGHTS.filter(ins => entries.length >= ins.minEntries).map((ins, i) => (
          <div key={i} style={{
            background: ins.color, borderRadius: '12px',
            padding: '1rem 1.25rem', marginBottom: '0.75rem',
          }}>
            <div style={{
              display: 'inline-block', fontSize: '0.68rem', fontWeight: 500,
              padding: '2px 10px', borderRadius: '10px', marginBottom: '0.5rem',
              background: 'rgba(255,255,255,0.5)', color: ins.textColor,
            }}>{ins.label}</div>
            <p style={{ fontFamily: theme.fonts.serif, fontSize: '0.95rem', color: ins.textColor, lineHeight: 1.7, marginBottom: '0.4rem' }}>
              {ins.insight}
            </p>
            <p style={{ fontSize: '0.72rem', color: ins.textColor, opacity: 0.7, fontStyle: 'italic', margin: 0 }}>
              {ins.evidence}
            </p>
          </div>
        ))}
        {entries.length < 2 && (
          <p style={{ fontSize: '0.82rem', color: theme.colors.mossGreen, fontStyle: 'italic' }}>
            Keep journaling — deeper insights unlock after a few more entries.
          </p>
        )}
      </div>
    </div>
  );
}

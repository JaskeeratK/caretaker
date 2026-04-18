import React, { useState } from 'react';
import { theme } from '../theme/colors';

const GROUPS = [
  {
    id: 0,
    name: 'Caring for a parent',
    desc: 'For adult children navigating the role reversal — when you become the caretaker of the person who once cared for you.',
    members: ['AR', 'MK', 'PJ', 'SL'],
    count: 47,
    tag: 'parent caretaker',
    seed: [
      { name: 'AR', text: 'Some days I just sit in my car for five minutes before going inside. That\'s my only break.' },
      { name: 'MK', text: 'I do exactly this. You\'re not alone in that.' },
      { name: 'PJ', text: 'That five minutes is survival. Don\'t ever give it up.' },
    ],
  },
  {
    id: 1,
    name: 'Spousal caretakers',
    desc: 'When your partner is the one who needs constant care. The loneliness of that is unlike anything else.',
    members: ['DN', 'RV', 'TM'],
    count: 29,
    tag: 'spousal care',
    seed: [
      { name: 'DN', text: 'Does anyone else feel guilty for wanting one day off?' },
      { name: 'RV', text: 'Every single day. And then feel guilty for feeling guilty.' },
      { name: 'TM', text: 'The guilt is part of it. It doesn\'t mean you love them less.' },
    ],
  },
  {
    id: 2,
    name: 'Chronic illness journeys',
    desc: 'For those in the long haul — years, not months. Where resilience and exhaustion coexist daily.',
    members: ['AC', 'BF', 'HQ', 'LN', 'YP'],
    count: 83,
    tag: 'chronic care',
    seed: [
      { name: 'HQ', text: 'She had a good day today and I cried in the bathroom because I didn\'t know what to do with that feeling.' },
      { name: 'AC', text: 'That\'s the paradox of this whole life. Good days can be disorienting.' },
      { name: 'LN', text: 'Like you forgot how to breathe normally when things aren\'t in crisis mode.' },
    ],
  },
  {
    id: 3,
    name: 'First-year caretakers',
    desc: 'Just starting out and overwhelmed. A gentler group for those still finding their footing.',
    members: ['JW', 'EM'],
    count: 18,
    tag: 'new caretaker',
    seed: [
      { name: 'JW', text: 'I haven\'t had a full night\'s sleep in 11 months.' },
      { name: 'EM', text: 'Neither have I. And people keep saying "you look tired" like I don\'t know.' },
    ],
  },
];

const PEER_REPLIES = [
  'Thank you for sharing that. We hear you.',
  'That resonates so much. You\'re not alone in this.',
  'Yes. Exactly this. I\'ve been feeling the same way.',
  'Sending you so much support right now.',
  'This group needed someone to say that out loud. Thank you.',
];

export default function GroupsPage({ user }) {
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [groupMsgs, setGroupMsgs] = useState(() =>
    Object.fromEntries(GROUPS.map(g => [g.id, [...g.seed]]))
  );
  const [inputs, setInputs] = useState({});

  const toggleJoin = (id) => {
    setJoinedGroups(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    setActiveGroup(prev => prev === id ? null : id);
  };

  const sendMsg = (groupId) => {
    const text = (inputs[groupId] || '').trim();
    if (!text) return;
    const myName = user?.name?.slice(0, 2).toUpperCase() || 'ME';
    setGroupMsgs(prev => ({
      ...prev,
      [groupId]: [...prev[groupId], { name: myName, text, mine: true }],
    }));
    setInputs(prev => ({ ...prev, [groupId]: '' }));

    setTimeout(() => {
      const group = GROUPS.find(g => g.id === groupId);
      const peerName = group.members[Math.floor(Math.random() * group.members.length)];
      const reply = PEER_REPLIES[Math.floor(Math.random() * PEER_REPLIES.length)];
      setGroupMsgs(prev => ({
        ...prev,
        [groupId]: [...prev[groupId], { name: peerName, text: reply, mine: false }],
      }));
    }, 1500);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontWeight: 400, color: theme.colors.cafeNoir, fontSize: '1.2rem' }}>Peer groups</h2>
        <p style={{ fontSize: '0.8rem', color: theme.colors.mossGreen, marginTop: '2px' }}>People who get it without explanation.</p>
      </div>

      {GROUPS.map(group => {
        const isJoined = joinedGroups.includes(group.id);
        const isOpen = activeGroup === group.id;

        return (
          <div key={group.id} style={{
            background: '#fff',
            border: `0.5px solid ${isJoined ? theme.colors.kombuGreen : theme.colors.tan}`,
            borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '0.85rem',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              {/* Avatars */}
              <div style={{ display: 'flex' }}>
                {group.members.slice(0, 4).map((av, i) => (
                  <div key={i} style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: '#EAF3DE', border: `1.5px solid #fff`,
                    marginLeft: i === 0 ? 0 : '-6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', fontWeight: 500, color: '#27500A',
                    zIndex: group.members.length - i,
                  }}>{av}</div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: '0.9rem', color: theme.colors.cafeNoir }}>{group.name}</div>
                <div style={{ fontSize: '0.7rem', color: theme.colors.mossGreen }}>{group.count} members</div>
              </div>
              <button onClick={() => toggleJoin(group.id)} style={{
                padding: '5px 14px', borderRadius: '14px', fontSize: '0.75rem', cursor: 'pointer',
                border: `0.5px solid ${theme.colors.kombuGreen}`,
                background: isJoined ? theme.colors.kombuGreen : 'transparent',
                color: isJoined ? theme.colors.bone : theme.colors.kombuGreen,
                fontFamily: theme.fonts.sans,
              }}>
                {isJoined ? 'Joined' : 'Join'}
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: theme.colors.mossGreen, lineHeight: 1.55, marginBottom: '0.6rem' }}>{group.desc}</p>
            <span style={{
              fontSize: '0.68rem', padding: '2px 10px',
              background: '#EAF3DE', color: '#27500A', borderRadius: '10px',
            }}>{group.tag}</span>

            {/* Group chat — only visible when joined */}
            {isJoined && (
              <div style={{ marginTop: '1rem', borderTop: `0.5px solid ${theme.colors.tan}`, paddingTop: '1rem' }}>
                <div style={{
                  height: '180px', overflowY: 'auto',
                  display: 'flex', flexDirection: 'column', gap: '8px',
                  marginBottom: '0.75rem',
                }}>
                  {(groupMsgs[group.id] || []).map((m, i) => (
                    <div key={i} style={{ fontSize: '0.83rem', lineHeight: 1.55, color: theme.colors.cafeNoir }}>
                      <span style={{
                        fontWeight: 500, fontSize: '0.7rem', marginRight: '4px',
                        color: m.mine ? theme.colors.kombuGreen : theme.colors.mossGreen,
                      }}>{m.name}</span>
                      {m.text}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    value={inputs[group.id] || ''}
                    onChange={e => setInputs(prev => ({ ...prev, [group.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && sendMsg(group.id)}
                    placeholder="Share something…"
                    style={{
                      flex: 1, padding: '0.5rem 0.85rem',
                      border: `0.5px solid ${theme.colors.tan}`,
                      borderRadius: '20px', background: theme.colors.background,
                      fontSize: '0.83rem', color: theme.colors.text,
                      fontFamily: theme.fonts.sans, outline: 'none',
                    }}
                  />
                  <button onClick={() => sendMsg(group.id)} style={{
                    padding: '0.5rem 1rem', background: theme.colors.kombuGreen,
                    color: theme.colors.bone, border: 'none', borderRadius: '20px',
                    fontSize: '0.78rem', cursor: 'pointer',
                  }}>Send</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

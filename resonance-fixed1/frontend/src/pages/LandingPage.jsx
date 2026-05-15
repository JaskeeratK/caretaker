import React, { useState, useEffect } from 'react';
import { theme } from '../theme/colors';

const c = theme.colors;

export default function LandingPage({ onGetStarted, onLogin }) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
            // background: '#06402B',
            background : '#1A1714',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '3px 3px',
            minHeight: '100vh',
            overflowX: 'hidden'
          }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1.2rem 2.5rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        alignItems: 'center',
        background: scrolled ? 'rgba(13,59,46,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${c.border}` : 'none',
        transition: 'all 0.3s ease',
      }}>
        {/* LEFT */}
        <a href="#about" style={{
          fontFamily: theme.fonts.serif,fontSize: '0.99rem', letterSpacing: '3px', color: c.bone,
          textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.target.style.color = c.textSecondary}
          onMouseLeave={e => e.target.style.color = c.bone}>
          About
        </a>

        {/* CENTER */}
        <a href="#journal" style={{
          fontFamily: theme.fonts.serif,fontSize: '0.99rem', letterSpacing: '3px', color: c.bone,
          textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.target.style.color = c.textSecondary}
          onMouseLeave={e => e.target.style.color = c.bone}>
          Journal
        </a>

        {/* RIGHT */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onGetStarted} style={{
            background: 'transparent', border: 'none',
            color: c.bone, fontFamily: theme.fonts.serif,fontSize: '0.99rem', letterSpacing: '3px',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = c.textSecondary}
            onMouseLeave={e => e.target.style.color = c.bone}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '0 2.5rem',
      }}>

        {/* RESONANCE — centered at top */}
        <div style={{
          textAlign: 'center',
          paddingTop: '6rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <h1 style={{
            fontFamily: theme.fonts.serif,
            fontSize: 'clamp(3rem, 7vw, 5rem)',
            fontWeight: 300,
            letterSpacing: '18px',
            color: c.bone,
            lineHeight: 1.05,
            marginBottom: '0.6rem',
          }}>
            RESONANCE
          </h1>
          <p style={{
            fontSize: '1.4rem',
            color: c.textSecondary,
            letterSpacing: '2px',
            fontFamily: theme.fonts.serif,
            fontStyle: 'italic',  // ← add this back
            fontWeight: 300,
          }}>
            you care for them, we care for you
          </p>
        </div>

        {/* BOTTOM ROW — paragraph left, image right */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          paddingBottom: '2rem',
          paddingTop: '1rem',
        }}>

          {/* LEFT: paragraph + button */}
          <div style={{
            maxWidth: '600px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.9s ease 0.3s',
          }}>
            <p style={{
              fontSize: '1.2rem',
              color: c.textSecondary,
              lineHeight: 1.85,
              marginBottom: '2.5rem',
              fontFamily: theme.fonts.serif,
              fontWeight: 300,
            }}>
              There are millions of family caretakers globally who manage
              the lives of others — be it elderly parents, children with
              disabilities, or spouses with chronic illnesses. While the
              "primary patient" receives medical attention, the caretaker
              often becomes the <em>"Second Patient,"</em> suffering from extreme
              emotional exhaustion, isolation, and burnout.
            </p>

            <button onClick={onGetStarted} style={{
              padding: '0.85rem 0',
              background: 'transparent',
              border: 'none',
              color: c.bone,
              fontSize: '0.85rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'color 0.25s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = c.textSecondary}
              onMouseLeave={e => e.currentTarget.style.color = c.bone}>
              Begin →
            </button>
          </div>

          {/* RIGHT: image */}
          <div style={{
            height: '420px',
            width: '420px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            marginRight: '4rem',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 85%)',
            maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 85%)',
          }}>
            <img
              src="/caretakerr.png"
              alt="Caretaker illustration"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="about" style={{ padding: '5rem 2.5rem', borderTop: `1px solid ${c.border}` }}>
        <p style={{ fontSize: '0.72rem', letterSpacing: '3px', color: c.textMuted, textTransform: 'uppercase', textAlign: 'center', marginBottom: '3rem' }}>
          What Resonance offers
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '✦', title: 'Burnout Tracking', desc: 'A personal burnout score that understands the invisible weight you carry every day.' },
            { icon: '◈', title: 'Private Journal', desc: 'Your words are yours alone. Write freely in an encrypted space that listens without judgment.' },
            { icon: '⬡', title: 'AI Companion', desc: 'Warm, grounded support available whenever you need to process your feelings.' },
            { icon: '◉', title: 'Peer Groups', desc: 'Connect with others who understand the caretaker journey without needing explanation.' },
          ].map((f, i) => (
            <div key={i} style={{
              padding: '1.5rem',
              border: `1px solid ${c.border}`,
              borderRadius: '2px',
              background: c.bgCard,
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.borderLight; e.currentTarget.style.background = c.bgCardHover; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.bgCard; }}>
              <div style={{ fontSize: '1.2rem', color: c.gold, marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontFamily: theme.fonts.serif, fontSize: '1.05rem', color: c.bone, fontWeight: 400, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.82rem', color: c.textSecondary, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER QUOTE */}
      <section style={{ padding: '4rem 2.5rem 5rem', textAlign: 'center', borderTop: `1px solid ${c.border}` }}>
        <p style={{ fontFamily: theme.fonts.serif, fontSize: '1.4rem', fontStyle: 'italic', color: c.textSecondary, maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
          "You are doing something incredibly hard, and you deserve care too."
        </p>
        <button onClick={onGetStarted} style={{
          padding: '0.9rem 2.5rem',
          background: 'transparent',
          border: `1px solid ${c.borderLight}`,
          borderRadius: '2px',
          color: c.bone,
          fontSize: '0.8rem',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          transition: 'all 0.25s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = c.bgCard; e.currentTarget.style.borderColor = c.gold; e.currentTarget.style.color = c.gold; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = c.borderLight; e.currentTarget.style.color = c.bone; }}>
          Get Started →
        </button>
        <p style={{ marginTop: '3rem', fontSize: '0.72rem', color: c.textMuted, letterSpacing: '1px' }}>
          © 2026 Resonance · For caretakers everywhere
        </p>
      </section>

    </div>
  );
}
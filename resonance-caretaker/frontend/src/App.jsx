import React, { useState, useEffect } from 'react';
import { theme } from './theme/colors';
import ScoreGauge from './components/ScoreGauge'; // Ensure this file exists!

function App() {
  const [ventingText, setVentingText] = useState("");
  const [burnoutData, setBurnoutData] = useState({ score: 0, zone: "Loading...", narrative: "" });
  const [isReleasing, setIsReleasing] = useState(false);

  // 1. Fetch Burnout Data on Load
  useEffect(() => {
    fetchBurnout();
  }, []);

  const fetchBurnout = async () => {
    try {
      const response = await fetch('http://localhost:8000/burnout/score');
      const data = await response.json();
      setBurnoutData(data);
    } catch (err) {
      console.error("Backend not reachable", err);
    }
  };

  // 2. Handle Venting Submission
  const handleRelease = async () => {
    if (!ventingText.trim()) return;
    
    setIsReleasing(true);
    try {
      await fetch('http://localhost:8000/journal/vent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: ventingText })
      });
      
      // Clear text and refresh score after a small delay for dramatic effect
      setTimeout(() => {
        setVentingText("");
        setIsReleasing(false);
        fetchBurnout();
      }, 1000);
    } catch (err) {
      setIsReleasing(false);
      alert("Failed to release thoughts. Is the backend running?");
    }
  };

  const vaultStyle = {
    background: theme.colors.bone,
    color: `rgba(76, 61, 25, ${Math.max(0.1, 1 - ventingText.length / 600)})`,
    transition: 'color 0.8s ease, opacity 1s ease',
    padding: '2rem',
    borderRadius: '15px',
    border: 'none',
    width: '100%',
    minHeight: '250px',
    fontFamily: theme.fonts.serif,
    fontSize: '1.5rem',
    opacity: isReleasing ? 0 : 1,
    outline: 'none',
    resize: 'none'
  };

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh', padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontFamily: theme.fonts.serif, color: theme.colors.cafeNoir, fontSize: '3rem', letterSpacing: '4px' }}>RESONANCE</h1>
        <p style={{ color: theme.colors.mossGreen, fontStyle: 'italic' }}>for the invisible patient</p>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Burnout Section */}
        <section style={{ marginBottom: '5rem', textAlign: 'center' }}>
          <ScoreGauge score={burnoutData.score} zone={burnoutData.zone} />
          <p style={{ marginTop: '1.5rem', color: theme.colors.cafeNoir, fontFamily: theme.fonts.serif, fontSize: '1.2rem' }}>
            {burnoutData.narrative}
          </p>
        </section>

        {/* Venting Vault Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontFamily: theme.fonts.serif, color: theme.colors.cafeNoir }}>Venting Vault</h2>
              <p style={{ fontSize: '0.9rem', color: theme.colors.mossGreen }}>Your words stay private. They fade as you pour them out.</p>
            </div>
            <button 
              onClick={handleRelease}
              style={{
                backgroundColor: theme.colors.kombuGreen,
                color: theme.colors.bone,
                padding: '0.8rem 1.5rem',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontFamily: theme.fonts.sans,
                fontWeight: 'bold'
              }}
            >
              RELEASE
            </button>
          </div>
          
          <textarea 
            style={vaultStyle}
            placeholder="What is feeling heavy today?"
            value={ventingText}
            onChange={(e) => setVentingText(e.target.value)}
            disabled={isReleasing}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
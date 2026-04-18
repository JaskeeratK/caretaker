import React from 'react';
import { theme } from '../theme/colors';

export default function ScoreGauge({ score, zone }) {
  const getZoneColor = () => {
    if (zone === "Critical Burnout") return "#D9534F"; // Muted Red
    if (zone === "Warning") return theme.colors.cafeNoir;
    return theme.colors.mossGreen;
  };

  return (
    <div style={{ 
      border: `2px solid ${theme.colors.tan}`, 
      padding: '2rem', 
      borderRadius: '50%', 
      width: '250px', 
      height: '250px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      margin: '0 auto'
    }}>
      <span style={{ fontSize: '0.8rem', color: theme.colors.kombuGreen, letterSpacing: '2px' }}>BURNOUT INDEX</span>
      <h1 style={{ fontSize: '3.5rem', color: getZoneColor(), margin: '0' }}>{score}</h1>
      <span style={{ fontFamily: theme.fonts.serif, fontStyle: 'italic' }}>{zone}</span>
    </div>
  );
}
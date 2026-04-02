import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="IdeaTesseract Logo - A multi-dimensional business architect"
    >
      <defs>
        <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="1" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eab308" stopOpacity="1" />
          <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer Cube (The Expanding Market) */}
      <path 
        d="M50 5 L90 28 L90 72 L50 95 L10 72 L10 28 Z" 
        stroke="url(#neonGlow)" 
        strokeWidth="2.5" 
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M10 28 L50 50 L90 28" stroke="url(#neonGlow)" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <path d="M50 50 L50 95" stroke="url(#neonGlow)" strokeWidth="2.5" strokeLinejoin="round" fill="none" />

      {/* Inner Cube (The Idea Structure) */}
      <path 
        d="M50 25 L70 36 L70 64 L50 75 L30 64 L30 36 Z" 
        stroke="url(#neonGlow)" 
        strokeWidth="3.5" 
        strokeLinejoin="round"
        fill="url(#neonGlow)"
        fillOpacity="0.15"
      />
      <path d="M30 36 L50 48 L70 36" stroke="url(#neonGlow)" strokeWidth="3.5" strokeLinejoin="round" fill="none" />
      <path d="M50 48 L50 75" stroke="url(#neonGlow)" strokeWidth="3.5" strokeLinejoin="round" fill="none" />

      {/* Tesseract Connections (Connecting Idea to Market) */}
      <path d="M50 5 L50 25" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2 3" />
      <path d="M90 28 L70 36" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2 3" />
      <path d="M90 72 L70 64" stroke="#eab308" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2 3" />
      <path d="M50 95 L50 75" stroke="#eab308" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2 3" />
      <path d="M10 72 L30 64" stroke="#eab308" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2 3" />
      <path d="M10 28 L30 36" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2 3" />
      <path d="M50 50 L50 48" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2 3" />

      {/* The Core Idea Spark */}
      <circle cx="50" cy="48" r="12" fill="url(#coreGlow)" className="animate-pulse" />
      <circle cx="50" cy="48" r="3" fill="#eab308" />
      
      {/* Orbiting Nodes (Execution details) */}
      <circle cx="30" cy="36" r="2" fill="#0ea5e9" />
      <circle cx="70" cy="36" r="2" fill="#0ea5e9" />
      <circle cx="70" cy="64" r="2" fill="#eab308" />
      <circle cx="30" cy="64" r="2" fill="#eab308" />
      <circle cx="50" cy="25" r="2" fill="#0ea5e9" />
      <circle cx="50" cy="75" r="2" fill="#eab308" />
    </svg>
  );
};

export default Logo;

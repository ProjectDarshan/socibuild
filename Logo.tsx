import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 60 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md animate-float"
      >
        <defs>
            <linearGradient id="circle_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f766e" /> {/* Teal 700 */}
                <stop offset="100%" stopColor="#3b82f6" /> {/* Blue 500 */}
            </linearGradient>
            <radialGradient id="center_glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="white" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </radialGradient>
        </defs>

        {/* Main Background Circle */}
        <circle cx="50" cy="50" r="48" fill="url(#circle_grad)" />
        
        {/* Inner Ring */}
        <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6" />

        {/* Central Element: Abstract Social Connection (Smiley/Spark) */}
        <circle cx="50" cy="50" r="20" fill="url(#center_glow)" />
        {/* Simple Smile */}
        <path d="M 40 55 Q 50 62 60 55" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="42" cy="45" r="3" fill="white" />
        <circle cx="58" cy="45" r="3" fill="white" />

        {/* Icon: Speaking (Speech Bubble) - Top */}
        <g transform="translate(50, 20)">
            <circle cx="0" cy="0" r="10" fill="white" fillOpacity="0.25" />
            <path d="M -4 -2 Q -4 -5 0 -5 Q 4 -5 4 -2 Q 4 1 2 2 L 2 4 L 0 2 Q -4 2 -4 -2" fill="white" />
        </g>

        {/* Icon: Email (Writing) - Right */}
        <g transform="translate(80, 50)">
            <circle cx="0" cy="0" r="10" fill="white" fillOpacity="0.25" />
            <path d="M -5 -3 L 5 -3 L 5 3 L -5 3 Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M -5 -3 L 0 0 L 5 -3" stroke="white" strokeWidth="1.5" />
        </g>

        {/* Icon: Interview (1-on-1) - Bottom */}
        <g transform="translate(50, 80)">
             <circle cx="0" cy="0" r="10" fill="white" fillOpacity="0.25" />
             {/* Two figures */}
             <circle cx="-3" cy="-2" r="2" fill="white" />
             <path d="M -6 4 Q -3 0 -1 4" stroke="white" strokeWidth="1.5" />
             
             <circle cx="3" cy="-2" r="2" fill="white" />
             <path d="M 6 4 Q 3 0 1 4" stroke="white" strokeWidth="1.5" />
        </g>

        {/* Icon: Mic (Listening) - Left */}
        <g transform="translate(20, 50)">
             <circle cx="0" cy="0" r="10" fill="white" fillOpacity="0.25" />
             <rect x="-2" y="-4" width="4" height="6" rx="2" fill="white" />
             <path d="M -3 0 Q -3 4 0 4 Q 3 4 3 0" stroke="white" strokeWidth="1" fill="none" />
             <line x1="0" y1="4" x2="0" y2="6" stroke="white" strokeWidth="1" />
        </g>

      </svg>
    </div>
  );
};
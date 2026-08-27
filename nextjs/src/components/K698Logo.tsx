import React from 'react';

export default function K698Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="k698GradBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="1" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="k698GradAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="1" />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="64" cy="64" r="62" fill="url(#k698GradBg)" />
      
      {/* Top accent line */}
      <path
        d="M 32 64 Q 64 32 96 64"
        stroke="url(#k698GradAccent)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* K shape - two diagonal lines and vertical */}
      <line x1="40" y1="48" x2="40" y2="92" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <polyline points="72,48 40,75 72,92" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Bottom accent line */}
      <path
        d="M 32 100 Q 64 115 96 100"
        stroke="url(#k698GradAccent)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

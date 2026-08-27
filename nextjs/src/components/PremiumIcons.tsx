import React from 'react';

export function IconSpiriualPower({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="spiritGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Central orb */}
      <circle cx="12" cy="12" r="6" fill="url(#spiritGrad)" opacity="0.3" stroke="currentColor" strokeWidth="1.5" />
      {/* Inner core */}
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      {/* Outer ring */}
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {/* Energy lines */}
      <path d="M 12 3 L 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 12 22 L 12 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 3 12 L 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 22 12 L 23 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconGuides({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book spine */}
      <path d="M 4 3 L 4 21 L 20 21 L 20 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Pages */}
      <line x1="7" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      <line x1="7" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      <line x1="7" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      <line x1="7" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      {/* Bookmark */}
      <path d="M 6 3 L 6 8" stroke="currentColor" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconCompliance({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield */}
      <path d="M 12 2 L 20 6 L 20 12 C 20 18 12 22 12 22 C 12 22 4 18 4 12 L 4 6 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Checkmark */}
      <path d="M 9 13 L 11 15 L 15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStorage({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stacked boxes */}
      <rect x="4" y="6" width="16" height="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="12" width="16" height="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dividing line */}
      <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Storage indicator */}
      <line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconSettings({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Center circle */}
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Outer ring with segments */}
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {/* Gear teeth */}
      <line x1="12" y1="3" x2="12" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="22" x2="12" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="12" x2="2" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5.5" y1="5.5" x2="5" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="18.5" y1="18.5" x2="19" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function IconHome({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Roof */}
      <path d="M 3 13 L 12 5 L 21 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* House body */}
      <rect x="4" y="13" width="16" height="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Door */}
      <rect x="10.5" y="15" width="3" height="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Door handle */}
      <circle cx="13" cy="18" r="0.5" fill="currentColor" />
      {/* Window */}
      <rect x="6" y="15.5" width="2.5" height="2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTasks({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Checklist items */}
      <rect x="3" y="3" width="18" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Item 1 */}
      <path d="M 8 7 L 6.5 8.5 L 7.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="9" y1="8" x2="19" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      {/* Item 2 */}
      <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      {/* Item 3 */}
      <line x1="6" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

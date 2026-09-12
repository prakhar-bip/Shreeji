import { SVGProps } from "react";

export function SELogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="50" cy="50" r="45" stroke="#E32636" strokeWidth="6" fill="#FDF3E7" />
      <line x1="50" y1="5" x2="50" y2="95" stroke="#E32636" strokeWidth="6" />
      <line x1="5" y1="50" x2="95" y2="50" stroke="#E32636" strokeWidth="6" />
      
      {/* S Curve - Top Left */}
      <path d="M 40 20 C 15 20, 15 45, 40 45" stroke="#E32636" strokeWidth="8" strokeLinecap="round" />
      {/* S Curve - Bottom Right */}
      <path d="M 60 55 C 85 55, 85 80, 60 80" stroke="#E32636" strokeWidth="8" strokeLinecap="round" />
      
      {/* E Lines - Top Right */}
      <path d="M 80 20 L 60 20 M 60 20 L 60 45 L 80 45 M 60 32.5 L 75 32.5" stroke="#E32636" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* E Lines - Bottom Left */}
      <path d="M 40 55 L 20 55 M 40 55 L 40 80 L 20 80 M 40 67.5 L 25 67.5" stroke="#E32636" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

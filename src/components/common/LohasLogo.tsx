import React, { useId } from 'react';

interface LohasLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  showTextLabel?: boolean;
}

/**
 * LohasLogo Component
 * Modern Electric Blue Architectural Building Icon
 * 사용자 요청 이미지(2026-09-25 17 40 04.png) 기반의 네온 블루 빌딩 랜드마크 로고
 */
export const LohasLogo: React.FC<LohasLogoProps> = ({
  className = "h-10 w-auto",
  width,
  height,
  showTextLabel = false
}) => {
  const id = useId();

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-h-full object-contain shrink-0 drop-shadow-md transition-transform duration-200"
        width={width}
        height={height}
      >
        <defs>
          {/* Dark Navy Rounded Background Gradient */}
          <linearGradient id={`${id}-bgGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#081120" />
            <stop offset="60%" stopColor="#0b172a" />
            <stop offset="100%" stopColor="#060c18" />
          </linearGradient>

          {/* Electric Neon Blue Stroke Gradient */}
          <linearGradient id={`${id}-neonBlue`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67b2fc" />
            <stop offset="50%" stopColor="#4da0f8" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Neon Glow Filter */}
          <filter id={`${id}-neonGlow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Squircle Dark Navy Background */}
        <rect
          x="6"
          y="6"
          width="188"
          height="188"
          rx="44"
          fill={`url(#${id}-bgGrad)`}
          stroke="#1e3a8a"
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />

        {/* Soft Ambient Inner Glow */}
        <ellipse
          cx="100"
          cy="105"
          rx="65"
          ry="55"
          fill="#38bdf8"
          fillOpacity="0.08"
          filter="blur(16px)"
        />

        {/* === BUILDING ICON (GLOWING BLUE STROKE) === */}
        <g filter={`url(#${id}-neonGlow)`}>
          {/* 1. Base Foundation Line */}
          <path
            d="M 38 154 H 162"
            stroke={`url(#${id}-neonBlue)`}
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* 2. Left Wing Building (Shorter Left Tier) */}
          <path
            d="M 76 86 H 58 C 50 86, 46 91, 46 98 V 154"
            stroke={`url(#${id}-neonBlue)`}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3. Right Wing Building (Stepped Medium Right Tier) */}
          <path
            d="M 124 70 H 142 C 150 70, 154 75, 154 83 V 154"
            stroke={`url(#${id}-neonBlue)`}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 4. Center Landmark Tower (Tallest Center Volume with Rounded Crest) */}
          <path
            d="M 76 154 V 58 C 76 48, 86 44, 100 44 C 114 44, 124 48, 124 58 V 154"
            stroke={`url(#${id}-neonBlue)`}
            strokeWidth="11.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5. Center Building Upper Window Slot */}
          <path
            d="M 87 74 H 113"
            stroke={`url(#${id}-neonBlue)`}
            strokeWidth="9.5"
            strokeLinecap="round"
          />

          {/* 6. Center Building Middle Window Slot */}
          <path
            d="M 87 97 H 113"
            stroke={`url(#${id}-neonBlue)`}
            strokeWidth="9.5"
            strokeLinecap="round"
          />

          {/* 7. Center Building Arched Entrance Doorway */}
          <path
            d="M 88 154 V 135 C 88 127, 112 127, 112 135 V 154"
            stroke={`url(#${id}-neonBlue)`}
            strokeWidth="9.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {/* Optional Brand Name Text Label */}
      {showTextLabel && (
        <div className="flex flex-col">
          <span className="font-black tracking-tight text-white text-base sm:text-lg leading-tight">
            로하스건축사사무소
          </span>
          <span className="text-[10px] sm:text-xs tracking-wider text-[#38bdf8] font-semibold">
            LOHAS ARCHITECTS
          </span>
        </div>
      )}
    </div>
  );
};

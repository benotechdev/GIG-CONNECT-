import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'full' | 'icon-only' | 'stacked';
  darkTheme?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  variant = 'full',
  darkTheme = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  };

  const IconSvg = (
    <svg
      viewBox="0 0 100 100"
      className={`${iconSizes[size]} shrink-0 drop-shadow-sm select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Spark rays */}
      <line x1="72" y1="20" x2="80" y2="12" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
      <line x1="62" y1="12" x2="62" y2="2" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
      <line x1="82" y1="32" x2="92" y2="32" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />

      {/* Top Blue Link / G-arc */}
      <path
        d="M 28 50 C 14 36 28 14 50 14 C 64 14 74 24 74 36 C 74 46 64 54 50 54"
        stroke="#1E40AF"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bottom Amber/Orange Link Interlocking */}
      <path
        d="M 72 50 C 86 64 72 86 50 86 C 36 86 26 76 26 64 C 26 54 36 46 50 46"
        stroke="#F59E0B"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />

      {/* Center inner hook detail */}
      <circle cx="50" cy="50" r="5" fill="#1E3A8A" />
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{IconSvg}</div>;
  }

  const textColor = darkTheme ? 'text-white' : 'text-slate-900';
  const taglineColor = darkTheme ? 'text-slate-300' : 'text-slate-700';

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {IconSvg}
        <div className="mt-2">
          <div className={`font-extrabold tracking-tight leading-none ${titleSizes[size]} ${textColor} font-sans`}>
            GIG <span className="text-blue-700 dark:text-blue-400">CONNECT</span>{' '}
            <span className="text-amber-500">UG</span>
          </div>
          {showTagline && (
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className={`font-semibold tracking-wide ${taglineSizes[size]} ${taglineColor}`}>
                Discover Events. Create Experiences.
              </span>
              {/* Uganda flag ribbon */}
              <div className="flex flex-col w-4 h-2.5 rounded-[1px] overflow-hidden shadow-xs">
                <div className="bg-black h-1/3 w-full" />
                <div className="bg-yellow-400 h-1/3 w-full" />
                <div className="bg-red-600 h-1/3 w-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {IconSvg}
      <div className="flex flex-col justify-center">
        <div className={`font-extrabold tracking-tight leading-none ${titleSizes[size]} ${textColor} flex items-center gap-1`}>
          <span>GIG</span>
          <span className="text-blue-700 dark:text-blue-400">CONNECT</span>
          <span className="text-amber-500">UG</span>
        </div>
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`font-medium tracking-normal ${taglineSizes[size]} ${taglineColor}`}>
              Discover Events. Create Experiences.
            </span>
            {/* Ugandan flag swoosh */}
            <div className="inline-flex flex-col w-3.5 h-2 rounded-[1px] overflow-hidden shadow-xs">
              <div className="bg-black h-1/3 w-full" />
              <div className="bg-yellow-400 h-1/3 w-full" />
              <div className="bg-red-600 h-1/3 w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

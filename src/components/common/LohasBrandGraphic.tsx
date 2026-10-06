import React from 'react';
import { LohasLogo } from './LohasLogo';

interface LohasBrandGraphicProps {
  className?: string;
}

export const LohasBrandGraphic: React.FC<LohasBrandGraphicProps> = ({ className = "" }) => {
  return (
    <div className={`w-full h-full min-h-[380px] bg-white rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center shadow-md border border-slate-200/80 select-none ${className}`}>
      {/* LOHAS Architectural Building Emblem */}
      <div className="w-full max-w-[150px] sm:max-w-[180px] aspect-square relative flex items-center justify-center mb-6">
        <LohasLogo className="w-full h-full" />
      </div>

      {/* Brand Text Block */}
      <div className="text-center space-y-1.5 w-full">
        {/* Colorful LIFESTYLES OF HEALTH AND SUSTAINABILITY */}
        <div className="text-base sm:text-lg lg:text-xl font-normal text-slate-900 tracking-tight leading-normal flex flex-wrap justify-center items-baseline gap-x-1 sm:gap-x-1.5">
          <span className="inline-flex items-baseline">
            <strong className="text-[#D32F2F] font-black text-xl sm:text-2xl lg:text-3xl leading-none mr-[1px]">L</strong>
            <span className="text-slate-900 font-normal">ifestyles</span>
          </span>
          <span className="inline-flex items-baseline">
            <strong className="text-[#D97706] font-black text-xl sm:text-2xl lg:text-3xl leading-none mr-[1px]">O</strong>
            <span className="text-slate-900 font-normal">f</span>
          </span>
          <span className="inline-flex items-baseline">
            <strong className="text-[#16A34A] font-black text-xl sm:text-2xl lg:text-3xl leading-none mr-[1px]">H</strong>
            <span className="text-slate-900 font-normal">ealth</span>
          </span>
          <span className="inline-flex items-baseline">
            <strong className="text-[#2563EB] font-black text-xl sm:text-2xl lg:text-3xl leading-none mr-[1px]">A</strong>
            <span className="text-slate-900 font-normal">nd</span>
          </span>
          <span className="inline-flex items-baseline">
            <strong className="text-[#9333EA] font-black text-xl sm:text-2xl lg:text-3xl leading-none mr-[1px]">S</strong>
            <span className="text-slate-900 font-normal">ustainability</span>
          </span>
        </div>

        {/* Architecture */}
        <div className="text-lg sm:text-xl font-normal text-slate-800 tracking-wide pt-1">
          Architecture
        </div>
      </div>
    </div>
  );
};

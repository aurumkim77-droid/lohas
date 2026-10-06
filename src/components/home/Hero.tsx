import React from 'react';
import { Phone, CheckCircle2, ChevronDown, MessageSquarePlus, ExternalLink } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { LohasLogo } from '../common/LohasLogo';

export const Hero: React.FC = () => {
  const { siteData, setCurrentPage } = useSiteContext();
  const { theme, settings } = siteData;
  const phoneNumber = settings.phone || '02-499-0229';

  return (
    <section className="relative bg-[#001528] text-white overflow-hidden min-h-[85vh] flex items-center">
      {/* Background Hero Image with Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={theme.heroImageUrl}
          alt="Lohas Architecture Hero"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center brightness-[0.5] scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001528] via-[#001528]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001528] via-transparent to-black/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-slate-100 text-xs sm:text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-[#f5ea1d] animate-ping" />
            <span>건축설계 · 인허가 컨설팅 솔루션</span>
          </div>

          {/* Main Titles */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-slate-200 tracking-tight">
              {theme.heroTitle}
            </h2>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center justify-center p-1 sm:p-1.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shrink-0 shadow-lg">
                <LohasLogo className="h-9 sm:h-11 md:h-12 w-auto" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                <span className="text-[#f5ea1d] underline decoration-[#f5ea1d]/40 decoration-4 underline-offset-8">
                  {theme.heroSubTitle}
                </span>
              </h1>
            </div>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl">
            {theme.heroDescription}
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-white/15 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#f5ea1d] shrink-0" />
              <span>건축설계 & 감리</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#f5ea1d] shrink-0" />
              <span>신속한 용도변경 인허가</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#f5ea1d] shrink-0" />
              <span>위반건축물 양성화 전문</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
            <a
              href={`tel:${phoneNumber}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#f5ea1d] hover:bg-amber-300 text-[#001528] font-black text-base shadow-lg shadow-[#f5ea1d]/20 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Phone size={18} className="fill-current stroke-[2]" />
              <span>{phoneNumber} 전화연결</span>
            </a>

            <a
              href={settings.qnaUrl || 'https://naver.me/xB7XkDIy'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#233b50] hover:bg-[#1a2d3e] text-white font-black text-base shadow-lg shadow-[#233b50]/30 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <MessageSquarePlus size={18} className="stroke-[2.5]" />
              <span>Q&A 온라인 문의</span>
              <ExternalLink size={14} />
            </a>

            <button
              onClick={() => setCurrentPage('/notices')}
              className="inline-flex items-center justify-center gap-2 px-[65px] py-2.5 rounded-xl bg-[#233b50] hover:bg-[#1a2d3e] text-white font-black text-base shadow-lg shadow-[#233b50]/30 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>공지사항</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1 text-slate-400 text-xs animate-bounce">
        <span>더 알아보기</span>
        <ChevronDown size={16} />
      </div>
    </section>
  );
};

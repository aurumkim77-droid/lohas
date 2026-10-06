import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { LocationSection } from '../home/LocationSection';
import { LohasLogo } from '../common/LohasLogo';

const DEFAULT_CAREERS = [
  '예종합건축사사무소, 유진인터내셔날종합건축사사무소 근무',
  '2008년 건축사 면허 취득, 건축사협회 정회원 등록',
  '2014년 로하스건축사사무소 개설',
  '현 로하스건축사사무소 대표',
  '건축물정기점검/해제감리/석면고급감리 실무교육 수료',
  '그린리모델링창조센터 그린리모델링 사업자 등록',
  '리모델링 및 인테리어 전문가',
  '성동구청 건축민원상담실 건축법 상담 건축사',
  '서울중앙지방법원등 법원감정인',
  '서울시 집수리전문관'
];

export const CompanyPage: React.FC = () => {
  const { siteData } = useSiteContext();
  const { companyInfo } = siteData;

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#001528] text-white py-16 px-4 sm:px-6 lg:px-8 mb-16 shadow-md">
        <div className="max-w-7xl mx-auto">
          <span className="text-[#f5ea1d] text-xs font-bold uppercase tracking-widest block mb-2">
            ABOUT LOHAS ARCHITECTS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">회사소개</h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            사람과 환경, 건축이 하나 되는 가치를 디자인하는 로하스건축사사무소를 소개합니다.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* CEO Greeting Section */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-lg space-y-6">
          <div className="space-y-3">
            <span className="text-[#001528] text-xs font-extrabold uppercase tracking-widest block">
              CEO GREETING
            </span>

            {/* LOHAS Brand Emblem matching official leaf logo */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="p-2 rounded-2xl bg-[#001528] inline-flex items-center justify-center shrink-0 w-fit shadow-md">
                  <LohasLogo className="h-12 sm:h-14 w-auto" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#001528] tracking-tight">
                    {companyInfo.name || '로하스건축사사무소'}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-500 tracking-wider">
                    LOHAS ARCHITECTS
                  </div>
                </div>
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-800 tracking-normal pt-2 border-t border-slate-200">
                <span className="text-red-600 font-extrabold text-xl sm:text-2xl">L</span>ifestyles{' '}
                <span className="text-amber-600 font-extrabold text-xl sm:text-2xl">O</span>f{' '}
                <span className="text-emerald-600 font-extrabold text-xl sm:text-2xl">H</span>ealth{' '}
                <span className="text-blue-600 font-extrabold text-xl sm:text-2xl">A</span>nd{' '}
                <span className="text-purple-600 font-extrabold text-xl sm:text-2xl">S</span>ustainability
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1d4ed8] pt-1">
                {companyInfo.greetingTitle}
              </h2>
            </div>
          </div>

          <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-sans border-l-4 border-[#001528] pl-5 bg-slate-50/50 py-3 rounded-r-xl">
            {companyInfo.greetingContent}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-900 text-sm">{companyInfo.ceoName}</span>
          </div>
        </section>

        {/* Architect Major Careers */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
            <div className="w-10 h-10 rounded-xl bg-[#001528] text-[#f5ea1d] flex items-center justify-center">
              <Award size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">대표 건축사 주요경력</h2>
              <p className="text-xs text-slate-500">풍부한 현장 경험과 전문적 신뢰를 바탕으로 한 주요 이력</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(companyInfo.architectCareers && companyInfo.architectCareers.length > 0
              ? companyInfo.architectCareers
              : DEFAULT_CAREERS
            ).map((career, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm hover:border-slate-300 transition"
              >
                <div className="mt-0.5 p-1 rounded-full bg-[#001528] text-[#f5ea1d] shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {career}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Location Section */}
      <div className="mt-20">
        <LocationSection />
      </div>
    </div>
  );
};

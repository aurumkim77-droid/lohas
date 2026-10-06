import React from 'react';
import { ExternalLink, CheckCircle2, PhoneCall, ArrowRight, ShieldCheck, FileCheck2, MessageSquarePlus } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';

export const BusinessAreasPage: React.FC = () => {
  const { siteData } = useSiteContext();
  const cards = [...siteData.businessCards].sort((a, b) => a.order - b.order);

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#001528] text-white py-16 px-4 sm:px-6 lg:px-8 mb-16 shadow-md">
        <div className="max-w-7xl mx-auto">
          <span className="text-[#f5ea1d] text-xs font-bold uppercase tracking-widest block mb-2">
            SPECIALIZED SERVICES
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">사업영역 안내</h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            건축설계, 감리, 용도변경, 증축 및 대수선, 리모델링 및 인테리어, 위반건축물 양성화까지 종합적인 솔루션을 제공합니다.
          </p>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {cards.map((card, idx) => {
          const isEven = idx % 2 === 1;
          return (
            <div
              key={card.id}
              className={`bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Box */}
              <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : ''}`}>
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg bg-slate-900 group">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 bg-[#001528] text-[#f5ea1d] text-xs font-black px-3 py-1.5 rounded-lg shadow">
                    CORE SERVICE 0{idx + 1}
                  </span>
                </div>
              </div>

              {/* Text Description Box */}
              <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-1' : ''}`}>
                <div>
                  <span className="text-xs font-extrabold text-[#001528] uppercase tracking-wider block mb-1">
                    {card.subtitle || 'SPECIALTY'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {card.title}
                  </h2>
                </div>

                <p className="text-base font-semibold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {card.description}
                </p>

                {card.details && (
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-2">
                    <p>{card.details}</p>
                  </div>
                )}

                {/* External URL button */}
                {card.externalUrl && (
                  <div className="pt-2">
                    <a
                      href={card.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#78eb64] text-[#001528] font-black text-xs hover:bg-[#68de55] transition shadow-md"
                    >
                      <span>관련 블로그 상세정보 연결</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Bottom Contact CTA */}
        <div className="bg-[#001528] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-[#f5ea1d]">
              건축 관련 상담이 필요하신가요?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              사전 법규 검토부터 가기획, 인허가 진행 절차까지 로하스건축사사무소 김용호 대표건축사가 직접 친절히 상담해 드립니다.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={`tel:${siteData.settings.phone}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm transition shadow-lg"
              >
                <PhoneCall size={18} />
                <span>{siteData.settings.phone || '02-499-0229'} 전화연결</span>
              </a>

              <a
                href={siteData.settings.qnaUrl || 'https://naver.me/xB7XkDIy'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#f5ea1d] text-[#001528] font-black text-sm hover:bg-amber-300 transition shadow-lg"
              >
                <MessageSquarePlus size={18} className="stroke-[2.5]" />
                <span>Q&A 온라인 문의</span>
                <ExternalLink size={16} />
              </a>

              <a
                href={siteData.settings.naverBlogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#78eb64] hover:bg-[#68de55] text-[#001528] font-black text-sm transition shadow-md"
              >
                <span>네이버 블로그</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

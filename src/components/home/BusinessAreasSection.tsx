import React, { useState } from 'react';
import { ArrowUpRight, Check, FileText, ChevronRight, X, ExternalLink } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { BusinessCard } from '../../types';

export const BusinessAreasSection: React.FC = () => {
  const { siteData, setCurrentPage } = useSiteContext();
  const [selectedCard, setSelectedCard] = useState<BusinessCard | null>(null);

  const cards = [...siteData.businessCards].sort((a, b) => a.order - b.order);

  const handleCardClick = (card: BusinessCard) => {
    if (card.externalUrl && card.externalUrl.startsWith('http')) {
      // If external link is configured, open in new tab or navigate
      window.open(card.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedCard(card);
    }
  };

  return (
    <section id="business-cards-section" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001528]/10 text-[#001528] text-xs font-bold uppercase tracking-wider">
            OUR BUSINESS SERVICES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            로하스건축사사무소 <span className="text-[#001528]">핵심 사업영역</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            풍부한 실무 경험과 건축 법률 전문성을 갖춘 전문가 집단이 신속하고 명확한 맞춤형 서비스를 제공합니다.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl hover:border-[#001528]/30 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
            >
              <div>
                {/* Image Box */}
                <div className="relative h-52 overflow-hidden bg-slate-900">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 bg-[#001528] text-[#f5ea1d] text-xs font-extrabold px-3 py-1 rounded-md shadow">
                    0{idx + 1}
                  </span>
                  {card.subtitle && (
                    <span className="absolute bottom-3 left-4 text-xs font-medium text-slate-300">
                      {card.subtitle}
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#001528] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleCardClick(card)}
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>자세히 보기</span>
                  {card.externalUrl ? <ArrowUpRight size={15} /> : <ChevronRight size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* External Link Notice or All Services CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => setCurrentPage('/business')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#001528] text-white font-bold text-sm shadow-md hover:bg-slate-800 transition"
          >
            <span>전체 사업영역 및 절차 안내 상세보기</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Detail Modal for Card */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-scaleIn">
            <div className="relative h-64 bg-slate-900">
              <img
                src={selectedCard.imageUrl}
                alt={selectedCard.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 rounded-full bg-slate-900/60 p-2 text-white hover:bg-slate-900 transition"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-bold text-[#f5ea1d] uppercase tracking-wider">
                  {selectedCard.subtitle || 'BUSINESS SERVICE'}
                </span>
                <h3 className="text-2xl font-bold mt-1">{selectedCard.title}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">요약 개요</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedCard.description}</p>
              </div>

              {selectedCard.details && (
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">상세 업무 설명</h4>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {selectedCard.details}
                  </p>
                </div>
              )}

              {selectedCard.externalUrl && (
                <div className="pt-3">
                  <a
                    href={selectedCard.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#78eb64] text-[#001528] font-black text-xs hover:bg-[#68de55] transition shadow-md"
                  >
                    <span>관련 블로그/사이트로 이동</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCard(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 text-slate-800 text-sm font-bold hover:bg-slate-300 transition"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  setSelectedCard(null);
                  setCurrentPage('/business');
                }}
                className="px-5 py-2 rounded-xl bg-[#001528] text-[#f5ea1d] text-sm font-bold hover:bg-slate-800 transition"
              >
                사업영역 페이지 이동
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

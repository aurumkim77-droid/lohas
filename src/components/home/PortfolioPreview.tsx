import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Eye, X } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { PortfolioItem, PortfolioCategory } from '../../types';

const CATEGORIES: { id: PortfolioCategory; label: string }[] = [
  { id: 'Total', label: '전체 (Total)' },
  { id: 'Housing', label: '주거시설 (Housing)' },
  { id: 'Office', label: '업무시설 (Office)' },
  { id: 'commercial', label: '상업시설 (Commercial)' },
  { id: 'Other', label: '기타·양성화 (Other)' },
];

export const getCategoryFallbackImage = (cat?: string) => {
  const c = (cat || '').toLowerCase();
  if (c === 'housing') return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
  if (c === 'commercial') return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
  if (c === 'office') return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
  return 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80';
};

export const PortfolioPreview: React.FC = () => {
  const { siteData, setCurrentPage } = useSiteContext();
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('Total');
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(12);

  // Reset visibleCount when category changes
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory]);

  // Filter items by category; items are ordered with newly registered/updated items first
  const filteredItems = siteData.portfolioItems
    .filter((p) => {
      if (selectedCategory === 'Total') return true;
      return (p.category || '').toLowerCase() === selectedCategory.toLowerCase();
    });

  const displayList = filteredItems.slice(0, visibleCount);

  const handleOpenModal = (item: PortfolioItem) => {
    setSelectedPortfolio(item);
    setActiveImgIndex(0);
  };

  const galleryImages = selectedPortfolio
    ? [selectedPortfolio.imageUrl, ...(selectedPortfolio.additionalImages || [])].filter(Boolean)
    : [];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001528]/10 text-[#001528] text-xs font-bold uppercase tracking-wider">
              PORTFOLIO SHOWCASE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              로하스건축사사무소 <span className="text-[#001528]">주요 포트폴리오</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              주거, 지식산업센터, 오피스 및 전문 컨설팅 성공 사례를 확인해보세요.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('/portfolio')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#001528] text-[#f5ea1d] font-bold text-xs sm:text-sm hover:bg-slate-800 transition shrink-0 self-start md:self-auto"
          >
            <span>전체 포트폴리오 보기 ({siteData.portfolioItems.length}개)</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = cat.id === 'Total' 
              ? siteData.portfolioItems.length 
              : siteData.portfolioItems.filter((p) => (p.category || '').toLowerCase() === cat.id.toLowerCase()).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 shrink-0 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#001528] text-[#f5ea1d] shadow-md scale-[1.02]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-[#f5ea1d] text-[#001528]' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Portfolio Gallery Grid */}
        {displayList.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold">
            선택하신 카테고리의 포트폴리오가 준비 중입니다.
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayList.map((item) => {
                const isNew = item.id.startsWith('p_') || (item.createdAt && new Date(item.createdAt).getFullYear() >= 2024);
                return (
                <div
                  key={item.id}
                  onClick={() => handleOpenModal(item)}
                  className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-900">
                    <img
                      src={item.imageUrl?.trim() || getCategoryFallbackImage(item.category)}
                      alt={item.title}
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallback = getCategoryFallbackImage(item.category);
                        if (target.src !== fallback) {
                          target.src = fallback;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 flex-wrap">
                      <span className="px-3 py-1 rounded-lg bg-[#001528]/90 text-[#f5ea1d] text-[11px] font-black uppercase tracking-wider backdrop-blur-sm shadow">
                        {item.category || 'Other'}
                      </span>
                      {item.featured && (
                        <span className="px-2 py-1 rounded-lg bg-[#f5ea1d] text-[#001528] text-[10px] font-black tracking-wider shadow">
                          ★ 추천
                        </span>
                      )}
                      {isNew && (
                        <span className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black tracking-wider shadow">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-xl bg-white/90 text-slate-900 text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
                        <Eye size={14} />
                        <span>상세보기</span>
                      </span>
                    </div>
                    {item.scale && (
                      <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-0.5 rounded">
                        {item.scale}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#001528] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 space-y-1.5 text-xs text-slate-500">
                      {item.location && (
                        <div className="flex items-center justify-between">
                          <span className="truncate">대지위치: {item.location}</span>
                          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                        </div>
                      )}
                      {(item.area || item.scope) && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          {item.area && <span>연면적 {item.area}</span>}
                          {item.area && item.scope && <span>•</span>}
                          {item.scope && <span className="truncate">{item.scope}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>

            {/* Load More or Go to Full Portfolio */}
            {filteredItems.length > displayList.length && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
                >
                  <span>프로젝트 더보기 ({filteredItems.length - displayList.length}개 더 있음)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage('/portfolio')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#001528] text-[#f5ea1d] hover:bg-slate-800 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow"
                >
                  <span>전체 포트폴리오 페이지에서 보기</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox / Portfolio Detail Modal */}
      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-scaleIn flex flex-col max-h-[90vh]">
            {/* Main Image View */}
            <div className="relative h-80 sm:h-96 bg-slate-950 shrink-0">
              <img
                src={(galleryImages[activeImgIndex] || selectedPortfolio.imageUrl)?.trim() || getCategoryFallbackImage(selectedPortfolio.category)}
                alt={selectedPortfolio.title}
                onError={(e) => {
                  const target = e.currentTarget;
                  const fallback = getCategoryFallbackImage(selectedPortfolio.category);
                  if (target.src !== fallback) {
                    target.src = fallback;
                  }
                }}
                className="w-full h-full object-contain bg-slate-950"
              />
              <button
                onClick={() => setSelectedPortfolio(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-slate-900/80 p-2 text-white hover:bg-slate-900 transition"
              >
                <X size={20} />
              </button>

              {/* Category Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-xl bg-[#001528] text-[#f5ea1d] text-xs font-black uppercase tracking-wider shadow-lg border border-[#f5ea1d]/30">
                  {selectedPortfolio.category || 'Other'}
                </span>
              </div>

              {/* Prev / Next buttons if multiple images */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="absolute top-4 left-32 bg-slate-900/80 text-white text-xs px-3 py-1 rounded-full font-bold">
                    {activeImgIndex + 1} / {galleryImages.length}
                  </div>
                </>
              )}

              <div className="absolute bottom-0 left-0 right-0 text-white bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-4">
                <h3 className="text-xl sm:text-2xl font-black text-white">{selectedPortfolio.title}</h3>
              </div>
            </div>

            {/* Gallery Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
                {galleryImages.filter(img => typeof img === 'string' && img.trim().length > 0).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`h-14 w-20 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                      activeImgIndex === idx ? 'border-[#f5ea1d] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.trim()} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-6 space-y-6 overflow-y-auto text-sm text-slate-700 flex-1">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">프로젝트 설명</h4>
                <p className="leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedPortfolio.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-100/70 p-4 rounded-xl text-xs">
                {selectedPortfolio.location && (
                  <div>
                    <span className="block text-slate-500 font-medium">대지위치</span>
                    <span className="font-bold text-slate-900">{selectedPortfolio.location}</span>
                  </div>
                )}
                {selectedPortfolio.scale && (
                  <div>
                    <span className="block text-slate-500 font-medium">규모</span>
                    <span className="font-bold text-slate-900">{selectedPortfolio.scale}</span>
                  </div>
                )}
                {selectedPortfolio.area && (
                  <div>
                    <span className="block text-slate-500 font-medium">연면적</span>
                    <span className="font-bold text-slate-900">{selectedPortfolio.area}</span>
                  </div>
                )}
                {selectedPortfolio.scope && (
                  <div>
                    <span className="block text-slate-500 font-medium">수행업무</span>
                    <span className="font-bold text-slate-900">{selectedPortfolio.scope}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 flex-wrap">
              <a
                href={siteData.settings.qnaUrl || `tel:${siteData.settings.phone || '02-499-0229'}`}
                target={siteData.settings.qnaUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#f5ea1d] text-[#001528] font-black text-xs hover:bg-amber-300 transition flex items-center gap-1.5 shadow"
              >
                <span>프로젝트 맞춤 건축상담 신청</span>
                <ChevronRight size={14} />
              </a>
              <button
                onClick={() => setSelectedPortfolio(null)}
                className="px-6 py-2.5 rounded-xl bg-[#001528] text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

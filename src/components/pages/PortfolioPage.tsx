import React, { useState, useEffect } from 'react';
import { Search, Eye, Building, X, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Filter } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { PortfolioItem, PortfolioCategory } from '../../types';
import { updateItemDetailSeo, updatePageMeta, getRouteSeoConfig } from '../../utils/seoUtils';
import { getCategoryFallbackImage } from '../home/PortfolioPreview';

const CATEGORIES: { id: PortfolioCategory; label: string }[] = [
  { id: 'Total', label: '전체 (Total)' },
  { id: 'Housing', label: '주거시설 (Housing)' },
  { id: 'Office', label: '업무시설 (Office)' },
  { id: 'commercial', label: '상업시설 (Commercial)' },
  { id: 'Other', label: '기타·양성화 (Other)' },
];

export const PortfolioPage: React.FC = () => {
  const { siteData } = useSiteContext();
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('Total');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Pagination for up to 150 portfolio items
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const filteredItems = siteData.portfolioItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Total' ||
      (item.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length);
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const getCategoryCount = (catId: PortfolioCategory) => {
    if (catId === 'Total') return siteData.portfolioItems.length;
    return siteData.portfolioItems.filter(
      (item) => (item.category || '').toLowerCase() === catId.toLowerCase()
    ).length;
  };

  const handleOpenItem = (item: PortfolioItem) => {
    setSelectedItem(item);
    setActiveImgIndex(0);
    updateItemDetailSeo(item, 'portfolio', siteData);
  };

  const handleCloseItem = () => {
    setSelectedItem(null);
    updatePageMeta(getRouteSeoConfig('/portfolio', siteData));
  };

  const galleryImages = selectedItem
    ? [selectedItem.imageUrl, ...(selectedItem.additionalImages || [])].filter(Boolean)
    : [];

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#001528] text-white py-16 px-4 sm:px-6 lg:px-8 mb-12 shadow-md">
        <div className="max-w-7xl mx-auto">
          <span className="text-[#f5ea1d] text-xs font-bold uppercase tracking-widest block mb-2">
            ARCHITECTURAL WORKS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">포트폴리오</h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            로하스건축사사무소가 차별화된 디자인과 노하우로 완성한 주요 프로젝트 현장입니다.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Tabs & Search Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          {/* Category Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 shrink-0 pr-2 border-r border-slate-200">
              <Filter size={14} />
              <span>분류</span>
            </span>
            {CATEGORIES.map((cat) => {
              const count = getCategoryCount(cat.id);
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

          {/* Search bar */}
          <div className="relative max-w-md pt-2 border-t border-slate-100">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="프로젝트명, 설명, 위치 검색..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#001528] focus:bg-white transition"
            />
            <Search size={16} className="absolute left-3.5 top-5 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-4.5 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 rounded-full p-1"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Portfolio Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 text-slate-500 space-y-3">
            <Building size={48} className="mx-auto text-slate-300" />
            <p className="text-base font-bold text-slate-700">해당 조건에 부합하는 포트폴리오가 없습니다.</p>
            <p className="text-xs">다른 분류 카테고리나 검색어를 선택해 보세요.</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>
                총 <strong className="text-slate-900 font-bold">{filteredItems.length}</strong>개 프로젝트
                {filteredItems.length > ITEMS_PER_PAGE && ` (현재 페이지: ${startIndex + 1} - ${endIndex}번)`}
              </span>
              {totalPages > 1 && (
                <span>
                  페이지 <strong>{validCurrentPage}</strong> / {totalPages}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenItem(item)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
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
                          <span className="px-2.5 py-1 rounded-lg bg-[#f5ea1d] text-[#001528] text-[10px] font-black uppercase tracking-wider shadow">
                            추천
                          </span>
                        )}
                        {(item.id.startsWith('p_') || (item.createdAt && new Date(item.createdAt).getFullYear() >= 2024)) && (
                          <span className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black tracking-wider shadow">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-black shadow-lg flex items-center gap-1.5">
                          <Eye size={14} />
                          <span>자세히 보기</span>
                        </span>
                      </div>
                      {item.scale && (
                        <span className="absolute bottom-4 right-4 bg-slate-950/70 text-white text-[11px] px-2.5 py-0.5 rounded font-medium">
                          {item.scale}
                        </span>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#001528] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="truncate max-w-[200px]">
                        {item.location ? `대지위치: ${item.location}` : '로하스건축사사무소'}
                      </span>
                      <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                    {(item.area || item.scope) && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        {item.area && <span>연면적 {item.area}</span>}
                        {item.area && item.scope && <span>•</span>}
                        {item.scope && <span className="truncate">{item.scope}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-8 border-t border-slate-200/80 flex items-center justify-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(1);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  disabled={validCurrentPage === 1}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
                  title="첫 페이지"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  disabled={validCurrentPage === 1}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
                  title="이전 페이지"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    return (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - validCurrentPage) <= 2
                    );
                  })
                  .map((pageNum, idx, arr) => {
                    const prev = arr[idx - 1];
                    const hasGap = prev && pageNum - prev > 1;

                    return (
                      <React.Fragment key={pageNum}>
                        {hasGap && <span className="px-2 text-slate-400 text-xs font-bold">...</span>}
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 380, behavior: 'smooth' });
                          }}
                          className={`min-w-[40px] h-10 px-3 rounded-xl text-xs sm:text-sm font-black transition shadow-sm ${
                            validCurrentPage === pageNum
                              ? 'bg-[#001528] text-[#f5ea1d] scale-105 shadow-md'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  disabled={validCurrentPage === totalPages}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
                  title="다음 페이지"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(totalPages);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  disabled={validCurrentPage === totalPages}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
                  title="마지막 페이지"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-scaleIn flex flex-col max-h-[90vh]">
            {/* Main Image View */}
            <div className="relative h-80 sm:h-96 bg-slate-950 shrink-0">
              <img
                src={(galleryImages[activeImgIndex] || selectedItem.imageUrl)?.trim() || getCategoryFallbackImage(selectedItem.category)}
                alt={selectedItem.title}
                onError={(e) => {
                  const target = e.currentTarget;
                  const fallback = getCategoryFallbackImage(selectedItem.category);
                  if (target.src !== fallback) {
                    target.src = fallback;
                  }
                }}
                className="w-full h-full object-contain bg-slate-950"
              />
              <button
                onClick={handleCloseItem}
                className="absolute top-4 right-4 z-10 rounded-full bg-slate-900/80 p-2 text-white hover:bg-slate-900 transition"
              >
                <X size={20} />
              </button>

              {/* Category Badge in Lightbox */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-xl bg-[#001528] text-[#f5ea1d] text-xs font-black uppercase tracking-wider shadow-lg border border-[#f5ea1d]/30">
                  {selectedItem.category || 'Other'}
                </span>
              </div>

              {/* Navigation arrows if multiple images */}
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

              <div className="absolute bottom-0 left-0 right-0 text-white bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4">
                <h3 className="text-xl sm:text-2xl font-black text-white">{selectedItem.title}</h3>
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
                <h4 className="font-bold text-slate-900 mb-1">상세 내용</h4>
                <p className="leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedItem.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-100/70 p-4 rounded-xl text-xs">
                {selectedItem.location && (
                  <div>
                    <span className="block text-slate-500 font-medium">대지위치</span>
                    <span className="font-bold text-slate-900">{selectedItem.location}</span>
                  </div>
                )}
                {selectedItem.scale && (
                  <div>
                    <span className="block text-slate-500 font-medium">규모</span>
                    <span className="font-bold text-slate-900">{selectedItem.scale}</span>
                  </div>
                )}
                {selectedItem.area && (
                  <div>
                    <span className="block text-slate-500 font-medium">연면적</span>
                    <span className="font-bold text-slate-900">{selectedItem.area}</span>
                  </div>
                )}
                {selectedItem.scope && (
                  <div>
                    <span className="block text-slate-500 font-medium">수행업무</span>
                    <span className="font-bold text-slate-900">{selectedItem.scope}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={handleCloseItem}
                className="px-6 py-2.5 rounded-xl bg-[#001528] text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

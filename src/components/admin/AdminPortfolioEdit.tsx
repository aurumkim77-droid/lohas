import React, { useState, useMemo, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Star,
  Upload,
  Loader2,
  ImageIcon,
  MoveLeft,
  MoveRight,
  Search,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  Copy,
  Eye,
  RefreshCw,
  Sparkles,
  Calendar,
  Building,
  User,
  ExternalLink,
  X
} from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { PortfolioItem, PortfolioCategory } from '../../types';
import { ImageInputPicker } from './ImageInputPicker';
import { compressImageFile } from '../../utils/imageUtils';
import { getCategoryFallbackImage } from '../home/PortfolioPreview';

export const MAX_PORTFOLIO_ITEMS = 150;

export const AdminPortfolioEdit: React.FC = () => {
  const {
    siteData,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    togglePortfolioFeatured,
    addUploadedImage,
    uploadImageFile,
    setCurrentPage: setSitePage,
    setIsAdminModeActive,
    syncToServer,
    syncPortfolioToServer
  } = useSiteContext();

  const formTopRef = useRef<HTMLDivElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PortfolioItem['category']>('Housing');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newAddUrlInput, setNewAddUrlInput] = useState('');
  const [isUploadingAdd, setIsUploadingAdd] = useState(false);
  const [showAddLibrary, setShowAddLibrary] = useState(false);
  const [isSyncingServer, setIsSyncingServer] = useState(false);

  const [location, setLocation] = useState('');
  const [scale, setScale] = useState('');
  const [area, setArea] = useState('');
  const [scope, setScope] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [featured, setFeatured] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);

  // List Filter, Search, Sort & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'title' | 'featured'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const currentCount = siteData.portfolioItems.length;
  const isAtLimit = currentCount >= MAX_PORTFOLIO_ITEMS;
  const remainingSlots = Math.max(0, MAX_PORTFOLIO_ITEMS - currentCount);

  // Handle Multi-file Upload for additional images
  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingAdd(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImageFile(files[i]);
        const uploadedUrl = await uploadImageFile(compressed);
        newUrls.push(uploadedUrl);
      }
      setAdditionalImages((prev) => [...prev, ...newUrls]);
    } catch (err) {
      console.error('Error uploading additional images:', err);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploadingAdd(false);
      e.target.value = '';
    }
  };

  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newAddUrlInput.trim()) return;
    setAdditionalImages((prev) => [...prev, newAddUrlInput.trim()]);
    addUploadedImage(newAddUrlInput.trim());
    setNewAddUrlInput('');
  };

  const handleRemoveAddImage = (idx: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMoveAddImage = (idx: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= additionalImages.length) return;
    const copy = [...additionalImages];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setAdditionalImages(copy);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageUrl) {
      alert('제목, 설명, 대표 이미지 URL은 필수 입력 항목입니다.');
      return;
    }

    if (!editingId && isAtLimit) {
      alert(`포트폴리오는 최대 ${MAX_PORTFOLIO_ITEMS}개까지 등록 가능합니다. 기존 항목을 정리한 후 등록해 주세요.`);
      return;
    }

    if (editingId) {
      updatePortfolioItem(editingId, {
        title,
        category,
        description,
        imageUrl,
        additionalImages,
        location,
        scale,
        area,
        scope,
        featured,
        ...(createdAt ? { createdAt } : {})
      });
      setRecentlyUpdatedId(editingId);
      setEditingId(null);
      setSaveMessage(`'${title}' 포트폴리오 수정 내용이 성공적으로 업데이트되었습니다!`);
    } else {
      const regDate = createdAt || new Date().toISOString().split('T')[0];
      addPortfolioItem({
        title,
        category,
        description,
        imageUrl,
        additionalImages,
        location,
        scale,
        area,
        scope,
        featured,
        createdAt: regDate
      });
      setCurrentPage(1);
      setSaveMessage(`'${title}' 포트폴리오가 목록에 성공적으로 등록되었습니다!`);
    }

    // Reset Form
    setTitle('');
    setCategory('Housing');
    setDescription('');
    setImageUrl('');
    setAdditionalImages([]);
    setLocation('');
    setScale('');
    setArea('');
    setScope('');
    setCreatedAt('');
    setFeatured(false);

    setSaved(true);
    // updatePortfolioItem / addPortfolioItem already immediately persists changes to /api/portfolio, /api/site-data, and Firestore!

    setTimeout(() => {
      setSaved(false);
      setSaveMessage('');
    }, 4000);
  };

  const handleEditClick = (p: PortfolioItem) => {
    setEditingId(p.id);
    setTitle(p.title);
    setCategory(p.category || 'Housing');
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setAdditionalImages(p.additionalImages || []);
    setLocation(p.location || '');
    setScale(p.scale || '');
    setArea(p.area || '');
    setScope(p.scope || '');
    setCreatedAt(p.createdAt || new Date().toISOString().split('T')[0]);
    setFeatured(p.featured || false);

    // Scroll up to form smoothly
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDuplicate = (p: PortfolioItem) => {
    setEditingId(null);
    setTitle(`[복사본] ${p.title}`);
    setCategory(p.category || 'Housing');
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setAdditionalImages(p.additionalImages ? [...p.additionalImages] : []);
    setLocation(p.location || '');
    setScale(p.scale || '');
    setArea(p.area || '');
    setScope(p.scope || '');
    setCreatedAt(new Date().toISOString().split('T')[0]);
    setFeatured(false);

    setSaveMessage(`'${p.title}' 항목의 내용이 복사되었습니다. 내용을 검토하신 후 '포트폴리오 등록하기'를 눌러주세요.`);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);

    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Housing');
    setDescription('');
    setImageUrl('');
    setAdditionalImages([]);
    setLocation('');
    setScale('');
    setArea('');
    setScope('');
    setCreatedAt('');
    setFeatured(false);
  };

  const handleDelete = (id: string, itemTitle: string) => {
    if (window.confirm(`'${itemTitle}' 포트폴리오를 삭제하시겠습니까?`)) {
      deletePortfolioItem(id);
      if (editingId === id) {
        handleCancelEdit();
      }
      setSaveMessage(`'${itemTitle}' 항목이 삭제되었습니다.`);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleImmediateServerSync = async () => {
    setIsSyncingServer(true);
    try {
      const ok = await syncPortfolioToServer();
      if (ok) {
        setSaveMessage('현재 포트폴리오의 모든 내용이 서버에 성공적으로 업로드 및 영구 저장되었습니다!');
      } else {
        setSaveMessage('포트폴리오 내용이 로컬에 저장되었습니다.');
      }
    } catch {
      setSaveMessage('포트폴리오 내용이 안전하게 반영되었습니다.');
    } finally {
      setIsSyncingServer(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setSaveMessage('');
      }, 4000);
    }
  };

  const handleViewHomepage = () => {
    setIsAdminModeActive(false);
    setSitePage('/');
  };

  const handleViewPublicPortfolio = () => {
    setIsAdminModeActive(false);
    setSitePage('/portfolio');
  };

  // Filtered & Sorted Portfolio Items
  const filteredList = useMemo(() => {
    let result = [...siteData.portfolioItems];

    // Category Filter
    if (filterCategory !== 'ALL') {
      result = result.filter((p) => p.category === filterCategory);
    }

    // Featured Filter
    if (filterFeaturedOnly) {
      result = result.filter((p) => p.featured);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.location && p.location.toLowerCase().includes(q)) ||
          (p.scope && p.scope.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'latest') {
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
      if (sortBy === 'oldest') {
        return (a.createdAt || '').localeCompare(b.createdAt || '');
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'ko');
      }
      if (sortBy === 'featured') {
        if (a.featured === b.featured) {
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        }
        return a.featured ? -1 : 1;
      }
      return 0;
    });

    return result;
  }, [siteData.portfolioItems, filterCategory, filterFeaturedOnly, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredList.length);
  const paginatedList = filteredList.slice(startIndex, endIndex);

  // Category counts
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {
      Housing: 0,
      Office: 0,
      commercial: 0,
      Other: 0,
      featured: 0
    };
    siteData.portfolioItems.forEach((p) => {
      const cat = p.category || 'Other';
      stats[cat] = (stats[cat] || 0) + 1;
      if (p.featured) stats.featured += 1;
    });
    return stats;
  }, [siteData.portfolioItems]);

  return (
    <div className="space-y-8" ref={formTopRef}>
      {/* Toast Notification Banner */}
      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Check size={18} />
            </div>
            <div>
              <p className="text-emerald-950 font-black text-sm">{saveMessage || '성공적으로 저장되었습니다!'}</p>
              <p className="text-[11px] text-emerald-700 font-medium">관리자 수정사항이 사이트 및 로컬 저장소에 즉시 반영되었습니다.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
            <button
              type="button"
              onClick={handleViewHomepage}
              className="px-3.5 py-1.5 rounded-xl bg-[#001528] hover:bg-slate-900 text-[#f5ea1d] text-xs font-bold transition flex items-center gap-1 shadow-sm"
            >
              <span>홈페이지 메인 확인</span>
              <ExternalLink size={12} />
            </button>
            <button
              type="button"
              onClick={handleViewPublicPortfolio}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
            >
              <span>포트폴리오 페이지 확인</span>
              <ExternalLink size={12} />
            </button>
            <button
              type="button"
              onClick={() => setSaved(false)}
              className="text-emerald-700 hover:text-emerald-950 p-1.5 rounded-lg hover:bg-emerald-100 transition"
              title="닫기"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 1. System Capacity Header & Status */}
      <div className="bg-[#001528] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5ea1d] text-[#001528] text-xs font-black">
              <Layers size={13} />
              <span>포트폴리오 관리 시스템 (최대 150개 지원)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              포트폴리오 등록 및 편집
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              대시보드에서 건축 프로젝트를 등록, 편집, 복제하여 실시간으로 홈페이지에 반영할 수 있습니다.
            </p>
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleImmediateServerSync}
                disabled={isSyncingServer}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow"
                title="현재까지 추가 및 수정한 포트폴리오를 서버에 즉시 영구 저장하고 홈페이지에 실시간 동기화합니다."
              >
                {isSyncingServer ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>서버에 업로드 중...</span>
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    <span>현재 포트폴리오 서버 즉시 업로드</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleViewHomepage}
                className="px-3.5 py-2 rounded-xl bg-[#f5ea1d] text-[#001528] hover:bg-amber-300 font-bold text-xs transition flex items-center gap-1.5 shadow"
              >
                <Eye size={13} />
                <span>홈페이지 메인 바로가기</span>
              </button>
              <button
                type="button"
                onClick={handleViewPublicPortfolio}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Layers size={13} />
                <span>전체 포트폴리오 보기</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 text-center min-w-[140px] shadow-inner">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                현재 등록 현황
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                <span className="text-[#f5ea1d]">{currentCount}</span>
                <span className="text-slate-400 text-lg"> / {MAX_PORTFOLIO_ITEMS}</span>
              </div>
              <span
                className={`text-[10px] font-extrabold mt-1 inline-block px-2 py-0.5 rounded-full ${
                  isAtLimit
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : currentCount >= 130
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isAtLimit ? `한도 도달 (${MAX_PORTFOLIO_ITEMS}개)` : `${remainingSlots}개 추가 가능`}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar toward limit */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>용량 점유율 ({Math.round((currentCount / MAX_PORTFOLIO_ITEMS) * 100)}%)</span>
            <span>최대 {MAX_PORTFOLIO_ITEMS}개 등록 한도</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAtLimit
                  ? 'bg-gradient-to-r from-red-500 to-rose-400'
                  : currentCount >= 130
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                  : 'bg-gradient-to-r from-sky-400 via-blue-500 to-[#f5ea1d]'
              }`}
              style={{ width: `${Math.min(100, Math.max(3, (currentCount / MAX_PORTFOLIO_ITEMS) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Add / Edit Form */}
      <div
        className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm space-y-6 transition-colors ${
          editingId ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900">
                {editingId ? '포트폴리오 수정' : '새 포트폴리오 등록'}
              </h3>
              {editingId ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold animate-pulse">
                  수정 모드 (ID: {editingId})
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
                  신규 등록 모드
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              건축 프로젝트 사진, 카테고리 및 세부정보를 등록합니다. (최대 {MAX_PORTFOLIO_ITEMS}개까지 등록 가능)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Live Preview Toggle */}
            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                showLivePreview
                  ? 'bg-[#001528] text-[#f5ea1d]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="작성 중인 프로젝트 카드를 실시간으로 미리 확인합니다."
            >
              <Eye size={14} />
              <span>실시간 미리보기 {showLivePreview ? 'ON' : 'OFF'}</span>
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                수정 취소
              </button>
            )}
          </div>
        </div>

        {/* Limit Warning when at limit */}
        {!editingId && isAtLimit && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs sm:text-sm">
            <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">포트폴리오 등록 한도({MAX_PORTFOLIO_ITEMS}개)에 도달했습니다.</p>
              <p className="text-xs text-red-600 mt-0.5">
                새 항목을 추가하려면 아래 등록 목록에서 기존의 불필요한 포트폴리오를 삭제하거나 기존 항목을 수정해 주세요.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Title, Category, Registration Date */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">프로젝트 제목 *</label>
              <input
                type="text"
                placeholder="예: 성동 루체 신축 설계"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#001528] focus:ring-1 focus:ring-[#001528]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">분류 카테고리 *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PortfolioItem['category'])}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#001528] bg-white font-bold"
              >
                <option value="Housing">Housing (주거시설)</option>
                <option value="Office">Office (업무시설)</option>
                <option value="commercial">commercial (상업시설)</option>
                <option value="Other">Other (기타)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">등록 일자</label>
              <input
                type="date"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#001528] bg-white"
              />
            </div>
          </div>

          {/* Row 2: Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase">상세 설명 *</label>
            <textarea
              rows={3}
              placeholder="프로젝트의 주요 특징 및 디자인 방향 설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#001528] focus:ring-1 focus:ring-[#001528]"
              required
            />
          </div>

          {/* Main Thumbnail Image */}
          <ImageInputPicker
            label="대표 이미지 (썸네일) *"
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="대표 이미지 URL 입력 또는 [파일 선택] 버튼 사용"
          />

          {/* Additional Multi-Images Section */}
          <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  추가 이미지 갤러리 ({additionalImages.length}장)
                </label>
                <p className="text-[11px] text-slate-500">
                  대표 이미지 외에 추가로 상세 갤러리에 노출될 사진 여러 장을 업로드할 수 있습니다.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#001528] text-[#f5ea1d] hover:bg-slate-800 text-xs font-bold cursor-pointer transition shadow-sm">
                  {isUploadingAdd ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  <span>여러 파일 선택 업로드</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isUploadingAdd}
                    onChange={handleMultipleFilesUpload}
                    className="hidden"
                  />
                </label>

                {siteData.uploadedImages && siteData.uploadedImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddLibrary(!showAddLibrary)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
                  >
                    <ImageIcon size={14} />
                    <span>라이브러리에서 선택</span>
                  </button>
                )}
              </div>
            </div>

            {/* Direct URL input for additional image */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newAddUrlInput}
                onChange={(e) => setNewAddUrlInput(e.target.value)}
                placeholder="추가할 이미지 URL을 직접 입력"
                className="flex-1 rounded-xl border border-slate-200 p-2 text-xs text-slate-800 bg-white outline-none focus:border-[#001528]"
              />
              <button
                type="button"
                onClick={() => handleAddUrl()}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition"
              >
                URL 추가
              </button>
            </div>

            {/* Library Selector for additional images */}
            {showAddLibrary && siteData.uploadedImages && siteData.uploadedImages.length > 0 && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>클릭하여 추가 이미지에 바로 등록:</span>
                  <button
                    type="button"
                    onClick={() => setShowAddLibrary(false)}
                    className="text-slate-400 hover:text-slate-600 text-[11px]"
                  >
                    닫기
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                  {siteData.uploadedImages.filter(img => typeof img === 'string' && img.trim().length > 0).map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAdditionalImages((prev) => [...prev, img.trim()]);
                        setShowAddLibrary(false);
                      }}
                      className="h-14 rounded-lg overflow-hidden border border-slate-200 hover:border-[#001528] transition group"
                    >
                      <img src={img.trim()} alt={`Lib ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Thumbnails of additional images */}
            {additionalImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                {additionalImages.filter(img => typeof img === 'string' && img.trim().length > 0).map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-24">
                    <img src={img.trim()} alt={`Sub ${idx}`} className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 bg-slate-950/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {idx + 1}
                    </span>

                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveAddImage(idx, 'left')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-30"
                        title="왼쪽 이동"
                      >
                        <MoveLeft size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddImage(idx)}
                        className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                        title="삭제"
                      >
                        <Trash2 size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveAddImage(idx, 'right')}
                        disabled={idx === additionalImages.length - 1}
                        className="p-1 rounded bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-30"
                        title="오른쪽 이동"
                      >
                        <MoveRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 text-xs text-slate-400 bg-white/50 rounded-xl border border-dashed border-slate-200">
                등록된 추가 이미지가 없습니다. 상단 [여러 파일 선택 업로드] 버튼으로 여러 장을 한 번에 등록하세요.
              </div>
            )}
          </div>

          {/* Specifications Row 1: Location, Scale, Area, Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase">대지위치</label>
              <input
                type="text"
                placeholder="예: 서울시 성동구 성수동"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 outline-none focus:border-[#001528]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase">규모</label>
              <input
                type="text"
                placeholder="예: 지하 1층 / 지상 5층"
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 outline-none focus:border-[#001528]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase">연면적</label>
              <input
                type="text"
                placeholder="예: 1,250㎡"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 outline-none focus:border-[#001528]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase">수행업무</label>
              <input
                type="text"
                placeholder="예: 건축설계 및 감리"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 outline-none focus:border-[#001528]"
              />
            </div>
          </div>

          {/* Featured Option */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured-check"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-[#001528] focus:ring-[#001528]"
            />
            <label htmlFor="featured-check" className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1.5">
              <Star size={14} className={featured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'} />
              <span>메인 홈페이지 추천 포트폴리오로 노출 (Hero 아래 슬라이드에 우선 노출)</span>
            </label>
          </div>

          {/* Live Preview Card */}
          {showLivePreview && (
            <div className="p-5 bg-slate-50 border border-slate-300 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#001528]" />
                  <span>실시간 카드 미리보기 (방문자 화면 노출 형태)</span>
                </span>
                <span className="text-[11px] text-slate-400">폼 입력 시 실시간 반영</span>
              </div>

              <div className="max-w-sm mx-auto bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <div className="relative h-48 bg-slate-900">
                  {imageUrl && imageUrl.trim().length > 0 ? (
                    <img
                      src={imageUrl.trim()}
                      alt={title || '미리보기'}
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallback = getCategoryFallbackImage(category);
                        if (target.src !== fallback) {
                          target.src = fallback;
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-medium">
                      대표 이미지를 입력하세요
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#001528]/90 text-[#f5ea1d] text-[10px] font-black uppercase">
                      {category}
                    </span>
                  </div>
                  {scale && (
                    <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                      {scale}
                    </span>
                  )}
                  {featured && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Star size={10} className="fill-white" />
                      <span>추천</span>
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {title || '프로젝트 제목'}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {description || '상세 설명이 여기에 표시됩니다.'}
                  </p>
                  {location && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[10px] text-slate-400">
                      <span>위치: {location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              {editingId ? (
                <span>수정 완료 버튼을 누르면 즉시 저장 및 화면에 반영됩니다.</span>
              ) : (
                <span>등록 즉시 목록 최상단 및 홈페이지에 실시간 반영됩니다.</span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition"
                >
                  수정 취소
                </button>
              )}
              <button
                type="submit"
                disabled={!editingId && isAtLimit}
                className={`px-7 py-2.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-2 ${
                  !editingId && isAtLimit
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-[#001528] text-[#f5ea1d] hover:bg-slate-800'
                }`}
              >
                <Save size={15} />
                <span>
                  {editingId
                    ? '포트폴리오 수정 완료'
                    : isAtLimit
                    ? `최대 ${MAX_PORTFOLIO_ITEMS}개 등록 한도 도달`
                    : '새 포트폴리오 등록하기'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 3. Registered Portfolio List Management (with Search, Filter, Sort & Pagination) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Title & Category Quick Statistics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                등록된 포트폴리오 목록
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#001528] text-[#f5ea1d] text-xs font-black">
                {currentCount} / {MAX_PORTFOLIO_ITEMS}개
              </span>
              <button
                type="button"
                onClick={handleViewHomepage}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 text-[11px] font-bold transition border border-amber-200"
                title="홈페이지 메인으로 이동"
              >
                <Eye size={12} />
                <span>홈페이지 메인 보기</span>
              </button>
              <button
                type="button"
                onClick={handleViewPublicPortfolio}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold transition"
                title="포트폴리오 공개 페이지로 이동"
              >
                <ExternalLink size={12} />
                <span>포트폴리오 페이지 보기</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              등록된 모든 건축 프로젝트를 검색, 필터링, 정렬하고 복제 또는 수정할 수 있습니다.
            </p>
          </div>

          {/* Category badges summary */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-semibold text-slate-600">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100">
              주거: <strong className="text-slate-900">{categoryStats.Housing}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100">
              업무: <strong className="text-slate-900">{categoryStats.Office}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100">
              상업: <strong className="text-slate-900">{categoryStats.commercial}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100">
              기타: <strong className="text-slate-900">{categoryStats.Other}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
              추천: <strong>{categoryStats.featured}</strong>
            </span>
          </div>
        </div>

        {/* Search, Filter, and View Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="프로젝트명, 위치, 업무 등 검색..."
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pl-9 pr-8 text-xs text-slate-800 outline-none focus:border-[#001528]"
            />
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full bg-slate-100"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 font-bold outline-none focus:border-[#001528]"
            >
              <option value="ALL">모든 카테고리 (전체)</option>
              <option value="Housing">Housing (주거시설)</option>
              <option value="Office">Office (업무시설)</option>
              <option value="commercial">commercial (상업시설)</option>
              <option value="Other">Other (기타)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 font-bold outline-none focus:border-[#001528]"
            >
              <option value="latest">최신 등록순</option>
              <option value="oldest">오래된 등록순</option>
              <option value="title">프로젝트명 가나다순</option>
              <option value="featured">메인 추천 우선</option>
            </select>
          </div>

          {/* Items Per Page */}
          <div className="lg:col-span-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 font-bold outline-none focus:border-[#001528]"
            >
              <option value={10}>10개씩 보기</option>
              <option value={20}>20개씩 보기</option>
              <option value={50}>50개씩 보기</option>
              <option value={100}>100개씩 보기</option>
              <option value={150}>150개 전체보기</option>
            </select>
          </div>
        </div>

        {/* Featured Only Checkbox & Results Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700">
            <input
              type="checkbox"
              checked={filterFeaturedOnly}
              onChange={(e) => {
                setFilterFeaturedOnly(e.target.checked);
                setCurrentPage(1);
              }}
              className="w-3.5 h-3.5 rounded text-[#001528]"
            />
            <span>추천 포트폴리오만 필터링</span>
          </label>

          <span className="text-slate-500 font-medium">
            검색 결과: <strong className="text-slate-900 font-bold">{filteredList.length}개</strong>
            {filteredList.length > 0 && ` (현재 페이지: ${startIndex + 1} - ${endIndex}번 항목)`}
          </span>
        </div>

        {/* Items List */}
        {filteredList.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 space-y-2">
            <Layers size={36} className="mx-auto text-slate-300" />
            <p className="font-bold text-slate-700">조건에 일치하는 포트폴리오가 없습니다.</p>
            <p className="text-xs text-slate-400">검색어 또는 카테고리 필터를 변경해 보세요.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedList.map((p, index) => {
              const globalIndex = startIndex + index + 1;
              const isEditingThis = editingId === p.id;
              const isJustUpdated = recentlyUpdatedId === p.id;

              return (
                <div
                  key={p.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-4 ${
                    isEditingThis
                      ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                      : isJustUpdated
                      ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/20 shadow-sm'
                      : 'bg-slate-50 hover:bg-white border-slate-200/90 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    {/* Index Number */}
                    <span className="text-xs font-bold text-slate-400 w-6 text-center shrink-0">
                      {globalIndex}
                    </span>

                    {/* Thumbnail Image */}
                    <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 relative group">
                      <img
                        src={p.imageUrl?.trim() || getCategoryFallbackImage(p.category)}
                        alt={p.title}
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallback = getCategoryFallbackImage(p.category);
                          if (target.src !== fallback) {
                            target.src = fallback;
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {p.additionalImages && p.additionalImages.length > 0 && (
                        <span className="absolute bottom-1 right-1 bg-slate-950/80 text-white text-[9px] font-bold px-1 rounded">
                          +{p.additionalImages.length}
                        </span>
                      )}
                    </div>

                    {/* Project Information */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-xs">
                          {p.title}
                        </span>
                        <span className="bg-[#001528] text-[#f5ea1d] text-[10px] font-extrabold px-2 py-0.5 rounded uppercase shrink-0">
                          {p.category || 'Other'}
                        </span>
                        {p.featured && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                            <Star size={10} className="fill-amber-600 text-amber-600" />
                            <span>추천</span>
                          </span>
                        )}
                        {isJustUpdated && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                            방금 업데이트됨
                          </span>
                        )}
                        {p.createdAt && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            등록일: {p.createdAt}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1">{p.description}</p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                        {p.location && (
                          <span>위치: <strong className="text-slate-600">{p.location}</strong></span>
                        )}
                        {p.scale && (
                          <span>규모: <strong className="text-slate-600">{p.scale}</strong></span>
                        )}
                        {p.area && (
                          <span>연면적: <strong className="text-slate-600">{p.area}</strong></span>
                        )}
                        {p.scope && (
                          <span>업무: <strong className="text-slate-600">{p.scope}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 w-full sm:w-auto justify-end">
                    {/* Toggle Featured Star Button */}
                    <button
                      type="button"
                      onClick={() => togglePortfolioFeatured(p.id)}
                      className={`p-2 rounded-xl transition text-xs flex items-center gap-1 font-bold ${
                        p.featured
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
                      }`}
                      title={p.featured ? '메인 추천 해제' : '메인 추천 포트폴리오로 지정'}
                    >
                      <Star size={14} className={p.featured ? 'fill-amber-600 text-amber-600' : ''} />
                      <span className="hidden md:inline">{p.featured ? '추천됨' : '추천하기'}</span>
                    </button>

                    {/* Duplicate Project Button */}
                    <button
                      type="button"
                      onClick={() => handleDuplicate(p)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition text-xs flex items-center gap-1 font-bold"
                      title="이 프로젝트 복제하여 새 항목으로 등록"
                    >
                      <Copy size={14} />
                      <span className="hidden sm:inline">복제</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleEditClick(p)}
                      className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition text-xs flex items-center gap-1 font-bold"
                      title="수정하기"
                    >
                      <Edit2 size={14} />
                      <span className="hidden sm:inline">수정</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 transition text-xs flex items-center gap-1 font-bold"
                      title="삭제하기"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">삭제</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. Pagination Controls */}
        {totalPages > 1 && (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-medium">
              페이지 <strong className="text-slate-900 font-bold">{validCurrentPage}</strong> / {totalPages}
              {' '}(총 {filteredList.length}개 항목)
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={validCurrentPage === 1}
                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="첫 페이지"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="이전 페이지"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - validCurrentPage) <= 2 || p === 1 || p === totalPages)
                .map((pageNum, idx, arr) => {
                  const showEllipsisBefore = idx > 0 && pageNum - arr[idx - 1] > 1;

                  return (
                    <React.Fragment key={pageNum}>
                      {showEllipsisBefore && (
                        <span className="px-1 text-slate-400 text-xs">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                          validCurrentPage === pageNum
                            ? 'bg-[#001528] text-[#f5ea1d] shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage === totalPages}
                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="다음 페이지"
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={validCurrentPage === totalPages}
                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="마지막 페이지"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

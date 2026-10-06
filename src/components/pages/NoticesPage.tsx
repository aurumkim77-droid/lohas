import React, { useState } from 'react';
import { Search, Pin, Eye, Download, FileText, ChevronLeft, ChevronRight, Calendar, User, X } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { NoticeItem } from '../../types';
import { updateItemDetailSeo, updatePageMeta, getRouteSeoConfig } from '../../utils/seoUtils';

export const NoticesPage: React.FC = () => {
  const { siteData, incrementNoticeViews } = useSiteContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 8;

  const filteredNotices = siteData.notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort: Pinned first, then date descending
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.ceil(sortedNotices.length / itemsPerPage) || 1;
  const currentNotices = sortedNotices.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  const handleOpenNotice = (notice: NoticeItem) => {
    setActiveNotice(notice);
    incrementNoticeViews(notice.id);
    updateItemDetailSeo(notice, 'notice', siteData);
  };

  const handleCloseNotice = () => {
    setActiveNotice(null);
    updatePageMeta(getRouteSeoConfig('/notices', siteData));
  };

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#001528] text-white py-16 px-4 sm:px-6 lg:px-8 mb-12 shadow-md">
        <div className="max-w-7xl mx-auto">
          <span className="text-[#f5ea1d] text-xs font-bold uppercase tracking-widest block mb-2">
            NOTICE & ANNOUNCEMENTS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">공지사항</h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            로하스건축사사무소의 최신 공지, 법규 개정 안내 및 소식을 전해드립니다.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPageNum(1);
              }}
              placeholder="제목 또는 내용으로 검색..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-sm text-slate-800 outline-none focus:border-[#001528] focus:bg-white transition"
            />
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <span className="text-xs text-slate-500 font-semibold self-end sm:self-center">
            총 <strong className="text-[#001528]">{sortedNotices.length}</strong> 건의 게시물이 있습니다.
          </span>
        </div>

        {/* Notices Board Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#001528] text-slate-200 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-20 text-center">번호</th>
                  <th className="py-4 px-6">제목</th>
                  <th className="py-4 px-6 w-32 text-center">작성자</th>
                  <th className="py-4 px-6 w-32 text-center">작성일</th>
                  <th className="py-4 px-6 w-24 text-center">조회수</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {currentNotices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      등록된 공지사항이 없습니다.
                    </td>
                  </tr>
                ) : (
                  currentNotices.map((notice, index) => {
                    const rowNumber =
                      sortedNotices.length - (currentPageNum - 1) * itemsPerPage - index;
                    return (
                      <tr
                        key={notice.id}
                        onClick={() => handleOpenNotice(notice)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition ${
                          notice.isPinned ? 'bg-amber-50/40 font-semibold' : ''
                        }`}
                      >
                        <td className="py-4 px-6 text-center">
                          {notice.isPinned ? (
                            <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-100/80 px-2 py-0.5 rounded-full">
                              <Pin size={12} />
                              공지
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">{rowNumber}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-900 group-hover:text-[#001528] transition-colors">
                          <div className="flex items-center gap-2">
                            <span>{notice.title}</span>
                            {notice.attachments && notice.attachments.length > 0 && (
                              <Download size={13} className="text-slate-400 shrink-0" title="첨부파일 있음" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center text-xs text-slate-500">
                          {notice.author || '관리자'}
                        </td>
                        <td className="py-4 px-6 text-center text-xs text-slate-400">
                          {notice.createdAt}
                        </td>
                        <td className="py-4 px-6 text-center text-xs text-slate-500 font-medium">
                          {notice.views}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-center gap-2 bg-slate-50/50">
              <button
                disabled={currentPageNum === 1}
                onClick={() => setCurrentPageNum((p) => Math.max(p - 1, 1))}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const isActive = page === currentPageNum;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPageNum(page)}
                    className={`w-9 h-9 rounded-lg font-bold text-xs transition ${
                      isActive
                        ? 'bg-[#001528] text-[#f5ea1d]'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPageNum === totalPages}
                onClick={() => setCurrentPageNum((p) => Math.min(p + 1, totalPages))}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notice Detail View Modal */}
      {activeNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-scaleIn flex flex-col max-h-[85vh]">
            <div className="bg-[#001528] text-white p-6 relative">
              <button
                onClick={handleCloseNotice}
                className="absolute top-4 right-4 rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-[#f5ea1d] mb-2">
                {activeNotice.isPinned && (
                  <span className="flex items-center gap-1 bg-[#f5ea1d] text-[#001528] px-2 py-0.5 rounded font-black">
                    <Pin size={12} />
                    주요공지
                  </span>
                )}
                <span>작성일: {activeNotice.createdAt}</span>
                <span>·</span>
                <span>조회수: {activeNotice.views}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">{activeNotice.title}</h2>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-slate-800 font-sans leading-relaxed">
              <div className="whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[160px]">
                {activeNotice.content}
              </div>

              {/* Attachments */}
              {activeNotice.attachments && activeNotice.attachments.length > 0 && (
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    첨부파일
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeNotice.attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        download
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-200"
                      >
                        <FileText size={14} className="text-[#001528]" />
                        <span>{att.name}</span>
                        <Download size={12} className="text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleCloseNotice}
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

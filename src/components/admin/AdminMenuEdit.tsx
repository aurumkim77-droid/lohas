import React, { useState } from 'react';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, FilePlus, Save, Check } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { MenuItem } from '../../types';

export const AdminMenuEdit: React.FC = () => {
  const {
    siteData,
    updateMenuItems,
    addMenuItem,
    deleteMenuItem,
    addCustomPage,
    deleteCustomPage
  } = useSiteContext();

  const [newMenuTitle, setNewMenuTitle] = useState('');
  const [newMenuPath, setNewMenuPath] = useState('');

  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageContent, setNewPageContent] = useState('');

  const [saved, setSaved] = useState(false);

  // Reorder menu items
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const items = [...siteData.menuItems].sort((a, b) => a.order - b.order);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index].order;
    items[index].order = items[targetIndex].order;
    items[targetIndex].order = temp;

    updateMenuItems(items);
  };

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuTitle || !newMenuPath) return;
    addMenuItem({
      title: newMenuTitle,
      path: newMenuPath,
      order: siteData.menuItems.length + 1
    });
    setNewMenuTitle('');
    setNewMenuPath('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle || !newPageContent) return;
    addCustomPage({
      title: newPageTitle,
      slug: newPageTitle.toLowerCase().replace(/\s+/g, '-'),
      content: newPageContent
    });
    setNewPageTitle('');
    setNewPageContent('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* 1. Navigation Menu Management */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">상단 헤더 네비게이션 메뉴 관리</h2>
            <p className="text-xs text-slate-500 mt-1">
              상단 헤더에 노출되는 메뉴 항목과 순서를 변경하거나 새 메뉴를 추가합니다.
            </p>
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold animate-fadeIn">
              <Check size={16} />
              <span>업데이트 완료!</span>
            </div>
          )}
        </div>

        {/* Existing Menu Items List */}
        <div className="space-y-3">
          {[...siteData.menuItems]
            .sort((a, b) => a.order - b.order)
            .map((item, idx, arr) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#001528] text-[#f5ea1d] font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                    <span className="text-xs text-slate-400 block font-mono">경로: {item.path}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                    title="위로 이동"
                  >
                    <MoveUp size={14} />
                  </button>
                  <button
                    disabled={idx === arr.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                    title="아래로 이동"
                  >
                    <MoveDown size={14} />
                  </button>

                  {/* Built-in main pages protected from deletion */}
                  {['/', '/company', '/business', '/portfolio', '/notices'].includes(item.path) ? (
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold">
                      기본 메뉴
                    </span>
                  ) : (
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                      title="메뉴 삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Form: Add Custom Menu */}
        <form onSubmit={handleAddMenu} className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">커스텀 링크 메뉴 추가</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="메뉴 이름 (예: 고객후기)"
              value={newMenuTitle}
              onChange={(e) => setNewMenuTitle(e.target.value)}
              className="rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-[#001528]"
            />
            <input
              type="text"
              placeholder="이동 경로 (예: /reviews 또는 https://...)"
              value={newMenuPath}
              onChange={(e) => setNewMenuPath(e.target.value)}
              className="rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-[#001528]"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#001528] text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            <Plus size={16} />
            <span>새 메뉴 추가하기</span>
          </button>
        </form>
      </div>

      {/* 2. Custom Pages CRUD */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">독자적인 새 서브 페이지 생성 및 관리</h2>
          <p className="text-xs text-slate-500 mt-1">
            소개문, 특별 안내 페이지 등 새로운 커스텀 웹 페이지를 자유롭게 생성하고 메뉴에 자동 반영합니다.
          </p>
        </div>

        {/* Form: Add Custom Page */}
        <form onSubmit={handleCreatePage} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">페이지 제목</label>
            <input
              type="text"
              placeholder="예: 성동구 위반건축물 양성화 특별 가이드"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 bg-white outline-none focus:border-[#001528]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">페이지 상세 본문 내용</label>
            <textarea
              rows={6}
              placeholder="페이지에 노출할 본문 내용을 입력하세요."
              value={newPageContent}
              onChange={(e) => setNewPageContent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 bg-white outline-none focus:border-[#001528]"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#001528] text-[#f5ea1d] text-xs font-bold hover:bg-slate-800 transition"
          >
            <FilePlus size={16} />
            <span>페이지 생성 및 메뉴 등록</span>
          </button>
        </form>

        {/* Existing Custom Pages List */}
        {siteData.customPages.length > 0 && (
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-bold text-slate-800">생성된 커스텀 페이지 목록</h3>
            {siteData.customPages.map((cp) => (
              <div
                key={cp.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200"
              >
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{cp.title}</span>
                  <span className="text-xs text-slate-400">생성일: {cp.createdAt}</span>
                </div>

                <button
                  onClick={() => deleteCustomPage(cp.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  <span>삭제</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

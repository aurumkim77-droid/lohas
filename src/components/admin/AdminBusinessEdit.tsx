import React, { useState, useEffect } from 'react';
import { Save, Check, Plus, Trash2, MoveUp, MoveDown, Layers, ExternalLink } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { BusinessCard } from '../../types';
import { ImageInputPicker } from './ImageInputPicker';

export const AdminBusinessEdit: React.FC = () => {
  const { siteData, updateBusinessCards } = useSiteContext();
  const [cards, setCards] = useState<BusinessCard[]>(siteData.businessCards || []);
  const [saved, setSaved] = useState(false);
  const [savedCardId, setSavedCardId] = useState<string | null>(null);

  // Sync with context siteData when updated
  useEffect(() => {
    if (siteData.businessCards) {
      setCards(siteData.businessCards);
    }
  }, [siteData.businessCards]);

  const handleCardChange = (id: string, field: keyof BusinessCard, value: any) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateBusinessCards(cards);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveSingleCard = (cardId: string) => {
    updateBusinessCards(cards);
    setSavedCardId(cardId);
    setTimeout(() => setSavedCardId(null), 2500);
  };

  const handleAddCard = () => {
    const newId = 'b_' + Date.now();
    const newCard: BusinessCard = {
      id: newId,
      title: '신규 사업 영역',
      subtitle: 'NEW SERVICE',
      description: '신규 사업 영역에 대한 요약 설명입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80',
      details: '신규 사업 영역의 상세 내용 및 업무 범위를 작성해 주세요.',
      order: cards.length + 1
    };
    const updated = [...cards, newCard];
    setCards(updated);
    updateBusinessCards(updated);
  };

  const handleDeleteCard = (id: string) => {
    if (cards.length <= 1) {
      alert('최소 1개 이상의 사업영역 카드가 유지되어야 합니다.');
      return;
    }
    if (window.confirm('해당 사업영역 카드를 삭제하시겠습니까?')) {
      const updated = cards.filter((c) => c.id !== id);
      setCards(updated);
      updateBusinessCards(updated);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newCards = [...cards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCards.length) return;

    const temp = newCards[index];
    newCards[index] = newCards[targetIndex];
    newCards[targetIndex] = temp;

    // Update order numbers
    const reordered = newCards.map((c, idx) => ({ ...c, order: idx + 1 }));
    setCards(reordered);
    updateBusinessCards(reordered);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#001528] text-[#f5ea1d] flex items-center justify-center font-bold">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">핵심 사업영역 카드 관리</h2>
              <p className="text-xs text-slate-500 mt-1">
                건축설계/감리, 용도변경, 증축/리모델링, 위반건축물 양성화 등 주요 사업영역 항목을 수정합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold animate-fadeIn">
                <Check size={16} />
                <span>모든 변경사항 저장 완료!</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleAddCard}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-200"
            >
              <Plus size={15} />
              <span>사업영역 추가</span>
            </button>
            <button
              type="button"
              onClick={() => handleSaveAll()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#001528] text-[#f5ea1d] font-bold text-xs hover:bg-slate-800 transition shadow"
            >
              <Save size={15} />
              <span>전체 저장</span>
            </button>
          </div>
        </div>

        {/* Cards Editor List */}
        <div className="space-y-8">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-5 transition hover:border-slate-300"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#001528] text-[#f5ea1d] text-xs font-black flex items-center justify-center">
                    0{index + 1}
                  </span>
                  <span className="font-extrabold text-slate-900 text-base">{card.title || '제목 없음'}</span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">({card.id})</span>
                </div>

                <div className="flex items-center gap-2">
                  {savedCardId === card.id && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                      <Check size={14} /> 저장됨
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30"
                    title="위로 이동"
                  >
                    <MoveUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === cards.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30"
                    title="아래로 이동"
                  >
                    <MoveDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    title="삭제"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">사업영역 제목</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleCardChange(card.id, 'title', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-[#001528]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">영문 / 서브 타이틀</label>
                  <input
                    type="text"
                    value={card.subtitle}
                    onChange={(e) => handleCardChange(card.id, 'subtitle', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-white outline-none focus:border-[#001528]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  카드 요약 설명 (메인 카드 노출)
                </label>
                <input
                  type="text"
                  value={card.description}
                  onChange={(e) => handleCardChange(card.id, 'description', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-white outline-none focus:border-[#001528]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  상세 업무 설명 (모달 및 상세페이지 노출)
                </label>
                <textarea
                  rows={3}
                  value={card.details || ''}
                  onChange={(e) => handleCardChange(card.id, 'details', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-white outline-none focus:border-[#001528]"
                />
              </div>

              {/* Image Input Picker */}
              <ImageInputPicker
                label="대표 이미지"
                value={card.imageUrl}
                onChange={(url) => handleCardChange(card.id, 'imageUrl', url)}
                placeholder="이미지 URL 입력 또는 [파일 선택] 버튼 사용"
              />

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                  <ExternalLink size={12} />
                  <span>외부 바로가기 URL (선택사항, 입력 시 해당 링크로 이동)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://blog.naver.com/reredos123"
                  value={card.externalUrl || ''}
                  onChange={(e) => handleCardChange(card.id, 'externalUrl', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-white font-mono outline-none focus:border-[#001528]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSingleCard(card.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition"
                >
                  <Save size={14} />
                  <span>이 카드 저장</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Save All Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <button
            type="button"
            onClick={handleAddCard}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-200"
          >
            <Plus size={15} />
            <span>새 사업영역 카드 추가</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#001528] text-[#f5ea1d] font-bold text-sm hover:bg-slate-800 transition shadow-md"
          >
            <Save size={16} />
            <span>사업영역 전체 변경사항 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
};

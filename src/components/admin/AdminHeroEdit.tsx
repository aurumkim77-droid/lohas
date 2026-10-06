import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { ImageInputPicker } from './ImageInputPicker';

export const AdminHeroEdit: React.FC = () => {
  const { siteData, updateTheme } = useSiteContext();
  const [heroTitle, setHeroTitle] = useState(siteData.theme.heroTitle);
  const [heroSubTitle, setHeroSubTitle] = useState(siteData.theme.heroSubTitle);
  const [heroDescription, setHeroDescription] = useState(siteData.theme.heroDescription);
  const [heroImageUrl, setHeroImageUrl] = useState(siteData.theme.heroImageUrl);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTheme({
      heroTitle,
      heroSubTitle,
      heroDescription,
      heroImageUrl
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">홈페이지 메인 비주얼 (Hero) 관리</h2>
            <p className="text-xs text-slate-500 mt-1">
              메인 화면 상단에 노출되는 대형 배경 이미지와 주요 슬로건 문구를 수정합니다.
            </p>
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold animate-fadeIn">
              <Check size={16} />
              <span>저장되었습니다!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              메인 상단 타이틀 (Hero Title)
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-[#001528] focus:ring-2 focus:ring-[#001528]/10"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              메인 강조 타이틀 (Hero SubTitle)
            </label>
            <input
              type="text"
              value={heroSubTitle}
              onChange={(e) => setHeroSubTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-800 outline-none focus:border-[#001528] focus:ring-2 focus:ring-[#001528]/10"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              보조 설명 문구 (Hero Description)
            </label>
            <textarea
              rows={3}
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-[#001528] focus:ring-2 focus:ring-[#001528]/10"
              required
            />
          </div>

          <ImageInputPicker
            label="메인 배경 이미지"
            value={heroImageUrl}
            onChange={setHeroImageUrl}
            placeholder="이미지 URL 입력 또는 오른쪽 [파일 선택] 버튼 사용"
          />

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#001528] text-[#f5ea1d] font-bold text-sm hover:bg-slate-800 transition shadow-md"
            >
              <Save size={16} />
              <span>변경사항 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

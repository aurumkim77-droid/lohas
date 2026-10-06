import React, { useState } from 'react';
import { Palette, Check, Save, Type } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { ThemeSettings } from '../../types';

const FONTS: ThemeSettings['fontFamily'][] = [
  'Noto Sans KR',
  'Pretendard',
  'Gmarket Sans',
  'Spoqa Han Sans Neo',
  'Nanum Myeongjo'
];

export const AdminThemeEdit: React.FC = () => {
  const { siteData, updateTheme } = useSiteContext();
  const { theme } = siteData;

  const [primaryColor, setPrimaryColor] = useState(theme.primaryColor || '#001528');
  const [accentColor, setAccentColor] = useState(theme.accentColor || '#f5ea1d');
  const [fontFamily, setFontFamily] = useState<ThemeSettings['fontFamily']>(theme.fontFamily || 'Noto Sans KR');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTheme({
      primaryColor,
      accentColor,
      fontFamily
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">색상 및 테마, 폰트 관리</h2>
            <p className="text-xs text-slate-500 mt-1">
              홈페이지 메인 네이비 컬러(#001528), 포인트 골드 컬러(#f5ea1d) 및 서체를 자유롭게 변경합니다.
            </p>
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold animate-fadeIn">
              <Check size={16} />
              <span>적용되었습니다!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Color Picker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase">
                메인 컬러 (Primary Color)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border border-slate-300 cursor-pointer p-1"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="rounded-xl border border-slate-200 p-3 text-sm font-mono text-slate-800 bg-white"
                />
              </div>
              <span className="text-[11px] text-slate-400 block">기본 추천 메인 컬러: #001528 (네이비)</span>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase">
                포인트 컬러 (Accent Color)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border border-slate-300 cursor-pointer p-1"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="rounded-xl border border-slate-200 p-3 text-sm font-mono text-slate-800 bg-white"
                />
              </div>
              <span className="text-[11px] text-slate-400 block">기본 추천 포인트 컬러: #f5ea1d (골드 옐로우)</span>
            </div>
          </div>

          {/* Font Selection */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase">
              대표 서체 / 폰트 (Font Family)
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as any)}
              className="w-full max-w-md rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-800 bg-white"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">
              선택한 폰트가 전체 웹사이트 타이포그래피에 즉시 반영됩니다.
            </p>
          </div>

          {/* Live Preview Box */}
          <div className="p-6 rounded-2xl border border-slate-200 shadow-inner space-y-3" style={{ backgroundColor: primaryColor }}>
            <span className="text-xs font-bold px-2.5 py-1 rounded" style={{ backgroundColor: accentColor, color: primaryColor }}>
              적용 색상 미리보기
            </span>
            <h3 className="text-2xl font-black text-white">로하스건축사사무소 실시간 컬러 미리보기</h3>
            <p className="text-xs text-slate-200">
              상단 헤더, 메인 비주얼, 버튼 및 포인트 영역에 설정된 색상조합입니다.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#001528] text-[#f5ea1d] font-bold text-sm hover:bg-slate-800 transition shadow-md"
            >
              <Save size={16} />
              <span>색상 및 폰트 설정 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

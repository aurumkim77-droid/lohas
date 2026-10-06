import React, { useState } from 'react';
import { Save, Plus, Trash2, Check, UserCheck, History } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { ImageInputPicker } from './ImageInputPicker';

export const AdminCompanyEdit: React.FC = () => {
  const { siteData, updateCompanyInfo } = useSiteContext();
  const { companyInfo } = siteData;

  const [ceoName, setCeoName] = useState(companyInfo.ceoName);
  const [greetingTitle, setGreetingTitle] = useState(companyInfo.greetingTitle);
  const [greetingContent, setGreetingContent] = useState(companyInfo.greetingContent);
  const [greetingImage, setGreetingImage] = useState(companyInfo.greetingImage);
  const [visionTitle, setVisionTitle] = useState(companyInfo.visionTitle);
  const [visionContent, setVisionContent] = useState(companyInfo.visionContent);
  const [philosophyTitle, setPhilosophyTitle] = useState(companyInfo.philosophyTitle);
  const [philosophyContent, setPhilosophyContent] = useState(companyInfo.philosophyContent);
  const [organizationChartUrl, setOrganizationChartUrl] = useState(companyInfo.organizationChartUrl || '');

  const [architectCareers, setArchitectCareers] = useState<string[]>(
    companyInfo.architectCareers && companyInfo.architectCareers.length > 0
      ? companyInfo.architectCareers
      : [
          '예종합건축사사무소, 유진인터내셔날종합건축사사무소 근무',
          '2008년 건축사 면허 취득, 건축사협회 정회원 등록',
          '2014년 로하스건축사사무소 개설',
          '현 로하스건축사사무소 대표',
          '건축물정기점검/해제감리/석면고급감리 실무교육 수료',
          '그린리모델링창조센터 그린리모델링 사업자 등록',
          '리모델링 및 인테리어 전문가',
          '성동구청 건축민원상담실 건축법 상담 건축사',
          '서울중앙지방법원등 법원감정인',
          '서울시 집수리전문관'
        ]
  );
  const [newCareerItem, setNewCareerItem] = useState('');

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyInfo({
      ceoName,
      greetingTitle,
      greetingContent,
      greetingImage,
      visionTitle,
      visionContent,
      philosophyTitle,
      philosophyContent,
      organizationChartUrl,
      histories: [],
      architectCareers
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddCareer = () => {
    if (!newCareerItem.trim()) return;
    setArchitectCareers([...architectCareers, newCareerItem.trim()]);
    setNewCareerItem('');
  };

  const handleDeleteCareer = (index: number) => {
    setArchitectCareers(architectCareers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">회사소개 및 인사말 관리</h2>
            <p className="text-xs text-slate-500 mt-1">
              대표자명(김용호 건축사), 인사말, 비전, 철학, 연혁, 조직도를 수정합니다.
            </p>
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold animate-fadeIn">
              <Check size={16} />
              <span>저장 완료!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Representative Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">대표자 성명 및 직함</label>
              <input
                type="text"
                value={ceoName}
                onChange={(e) => setCeoName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-800 outline-none focus:border-[#001528]"
                required
              />
            </div>

            <ImageInputPicker
              label="대표자 프로필 사진"
              value={greetingImage}
              onChange={setGreetingImage}
              placeholder="프로필 사진 URL 입력 또는 오른쪽 [파일 선택] 버튼 사용"
            />
          </div>

          {/* Greeting */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">대표 인사말 제목</label>
            <input
              type="text"
              value={greetingTitle}
              onChange={(e) => setGreetingTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-800 outline-none focus:border-[#001528]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">대표 인사말 본문 내용</label>
            <textarea
              rows={6}
              value={greetingContent}
              onChange={(e) => setGreetingContent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-[#001528]"
              required
            />
          </div>

          {/* Organization Chart URL */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase">조직도 이미지 URL</label>
            <input
              type="text"
              value={organizationChartUrl}
              onChange={(e) => setOrganizationChartUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-[#001528]"
            />
          </div>

          {/* Architect Careers CRUD */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">대표 건축사 주요경력 관리</h3>

            {/* Form to add career item */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <input
                type="text"
                placeholder="예: 그린리모델링창조센터 그린리모델링 사업자 등록"
                value={newCareerItem}
                onChange={(e) => setNewCareerItem(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-white outline-none focus:border-[#001528]"
              />
              <button
                type="button"
                onClick={handleAddCareer}
                className="px-4 py-2.5 rounded-xl bg-[#001528] text-white text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1 shrink-0"
              >
                <Plus size={14} />
                <span>경력 항목 추가</span>
              </button>
            </div>

            {/* Existing Careers */}
            <div className="space-y-2">
              {architectCareers.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 text-xs"
                >
                  <span className="font-semibold text-slate-900">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCareer(i)}
                    className="p-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200 transition shrink-0 ml-2"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#001528] text-[#f5ea1d] font-bold text-sm hover:bg-slate-800 transition shadow-md"
            >
              <Save size={16} />
              <span>회사소개 전체 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

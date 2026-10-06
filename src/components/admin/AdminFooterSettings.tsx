import React, { useState } from 'react';
import { Save, Check, Settings, ShieldCheck, MapPin } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';

export const AdminFooterSettings: React.FC = () => {
  const { siteData, updateSettings } = useSiteContext();
  const { settings } = siteData;

  const [siteName, setSiteName] = useState(settings.siteName);
  const [ceoName, setCeoName] = useState(settings.ceoName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [businessNumber, setBusinessNumber] = useState(settings.businessNumber || '206-32-02344');
  const [naverBlogUrl, setNaverBlogUrl] = useState(settings.naverBlogUrl);
  const [qnaUrl, setQnaUrl] = useState(settings.qnaUrl || 'https://naver.me/xB7XkDIy');
  const [googleMapEmbedUrl, setGoogleMapEmbedUrl] = useState(settings.googleMapEmbedUrl);
  const [privacyPolicy, setPrivacyPolicy] = useState(settings.privacyPolicy);
  const [termsOfService, setTermsOfService] = useState(settings.termsOfService);

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteName,
      ceoName,
      address,
      phone,
      email,
      businessNumber,
      naverBlogUrl,
      qnaUrl,
      googleMapEmbedUrl,
      privacyPolicy,
      termsOfService
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Footer 및 사이트 전체 기본 정보 관리</h2>
            <p className="text-xs text-slate-500 mt-1">
              상호명, 대표자명, 주소, 연락처, 이메일, 네이버 블로그 URL 및 약관 문구를 수정합니다.
            </p>
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold animate-fadeIn">
              <Check size={16} />
              <span>저장 되었습니다!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">사이트 / 웹사이트명</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">대표자명</label>
              <input
                type="text"
                value={ceoName}
                onChange={(e) => setCeoName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-800"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase">사무실 주소</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">대표 전화번호</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">이메일 주소</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">사업자등록번호</label>
              <input
                type="text"
                value={businessNumber}
                onChange={(e) => setBusinessNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">
                공식 네이버 블로그 URL
              </label>
              <input
                type="text"
                value={naverBlogUrl}
                onChange={(e) => setNaverBlogUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-mono text-slate-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">
                Q&A 온라인 문의 폼 URL (네이버 폼 등)
              </label>
              <input
                type="text"
                value={qnaUrl}
                onChange={(e) => setQnaUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-mono text-slate-800"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase">
              Google 지도 임베드 Embed URL
            </label>
            <input
              type="text"
              value={googleMapEmbedUrl}
              onChange={(e) => setGoogleMapEmbedUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm font-mono text-slate-800"
              required
            />
          </div>

          {/* Legal Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase">
                개인정보처리방침 내용
              </label>
              <textarea
                rows={6}
                value={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase">
                이용약관 내용
              </label>
              <textarea
                rows={6}
                value={termsOfService}
                onChange={(e) => setTermsOfService(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#001528] text-[#f5ea1d] font-bold text-sm hover:bg-slate-800 transition shadow-md"
            >
              <Save size={16} />
              <span>사이트 정보 및 Footer 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

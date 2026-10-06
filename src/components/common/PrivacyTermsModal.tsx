import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';

interface PrivacyTermsModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({ type, onClose }) => {
  const { siteData } = useSiteContext();

  if (!type) return null;

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? '개인정보처리방침' : '이용약관';
  const content = isPrivacy ? siteData.settings.privacyPolicy : siteData.settings.termsOfService;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#001528] px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5ea1d] text-[#001528]">
              {isPrivacy ? <ShieldCheck size={20} /> : <FileText size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-300">{siteData.settings.siteName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-50/50">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            {content}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-white px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#001528] px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

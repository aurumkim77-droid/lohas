import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  FileText,
  ArrowUp
} from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { PrivacyTermsModal } from './PrivacyTermsModal';
import { LohasLogo } from './LohasLogo';

interface FooterProps {
  onOpenLoginModal: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const { siteData, setCurrentPage } = useSiteContext();
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-[#001528] text-slate-300 border-t border-slate-800 pt-16 pb-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-12 border-b border-slate-800">
            {/* Column 1: Company Logo & Info */}
            <div className="space-y-4">
              <div 
                onClick={() => {
                  setCurrentPage('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="flex items-center justify-center p-1 rounded-xl bg-white/10 group-hover:bg-white/20 border border-white/10 transition">
                  <LohasLogo className="h-9 w-auto" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#f5ea1d] transition">
                    {siteData.settings.siteName}
                  </h3>
                  <p className="text-xs text-[#f5ea1d] font-semibold">
                    대표 건축사 : {siteData.settings.ceoName}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                건축설계부터 감리, 용도변경, 증축 및 리모델링, 위반건축물 양성화까지 건축의 전문적인 가치 창출 서비스를 원스톱으로 제공해 드립니다.
              </p>
            </div>

            {/* Column 2: Contact Info */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#f5ea1d] pl-2.5">
                연락처 및 위치
              </h4>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#f5ea1d] shrink-0 mt-0.5" />
                  <span>주소 : {siteData.settings.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={16} className="text-[#f5ea1d] shrink-0" />
                  <span>
                    대표전화 :{' '}
                    <a href={`tel:${siteData.settings.phone || '02-499-0229'}`} className="hover:text-white transition font-semibold">
                      {siteData.settings.phone || '02-499-0229'}
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={16} className="text-[#f5ea1d] shrink-0" />
                  <span>이메일 : <a href={`mailto:${siteData.settings.email}`} className="hover:text-white transition">{siteData.settings.email}</a></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <FileText size={16} className="text-[#f5ea1d] shrink-0" />
                  <span>사업자번호 : {siteData.settings.businessNumber || '206-32-02344'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              © {new Date().getFullYear()} {siteData.settings.siteName}. All rights reserved. (대표 건축사 : {siteData.settings.ceoName})
            </p>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => setModalType('privacy')}
                className="hover:text-[#f5ea1d] transition underline-offset-4 hover:underline"
              >
                개인정보처리방침
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => setModalType('terms')}
                className="hover:text-[#f5ea1d] transition underline-offset-4 hover:underline"
              >
                이용약관
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1 text-[#f5ea1d] hover:text-amber-300 font-semibold"
              >
                <span>TOP</span>
                <ArrowUp size={14} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy & Terms Modal */}
      <PrivacyTermsModal type={modalType} onClose={() => setModalType(null)} />
    </>
  );
};

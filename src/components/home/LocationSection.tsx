import React from 'react';
import { MapPin, Phone, Mail, Navigation, ExternalLink, Building } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';

export const LocationSection: React.FC = () => {
  const { siteData } = useSiteContext();
  const { settings } = siteData;

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5ea1d] text-[#001528] text-xs font-black uppercase tracking-wider">
            LOCATION & CONTACT
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            로하스건축사사무소 <span className="text-[#f5ea1d]">오시는 길</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            사무소 방문 상담은 사전 예약을 통해 더욱 빠르고 정밀하게 진행됩니다.
          </p>
        </div>

        {/* Grid: Info + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Info Card */}
          <div className="lg:col-span-5 bg-[#001528] rounded-2xl p-8 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5ea1d] text-[#001528] font-bold">
                  <Building size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{settings.siteName}</h3>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-[#f5ea1d] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-slate-400 font-medium">사무실 주소</span>
                    <span className="font-semibold text-white text-base">{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-[#f5ea1d] shrink-0" />
                  <div>
                    <span className="block text-xs text-slate-400 font-medium">대표 전화</span>
                    <div className="font-bold text-white text-base sm:text-lg flex flex-wrap items-center gap-x-2">
                      <a href={`tel:${settings.phone || '02-499-0229'}`} className="hover:text-[#f5ea1d] transition">
                        {settings.phone || '02-499-0229'}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-[#f5ea1d] shrink-0" />
                  <div>
                    <span className="block text-xs text-slate-400 font-medium">이메일 문의</span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="font-semibold text-white hover:text-[#f5ea1d] transition"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Direction Buttons */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <span className="block text-xs text-slate-400 font-semibold mb-2">
                지도 서비스 길찾기 및 검색 바로가기
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <a
                  href={settings.naverMapSearchUrl || "https://map.naver.com/v5/search/%EC%82%B4%EA%B3%B3%EC%9D%B4%EA%B8%B8%20150"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-[#78eb64] hover:bg-[#68de55] text-[#001528] font-black text-xs transition shadow-md"
                >
                  <Navigation size={14} />
                  <span>네이버 지도</span>
                  <ExternalLink size={12} />
                </a>

                <a
                  href={settings.kakaoMapSearchUrl || "https://map.kakao.com/link/search/%EC%82%B4%EA%B3%B3%EC%9D%B4%EA%B8%B8%20150"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition shadow-md"
                >
                  <Navigation size={14} />
                  <span>카카오 맵</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Map Embed Container */}
          <div className="lg:col-span-7 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 min-h-[400px] relative shadow-2xl">
            <iframe
              title="로하스건축사사무소 위치 지도"
              src={settings.googleMapEmbedUrl?.trim() || "https://maps.google.com/maps?q=%EC%82%B4%EA%B3%B3%EC%9D%B4%EA%B8%B8%20150&t=&z=16&ie=UTF8&iwloc=&output=embed"}
              className="w-full h-full min-h-[400px] border-0 filter grayscale-[20%] contrast-[110%]"
              loading="lazy"
              allowFullScreen
            />
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-white border border-slate-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Google Maps 실시간 연동</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

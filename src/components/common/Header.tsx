import React, { useState } from 'react';
import {
  Building2,
  Menu,
  X,
  ExternalLink,
  Lock,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles
} from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { LohasLogo } from './LohasLogo';

interface HeaderProps {
  onOpenLoginModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLoginModal }) => {
  const {
    siteData,
    currentPage,
    setCurrentPage,
    isAdminLoggedIn,
    isAdminModeActive,
    setIsAdminModeActive,
    logoutAdmin,
    firebaseUser,
    logoutFirebaseUser
  } = useSiteContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sort menu items by order
  const sortedMenuItems = [...siteData.menuItems].sort((a, b) => a.order - b.order);

  const handleNavClick = (path: string) => {
    setCurrentPage(path);
    setMobileMenuOpen(false);
    // If admin dashboard mode was active, exiting it when navigating to standard user pages
    if (isAdminModeActive) {
      setIsAdminModeActive(false);
    }
    if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Admin Status Bar when logged in */}
      {isAdminLoggedIn && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-slate-900 animate-pulse" />
            <span className="font-bold">관리자 모드 활성화</span>
            <span className="hidden md:inline text-slate-800 font-normal">
              {firebaseUser ? `(Google: ${firebaseUser.email || firebaseUser.displayName})` : '(인증 완료)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminModeActive(!isAdminModeActive)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                isAdminModeActive
                  ? 'bg-slate-900 text-[#f5ea1d] shadow'
                  : 'bg-slate-900/10 hover:bg-slate-900/20 text-slate-900'
              }`}
            >
              <LayoutDashboard size={14} />
              <span>{isAdminModeActive ? '홈페이지 보기' : '관리자 대시보드'}</span>
            </button>
            <button
              onClick={firebaseUser ? logoutFirebaseUser : logoutAdmin}
              className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs transition flex items-center gap-1"
              title="로그아웃"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#001528] text-white shadow-lg border-b border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="flex items-center justify-center p-1 rounded-xl bg-white/10 group-hover:bg-white/20 transition-all border border-white/10 group-hover:scale-105">
                <LohasLogo className="h-9 sm:h-11 w-auto" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-[#f5ea1d] transition-colors">
                  {siteData.settings.siteName}
                </span>
                <span className="text-[10px] sm:text-xs tracking-wider text-slate-300 italic font-semibold">
                  Lohas Architect
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {sortedMenuItems.map((item) => {
                const isActive = currentPage === item.path && !isAdminModeActive;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                      isActive
                        ? 'text-[#f5ea1d] bg-white/10'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.title}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#f5ea1d] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Naver Blog Button */}
              <a
                href={siteData.settings.naverBlogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#78eb64] hover:bg-[#68de55] text-[#001528] text-xs font-black transition shadow-sm hover:shadow"
              >
                <span className="w-2 h-2 rounded-full bg-[#001528] animate-pulse" />
                <span>네이버 블로그</span>
                <ExternalLink size={13} />
              </a>

              {/* Admin Button */}
              {isAdminLoggedIn ? (
                <button
                  onClick={() => setIsAdminModeActive(!isAdminModeActive)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f5ea1d] hover:bg-amber-300 text-[#001528] text-xs font-extrabold shadow-md transition"
                >
                  <Settings size={14} />
                  <span>{isAdminModeActive ? '홈페이지' : '관리자대시보드'}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenLoginModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition"
                >
                  <Lock size={13} />
                  <span>관리자로그인</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={siteData.settings.naverBlogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-xs font-black bg-[#78eb64] text-[#001528] rounded-lg flex items-center gap-1 shadow-sm"
                title="네이버 블로그"
              >
                <span>블로그</span>
                <ExternalLink size={12} />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none"
                aria-label="메뉴 열기"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#00182e] border-t border-white/10 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
            <div className="flex flex-col space-y-1">
              {sortedMenuItems.map((item) => {
                const isActive = currentPage === item.path && !isAdminModeActive;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className={`text-left px-4 py-3 rounded-xl text-base font-semibold transition ${
                      isActive
                        ? 'bg-[#f5ea1d] text-[#001528]'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              {isAdminLoggedIn ? (
                <button
                  onClick={() => {
                    setIsAdminModeActive(!isAdminModeActive);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-[#f5ea1d] text-[#001528] font-bold text-center text-sm flex items-center justify-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  <span>{isAdminModeActive ? '홈페이지 보기' : '관리자 대시보드 열기'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLoginModal();
                  }}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-center text-sm flex items-center justify-center gap-2"
                >
                  <Lock size={15} />
                  <span>관리자 로그인 (비밀번호: master8879)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Home,
  Menu,
  Building,
  Briefcase,
  Layers,
  FileText,
  Image as ImageIcon,
  Palette,
  Type,
  Sliders,
  Settings,
  KeyRound,
  LogOut,
  ChevronRight,
  Eye,
  Database
} from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { LohasLogo } from '../common/LohasLogo';
import { AdminOverview } from './AdminOverview';
import { AdminHeroEdit } from './AdminHeroEdit';
import { AdminMenuEdit } from './AdminMenuEdit';
import { AdminCompanyEdit } from './AdminCompanyEdit';
import { AdminBusinessEdit } from './AdminBusinessEdit';
import { AdminPortfolioEdit } from './AdminPortfolioEdit';
import { AdminNoticeEdit } from './AdminNoticeEdit';
import { AdminImageEdit } from './AdminImageEdit';
import { AdminThemeEdit } from './AdminThemeEdit';
import { AdminFooterSettings } from './AdminFooterSettings';
import { AdminSecurityEdit } from './AdminSecurityEdit';

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'hero', label: '홈페이지 관리', icon: Home },
  { id: 'menus', label: '메뉴관리', icon: Menu },
  { id: 'company', label: '회사소개', icon: Building },
  { id: 'business', label: '사업영역', icon: Briefcase },
  { id: 'portfolio', label: '포트폴리오', icon: Layers },
  { id: 'notices', label: '공지사항', icon: FileText },
  { id: 'images', label: '이미지 관리', icon: ImageIcon },
  { id: 'theme', label: '색상 및 테마', icon: Palette },
  { id: 'fonts', label: '폰트관리', icon: Type },
  { id: 'footer', label: 'Footer관리', icon: Sliders },
  { id: 'site', label: '사이트 설정', icon: Settings },
  { id: 'backup', label: '배포 & 데이터백업', icon: Database },
  { id: 'security', label: '비밀번호 변경', icon: KeyRound }
];

export const AdminDashboard: React.FC = () => {
  const { siteData, setIsAdminModeActive, logoutAdmin } = useSiteContext();
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#001528] text-white flex-shrink-0 border-r border-slate-800 shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <LohasLogo className="h-8 w-auto" />
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#f5ea1d] uppercase block">
              ADMIN CONTROL PANEL
            </span>
            <h1 className="text-sm font-black tracking-tight text-white mt-0.5">
              {siteData.settings.siteName}
            </h1>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#f5ea1d] text-[#001528] shadow-md'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="stroke-[3]" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setIsAdminModeActive(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Eye size={14} />
            <span>홈페이지 보기</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="w-full py-2 px-4 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <LogOut size={13} />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl">
        {activeTab === 'overview' && <AdminOverview onNavigateTab={setActiveTab} />}
        {activeTab === 'backup' && <AdminOverview onNavigateTab={setActiveTab} />}
        {activeTab === 'hero' && <AdminHeroEdit />}
        {activeTab === 'menus' && <AdminMenuEdit />}
        {activeTab === 'company' && <AdminCompanyEdit />}
        {activeTab === 'business' && <AdminBusinessEdit />}
        {activeTab === 'portfolio' && <AdminPortfolioEdit />}
        {activeTab === 'notices' && <AdminNoticeEdit />}
        {activeTab === 'images' && <AdminImageEdit />}
        {activeTab === 'theme' && <AdminThemeEdit />}
        {activeTab === 'fonts' && <AdminThemeEdit />}
        {activeTab === 'footer' && <AdminFooterSettings />}
        {activeTab === 'site' && <AdminFooterSettings />}
        {activeTab === 'security' && <AdminSecurityEdit />}
      </main>
    </div>
  );
};

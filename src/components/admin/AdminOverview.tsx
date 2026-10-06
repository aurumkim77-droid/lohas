import React, { useRef } from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Building,
  Menu,
  Palette,
  RotateCcw,
  ExternalLink,
  CheckCircle,
  Eye,
  Plus,
  KeyRound,
  Database,
  Download,
  Upload,
  Copy
} from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { siteData, resetToDefault, importSiteData } = useSiteContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    if (window.confirm('사이트의 모든 데이터를 초기 상태(로하스건축사사무소 기본 데이터)로 복원하시겠습니까?')) {
      resetToDefault();
      alert('초기화가 완료되었습니다.');
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(siteData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lohas_site_data_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          if (event.target?.result) {
            const parsed = JSON.parse(event.target.result as string);
            if (parsed && typeof parsed === 'object') {
              importSiteData(parsed);
              alert('백업 데이터가 성공적으로 불러와져 반영되었습니다!');
            }
          }
        } catch {
          alert('유효하지 않은 백업 파일(JSON)입니다.');
        }
      };
    }
  };

  const handleCopyInitialDataCode = () => {
    const code = `import { SiteData } from '../types';\n\nexport const INITIAL_SITE_DATA: SiteData = ${JSON.stringify(siteData, null, 2)};\n`;
    navigator.clipboard.writeText(code).then(() => {
      alert('initialData.ts용 소스코드가 클립보드에 복사되었습니다!\nsrc/data/initialData.ts 파일에 붙여넣어 배포하시면 배포 시 동일하게 유지됩니다.');
    }).catch(() => {
      alert('복사에 실패했습니다. JSON 다운로드 버튼을 이용해 주세요.');
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-[#001528] text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5ea1d] text-[#001528] text-xs font-black">
            관리자 모드 접속 완료
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {siteData.settings.siteName} 관리자 대시보드
          </h2>
          <p className="text-sm text-slate-300">
            비밀번호 인증 완료 · 사이트의 모든 메뉴와 콘텐츠, 이미지, 색상, 연락처 정보를 자유롭게 수정할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigateTab('security')}
            className="px-4 py-2.5 rounded-xl bg-[#f5ea1d] text-[#001528] hover:bg-amber-300 font-bold text-xs transition flex items-center gap-1.5 shadow"
          >
            <KeyRound size={14} />
            <span>비밀번호 변경</span>
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>초기 데이터 복원</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => onNavigateTab('business')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">사업영역 카드</span>
            <span className="text-3xl font-black text-slate-900">{siteData.businessCards.length}개</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Briefcase size={22} />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('portfolio')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">등록 포트폴리오 (최대 150개)</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{siteData.portfolioItems.length}</span>
              <span className="text-sm font-bold text-slate-400">/ 150개</span>
            </div>
            <span className="text-[10px] text-amber-600 font-bold block mt-1">
              {150 - siteData.portfolioItems.length}개 추가 가능
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Building size={22} />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('notices')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">등록 공지사항</span>
            <span className="text-3xl font-black text-slate-900">{siteData.notices.length}개</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileText size={22} />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('menus')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">네비게이션 메뉴</span>
            <span className="text-3xl font-black text-slate-900">{siteData.menuItems.length}개</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Menu size={22} />
          </div>
        </div>
      </div>

      {/* Quick Access Action Shortcuts */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
          자주 찾는 편집 항목 바로가기
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigateTab('hero')}
            className="p-5 rounded-2xl bg-slate-50 hover:bg-[#001528] hover:text-white border border-slate-200 text-slate-800 text-left transition group space-y-2"
          >
            <span className="text-xs font-extrabold text-[#001528] group-hover:text-[#f5ea1d]">
              01. 메인 배너
            </span>
            <h4 className="font-bold text-base">Hero 메인 이미지 & 문구</h4>
            <p className="text-xs text-slate-500 group-hover:text-slate-300">
              배경 이미지, 대표 슬로건, 서브 문구 변경
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('business')}
            className="p-5 rounded-2xl bg-slate-50 hover:bg-[#001528] hover:text-white border border-slate-200 text-slate-800 text-left transition group space-y-2"
          >
            <span className="text-xs font-extrabold text-[#001528] group-hover:text-[#f5ea1d]">
              02. 사업영역
            </span>
            <h4 className="font-bold text-base">4개 사업영역 카드 & 외부링크</h4>
            <p className="text-xs text-slate-500 group-hover:text-slate-300">
              건축설계, 용도변경, 리모델링, 양성화 수정
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('portfolio')}
            className="p-5 rounded-2xl bg-slate-50 hover:bg-[#001528] hover:text-white border border-slate-200 text-slate-800 text-left transition group space-y-2"
          >
            <span className="text-xs font-extrabold text-[#001528] group-hover:text-[#f5ea1d]">
              03. 포트폴리오
            </span>
            <h4 className="font-bold text-base">포트폴리오 등록 & 삭제</h4>
            <p className="text-xs text-slate-500 group-hover:text-slate-300">
              카테고리별 건축 사례 등록 및 사진 관리
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('notices')}
            className="p-5 rounded-2xl bg-slate-50 hover:bg-[#001528] hover:text-white border border-slate-200 text-slate-800 text-left transition group space-y-2"
          >
            <span className="text-xs font-extrabold text-[#001528] group-hover:text-[#f5ea1d]">
              04. 게시판 관리
            </span>
            <h4 className="font-bold text-base">공지사항 게시글 CRUD</h4>
            <p className="text-xs text-slate-500 group-hover:text-slate-300">
              새 공지 작성, 상단고정, 첨부파일 설정
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('theme')}
            className="p-5 rounded-2xl bg-slate-50 hover:bg-[#001528] hover:text-white border border-slate-200 text-slate-800 text-left transition group space-y-2"
          >
            <span className="text-xs font-extrabold text-[#001528] group-hover:text-[#f5ea1d]">
              05. 테마/폰트
            </span>
            <h4 className="font-bold text-base">색상 (#001528) & 폰트 설정</h4>
            <p className="text-xs text-slate-500 group-hover:text-slate-300">
              메인 컬러, 포인트 컬러, 서체 자유 변경
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('site')}
            className="p-5 rounded-2xl bg-slate-50 hover:bg-[#001528] hover:text-white border border-slate-200 text-slate-800 text-left transition group space-y-2"
          >
            <span className="text-xs font-extrabold text-[#001528] group-hover:text-[#f5ea1d]">
              06. 정보 설정
            </span>
            <h4 className="font-bold text-base">회사 정보 & Google 지도</h4>
            <p className="text-xs text-slate-500 group-hover:text-slate-300">
              주소, 대표전화, 대표자명, 블로그 주소 변경
            </p>
          </button>
        </div>
      </div>

      {/* Deployment & Data Backup Management Card */}
      <div className="bg-gradient-to-br from-slate-900 to-[#001528] text-white p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Database size={13} />
              <span>배포 데이터 관리 & 백업</span>
            </div>
            <h3 className="text-xl font-black text-white">
              배포용 데이터 내보내기 및 백업 백업/복원
            </h3>
            <p className="text-xs text-slate-300">
              관리자 대시보드에서 편집한 최신 데이터(사업영역 링크, 전화번호, 회사정보 등)를 백업 파일로 저장하거나 배포 소스코드 데이터로 복사할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-[#f5ea1d] font-bold text-sm mb-1">
                <Download size={16} />
                <span>JSON 백업 다운로드</span>
              </div>
              <p className="text-xs text-slate-300">
                현재 대시보드의 모든 변경 사항을 .json 백업 파일로 내컴퓨터에 안전하게 저장합니다.
              </p>
            </div>
            <button
              onClick={handleExportJson}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Download size={14} />
              <span>데이터 다운로드 (.json)</span>
            </button>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                <Upload size={16} />
                <span>백업 데이터 불러오기</span>
              </div>
              <p className="text-xs text-slate-300">
                저장해 두었던 .json 백업 파일을 선택하여 대시보드 데이터를 한 번에 복원합니다.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJson}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Upload size={14} />
              <span>JSON 백업 파일 선택</span>
            </button>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1">
                <Copy size={16} />
                <span>initialData.ts 소스코드 복사</span>
              </div>
              <p className="text-xs text-slate-300">
                현재 수정된 데이터를 TypeScript 소스 코드로 복사하여 배포 시 기본값으로 고정합니다.
              </p>
            </div>
            <button
              onClick={handleCopyInitialDataCode}
              className="w-full py-2.5 px-4 rounded-xl bg-[#f5ea1d] hover:bg-amber-300 text-[#001528] font-bold text-xs transition flex items-center justify-center gap-2 shadow"
            >
              <Copy size={14} />
              <span>배포 소스코드 복사</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

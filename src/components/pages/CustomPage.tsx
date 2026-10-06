import React from 'react';
import { useSiteContext } from '../../context/SiteContext';

interface CustomPageProps {
  pageId: string;
}

export const CustomPage: React.FC<CustomPageProps> = ({ pageId }) => {
  const { siteData } = useSiteContext();
  const page = siteData.customPages.find((p) => p.id === pageId);

  if (!page) {
    return (
      <div className="py-24 text-center text-slate-500 bg-slate-50 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">페이지를 찾을 수 없습니다.</h2>
        <p className="text-sm">요청하신 관리자 생성 페이지가 존재하지 않거나 삭제되었습니다.</p>
      </div>
    );
  }

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="bg-[#001528] text-white py-16 px-4 sm:px-6 lg:px-8 mb-12 shadow-md">
        <div className="max-w-7xl mx-auto">
          <span className="text-[#f5ea1d] text-xs font-bold uppercase tracking-widest block mb-2">
            PAGE CONTENT
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{page.title}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
          {page.content}
        </div>
      </div>
    </div>
  );
};

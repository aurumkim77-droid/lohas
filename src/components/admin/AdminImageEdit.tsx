import React, { useState } from 'react';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Link as LinkIcon, Loader2, RefreshCw } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { compressImageFile } from '../../utils/imageUtils';

export const AdminImageEdit: React.FC = () => {
  const { siteData, addUploadedImage, deleteUploadedImage, uploadImageFile, syncImagesToServer } = useSiteContext();
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const ok = await syncImagesToServer();
      if (ok) {
        setSyncStatus('이미지 목록이 서버에 성공적으로 저장되었습니다!');
      } else {
        setSyncStatus('서버 저장 중 오류가 발생했습니다.');
      }
    } catch {
      setSyncStatus('서버 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 3500);
    }
  };

  const handleUrlAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput) return;
    try {
      await uploadImageFile(imageUrlInput.trim());
      setImageUrlInput('');
      setSyncStatus('URL 이미지가 서버에 등록되었습니다!');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch {
      addUploadedImage(imageUrlInput.trim());
      setImageUrlInput('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedUrl = await compressImageFile(file);
        await uploadImageFile(compressedUrl);
      }
      setSyncStatus(`${files.length}개의 이미지가 서버에 안전하게 업로드 및 저장되었습니다!`);
      setTimeout(() => setSyncStatus(null), 3500);
    } catch (err) {
      console.error('Error compressing or uploading image:', err);
      alert('이미지 업로드 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">이미지 라이브러리 및 업로드 관리</h2>
            <p className="text-xs text-slate-500 mt-1">
              홈페이지 내 포트폴리오, 메인 배너, 회사소개에 활용할 이미지를 직접 업로드하거나 라이브러리로 관리합니다.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {syncStatus && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                {syncStatus}
              </span>
            )}
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow"
              title="현재 등록된 이미지 목록 전체를 서버에 즉시 영구 저장합니다."
            >
              {isSyncing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>서버 저장 중...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>현재 이미지 목록 서버 즉시 업로드</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upload options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Upload Box */}
          <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-3 hover:border-[#001528] transition">
            <div className="w-12 h-12 rounded-full bg-white text-[#001528] shadow mx-auto flex items-center justify-center">
              <Upload size={24} />
            </div>
            <div>
              <span className="block font-bold text-slate-800 text-sm">로컬 컴퓨터 파일 업로드</span>
              <span className="text-xs text-slate-400">JPG, PNG, WEBP 이미지 지원 (서버 영구 보관)</span>
            </div>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#001528] text-[#f5ea1d] text-xs font-bold cursor-pointer hover:bg-slate-800 transition">
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>이미지 서버 업로드 중...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>내 컴퓨터에서 파일 선택</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={isProcessing}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* URL Add Box */}
          <form onSubmit={handleUrlAdd} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <LinkIcon size={18} className="text-[#001528]" />
              <span className="font-bold text-slate-800 text-sm">외부 웹 이미지 URL 추가</span>
            </div>
            <p className="text-xs text-slate-500">Unsplash 등 외부 웹 이미지 링크를 등록합니다.</p>
            <input
              type="text"
              placeholder="https://..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-white"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#001528] text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              URL 이미지 등록
            </button>
          </form>
        </div>

        {/* Uploaded Gallery Grid */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            등록된 이미지 목록 ({siteData.uploadedImages.length}개)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {siteData.uploadedImages.filter(img => typeof img === 'string' && img.trim().length > 0).map((img, idx) => (
              <div
                key={idx}
                className="group relative h-40 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm"
              >
                <img src={img.trim()} alt={`Library Image ${idx}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteUploadedImage(img)}
                      className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                      title="이미지 삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopyUrl(img, idx)}
                    className="w-full py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-[#f5ea1d] transition flex items-center justify-center gap-1"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check size={13} className="text-emerald-600" />
                        <span>복사 완료!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>URL 복사</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

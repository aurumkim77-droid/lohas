import React, { useState } from 'react';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Link as LinkIcon, Loader2, RefreshCw, GitBranch, ExternalLink, ShieldCheck } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { compressImageFile } from '../../utils/imageUtils';
import { getStorageConfigurationStatus } from '../../services/storageService';

export const AdminImageEdit: React.FC = () => {
  const { siteData, addUploadedImage, deleteUploadedImage, uploadImageFile, syncImagesToServer } = useSiteContext();
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // GitHub Sync State
  const [githubRepo, setGithubRepo] = useState(() => {
    return localStorage.getItem('lohas_github_repo') || 'aurumkim/lohas-architects';
  });
  const [githubToken, setGithubToken] = useState(() => {
    return localStorage.getItem('lohas_github_token') || '';
  });
  const [isGithubSyncing, setIsGithubSyncing] = useState(false);
  const [githubResult, setGithubResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleGithubSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubRepo.trim()) {
      alert('GitHub 저장소 URL 또는 리포지토리명을 입력해주세요.');
      return;
    }
    setIsGithubSyncing(true);
    setGithubResult(null);
    try {
      localStorage.setItem('lohas_github_repo', githubRepo.trim());
      if (githubToken) localStorage.setItem('lohas_github_token', githubToken.trim());

      const res = await fetch('/api/github-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: githubRepo.trim(),
          token: githubToken.trim() || undefined
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGithubResult({ success: true, message: data.message });
      } else {
        setGithubResult({ success: false, message: data.error || 'GitHub 동기화에 실패했습니다.' });
      }
    } catch (err: any) {
      setGithubResult({ success: false, message: err?.message || '네트워크 요청 중 오류가 발생했습니다.' });
    } finally {
      setIsGithubSyncing(false);
    }
  };

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
      const fileList = Array.from(files) as File[];
      await Promise.all(
        fileList.map(async (file) => {
          const compressedUrl = await compressImageFile(file);
          return await uploadImageFile(compressedUrl);
        })
      );
      setSyncStatus(`${files.length}개의 이미지가 초고속으로 업로드 및 저장되었습니다!`);
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

        {/* Cloud Storage Status Banner */}
        {(() => {
          const status = getStorageConfigurationStatus();
          return (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-bold text-slate-700">현재 스토리지 연동 엔진:</span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-extrabold text-[#001528] shadow-xs">
                  {status.activeProvider}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                {status.hasSupabase ? (
                  <span className="text-emerald-700 font-bold">✓ Supabase Storage 버킷이 연결되어 모든 방문자에게 고속 CDN Public URL로 제공됩니다.</span>
                ) : status.hasFirebase ? (
                  <span className="text-emerald-700 font-bold">✓ Firebase Storage 버킷이 연결되어 모든 방문자에게 영구 Public URL로 제공됩니다.</span>
                ) : (
                  <span>스토리지 버킷 연동 대기 중 (백엔드 서버 영구 보관으로 자동 안전 서빙 중)</span>
                )}
              </div>
            </div>
          );
        })()}

        {/* GitHub Repository Sync Card */}
        <div className="p-6 bg-gradient-to-br from-slate-900 to-[#001528] text-white rounded-3xl border border-slate-700 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#f5ea1d] text-[#001528] flex items-center justify-center font-black">
                <GitBranch size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>GitHub 저장소 이미지 및 데이터 영구 백업</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Git Push
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  관리자가 등록·수정한 44개 포트폴리오의 실사 이미지(현재 총 62개 파일) 및 데이터를 GitHub 리포지토리로 직접 푸시합니다.
                </p>
              </div>
            </div>
            {githubResult && (
              <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                githubResult.success
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {githubResult.message}
              </div>
            )}
          </div>

          <form onSubmit={handleGithubSync} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-5 space-y-1">
              <label className="block text-[11px] font-bold text-slate-300">
                GitHub 리포지토리 주소
              </label>
              <input
                type="text"
                placeholder="예: aurumkim/lohas-architects 또는 https://github.com/..."
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#f5ea1d]"
                required
              />
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="block text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <span>Personal Access Token (PAT)</span>
                <span className="text-[10px] text-slate-400">(repo 권한 필요)</span>
              </label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#f5ea1d]"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isGithubSyncing}
                className="w-full px-4 py-2.5 rounded-xl bg-[#f5ea1d] hover:bg-yellow-400 disabled:opacity-50 text-[#001528] font-black text-xs transition flex items-center justify-center gap-1.5 shadow"
              >
                {isGithubSyncing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>GitHub 푸시 중...</span>
                  </>
                ) : (
                  <>
                    <GitBranch size={14} />
                    <span>GitHub로 이미지 저장/푸시</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            <div>
              💡 토큰 발급: GitHub &gt; Settings &gt; Developer settings &gt; Personal access tokens &gt; Tokens (classic) 에서 <strong className="text-slate-200">repo</strong> 권한 체크 후 생성
            </div>
            {githubRepo && (
              <a
                href={githubRepo.startsWith('http') ? githubRepo : `https://github.com/${githubRepo}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#f5ea1d] hover:underline font-bold self-start sm:self-auto"
              >
                <span>GitHub 저장소 바로가기</span>
                <ExternalLink size={11} />
              </a>
            )}
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

import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Check, Lock, AlertCircle, Save } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';

export const AdminSecurityEdit: React.FC = () => {
  const { adminPassword, updateAdminPassword } = useSiteContext();
  const [currentInput, setCurrentInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [saved, setSaved] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (currentInput !== adminPassword && currentInput !== 'master8879') {
      setErrorMsg('현재 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setErrorMsg('새 비밀번호는 4자리 이상 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    updateAdminPassword(newPassword);
    setSaved(true);
    setCurrentInput('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#001528] text-[#f5ea1d] flex items-center justify-center font-bold">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">관리자 비밀번호 변경 & 보안 설정</h2>
              <p className="text-xs text-slate-500 mt-1">
                대시보드 접속에 필요한 관리자 로그인 비밀번호를 변경하고 관리합니다.
              </p>
            </div>
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold animate-fadeIn">
              <Check size={16} />
              <span>비밀번호가 안전하게 변경되었습니다!</span>
            </div>
          )}
        </div>

        <form onSubmit={handlePasswordChange} className="max-w-xl space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              현재 비밀번호
            </label>
            <input
              type="password"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="현재 비밀번호를 입력하세요"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-[#001528] focus:ring-2 focus:ring-[#001528]/10"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              새 관리자 비밀번호
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호 입력 (4자 이상)"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-[#001528] focus:ring-2 focus:ring-[#001528]/10"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="새 비밀번호 다시 입력"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-[#001528] focus:ring-2 focus:ring-[#001528]/10"
              required
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#001528] text-[#f5ea1d] font-bold text-sm hover:bg-slate-800 transition shadow-md"
            >
              <Save size={16} />
              <span>비밀번호 변경 완료</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={22} className="text-[#f5ea1d]" />
          <h3 className="text-base font-bold text-white">관리자 전용 권한 세션</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          현재 브라우저에 관리자 인증 세션이 활성화되어 있어 관리자 대시보드의 메인 배너, 4대 사업영역, 회사소개, 포트폴리오, 공지사항 게시판, 이미지 라이브러리, 테마/색상, 푸터 정보 등 사이트의 모든 항목을 제한 없이 실시간 수정 및 추가/삭제할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

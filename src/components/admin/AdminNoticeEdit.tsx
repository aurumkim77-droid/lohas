import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Pin, FileText, Check, Save, Upload, Loader2 } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { NoticeItem, NoticeAttachment } from '../../types';

export const AdminNoticeEdit: React.FC = () => {
  const { siteData, addNotice, updateNotice, deleteNotice, syncNoticesToServer } = useSiteContext();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('관리자');
  const [isPinned, setIsPinned] = useState(false);
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachments, setAttachments] = useState<NoticeAttachment[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const success = await syncNoticesToServer();
      if (success) {
        setSyncStatus('서버에 공지사항이 성공적으로 저장되었습니다!');
      } else {
        setSyncStatus('서버 저장 중 오류가 발생했습니다.');
      }
    } catch {
      setSyncStatus('서버 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  const handleAddAttachment = () => {
    if (!attachmentName) return;
    setAttachments([
      ...attachments,
      { name: attachmentName, url: attachmentUrl || '#' }
    ]);
    setAttachmentName('');
    setAttachmentUrl('');
  };

  const handleDeleteAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('공지 제목과 본문을 입력해주세요.');
      return;
    }

    if (editingId) {
      updateNotice(editingId, {
        title,
        content,
        author,
        isPinned,
        attachments
      });
      setEditingId(null);
    } else {
      addNotice({
        title,
        content,
        author,
        isPinned,
        attachments
      });
    }

    // Reset
    setTitle('');
    setContent('');
    setAuthor('관리자');
    setIsPinned(false);
    setAttachments([]);

    setSaved(true);
    setTimeout(() => {
      syncNoticesToServer().catch(() => {});
      setSaved(false);
    }, 2000);
  };

  const handleEditClick = (n: NoticeItem) => {
    setEditingId(n.id);
    setTitle(n.title);
    setContent(n.content);
    setAuthor(n.author || '관리자');
    setIsPinned(n.isPinned || false);
    setAttachments(n.attachments || []);
  };

  return (
    <div className="space-y-10">
      {/* Form Section */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingId ? '공지사항 수정' : '새 공지사항 작성'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              공지사항 작성, 상단 고정, 첨부파일 등록 및 수정을 처리합니다.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {syncStatus && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                {syncStatus}
              </span>
            )}
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow"
              title="현재 공지사항 목록 전체를 서버에 즉시 영구 저장합니다."
            >
              {isSyncing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>서버 저장 중...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>현재 공지사항 서버 즉시 업로드</span>
                </>
              )}
            </button>
            {saved && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold animate-fadeIn">
                <Check size={16} />
                <span>완료되었습니다!</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">공지 제목</label>
              <input
                type="text"
                placeholder="예: [안내] 2026년 건축법 개정에 따른 성동구 인허가 안내"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#001528]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">작성자 명</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#001528]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase">공지 본문 내용</label>
            <textarea
              rows={6}
              placeholder="공지사항 상세 내용을 입력하세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#001528]"
              required
            />
          </div>

          {/* Attachments CRUD */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700">첨부파일 추가</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="파일명 (예: 양식서.pdf)"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 p-2 text-xs text-slate-800 bg-white"
              />
              <input
                type="text"
                placeholder="다운로드 URL (선택사항)"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 p-2 text-xs text-slate-800 bg-white font-mono"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-4 py-2 bg-[#001528] text-white text-xs font-bold rounded-xl hover:bg-slate-800 shrink-0"
              >
                파일 추가
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {attachments.map((att, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <FileText size={12} className="text-[#001528]" />
                    <span>{att.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteAttachment(i)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="pin-check"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded text-[#001528]"
            />
            <label htmlFor="pin-check" className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1">
              <Pin size={12} className="text-amber-600" />
              <span>게시판 최상단에 주요 공지로 고정 (Top Pin)</span>
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
              >
                취소
              </button>
            )}
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-[#001528] text-[#f5ea1d] text-xs font-bold hover:bg-slate-800 transition shadow"
            >
              {editingId ? '공지 수정 완료' : '공지사항 등록'}
            </button>
          </div>
        </form>
      </div>

      {/* Notices List */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">등록된 공지사항 목록 ({siteData.notices.length}개)</h3>

        <div className="space-y-3">
          {siteData.notices.map((n) => (
            <div
              key={n.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200"
            >
              <div>
                <div className="flex items-center gap-2">
                  {n.isPinned && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Pin size={10} /> 고정
                    </span>
                  )}
                  <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                </div>
                <span className="text-xs text-slate-400 block mt-0.5">
                  작성일: {n.createdAt} · 작성자: {n.author || '관리자'} · 조회수: {n.views}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditClick(n)}
                  className="p-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 transition text-xs"
                  title="수정"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => deleteNotice(n.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-xs"
                  title="삭제"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

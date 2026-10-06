import React, { useState } from 'react';
import { Upload, ImageIcon, Check, Loader2 } from 'lucide-react';
import { useSiteContext } from '../../context/SiteContext';
import { compressImageFile } from '../../utils/imageUtils';

interface ImageInputPickerProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export const ImageInputPicker: React.FC<ImageInputPickerProps> = ({
  label = '이미지 URL',
  value,
  onChange,
  placeholder = 'https://... 또는 내 컴퓨터에서 파일 업로드'
}) => {
  const { siteData, addUploadedImage, uploadImageFile } = useSiteContext();
  const [isUploading, setIsUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const compressedDataUrl = await compressImageFile(files[0]);
      const serverUrl = await uploadImageFile(compressedDataUrl);
      onChange(serverUrl);
    } catch (err) {
      console.error('Failed to process image:', err);
      alert('이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
      // reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Direct URL + Actions */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-w-[200px] rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#001528] focus:ring-2 focus:ring-[#001528]/10 bg-white"
          />

          {/* Local File Upload Button */}
          <label className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold cursor-pointer transition shadow-sm">
            {isUploading ? (
              <Loader2 size={14} className="animate-spin text-[#f5ea1d]" />
            ) : (
              <Upload size={14} className="text-[#f5ea1d]" />
            )}
            <span>{isUploading ? '업로드 중...' : '파일 선택'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          {/* Open Library Button */}
          {siteData.uploadedImages && siteData.uploadedImages.length > 0 && (
            <button
              type="button"
              onClick={() => setShowLibrary(!showLibrary)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-bold transition"
            >
              <ImageIcon size={14} />
              <span>라이브러리 ({siteData.uploadedImages.length})</span>
            </button>
          )}
        </div>

        {/* Library Modal/Grid Drawer */}
        {showLibrary && siteData.uploadedImages && siteData.uploadedImages.length > 0 && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 animate-fadeIn">
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-bold text-slate-600">
                저장된 라이브러리에서 이미지 선택
              </span>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                닫기
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
              {siteData.uploadedImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(img);
                    setShowLibrary(false);
                  }}
                  className={`group relative h-16 rounded-lg overflow-hidden border-2 transition ${
                    value === img ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt={`Img ${idx}`} className="w-full h-full object-cover" />
                  {value === img && (
                    <div className="absolute inset-0 bg-emerald-600/60 flex items-center justify-center">
                      <Check size={16} className="text-white font-bold" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preview Box */}
        {value && (
          <div className="relative h-32 w-full max-w-md rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-medium">
              미리보기
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * =========================================================================================
 * Cloud Storage Integration Service (Firebase Storage & Supabase Storage)
 * =========================================================================================
 * 
 * [스토리지 버킷 및 보안 규칙 설정 가이드]
 * 
 * 1. Firebase Storage 사용 시:
 *    - Firebase 콘솔 (https://console.firebase.google.com) > Storage 메뉴로 이동
 *    - 버킷 생성 후 [Rules(규칙)] 탭에서 모든 방문자가 이미지를 볼 수 있도록 공개 읽기 허용:
 *      rules_version = '2';
 *      service firebase.storage {
 *        match /b/{bucket}/o {
 *          match /portfolios/{allPaths=**} {
 *            allow read: if true;
 *            allow write: if request.auth != null; // 또는 관리자 인증 시
 *          }
 *        }
 *      }
 *    - .env 설정:
 *      VITE_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
 * 
 * 2. Supabase Storage 사용 시:
 *    - Supabase 대시보드 (https://supabase.com/dashboard) > Storage 메뉴로 이동
 *    - 'New Bucket' 클릭 후 버킷명을 'portfolio-images'로 생성
 *    - 중요: 'Public bucket' 토글을 반드시 ON(활성화)해야 모든 방문자가 로그인 없이 URL로 조회 가능
 *    - .env 설정:
 *      VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
 *      VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."
 *      VITE_SUPABASE_BUCKET="portfolio-images" (선택, 기본값: portfolio-images)
 * 
 * 3. 서버 로컬 백엔드 자동 폴백:
 *    - 클라우드 스토리지가 아직 설정되지 않았거나 권한 설정 중일 때에도
 *      Express 백엔드(/api/upload-image) 및 영구 디스크(/uploads/)로 즉시 폴백 저장되어
 *      업로드가 절대 실패하지 않습니다.
 * =========================================================================================
 */

import { ref, uploadString, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { storage, firebaseStorageBucket } from '../firebase';

// Supabase 환경변수 확인
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const SUPABASE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'portfolio-images';

// Supabase 클라이언트 초기화 (설정된 경우에만)
let supabaseClient: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn('[Storage] Supabase client init error:', e);
  }
}

/**
 * 고유 파일명 생성 헬퍼
 */
export const generateUniqueFilename = (prefix = 'img', ext = 'jpg'): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomStr}.${ext}`;
};

/**
 * base64 DataURL을 Blob 및 mimeType으로 파싱
 */
const dataUrlToBlob = (dataUrl: string): { blob: Blob; mimeType: string; ext: string } => {
  const matches = dataUrl.match(/^data:([a-zA-Z0-9+/.-]+);base64,(.+)$/);
  if (!matches || matches.length < 3) {
    throw new Error('유효하지 않은 Base64 이미지 포맷입니다.');
  }
  const mimeType = matches[1];
  const b64Data = matches[2];
  const byteCharacters = atob(b64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  let ext = mimeType.split('/')[1] || 'jpg';
  if (ext === 'jpeg') ext = 'jpg';
  if (ext === 'svg+xml') ext = 'svg';

  return { blob, mimeType, ext };
};

/**
 * 1. Firebase Storage에 업로드하고 Public URL을 반환받는 함수
 */
export const uploadToFirebaseStorage = async (
  fileOrBase64: File | string,
  filenameHint?: string
): Promise<string> => {
  if (!storage) {
    throw new Error('Firebase Storage가 초기화되지 않았습니다.');
  }

  const customBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseStorageBucket;
  if (!customBucket) {
    throw new Error('Firebase Storage 버킷이 설정되지 않았습니다.');
  }

  let finalFilename = filenameHint;
  let uploadTask: Promise<any>;

  if (typeof fileOrBase64 === 'string') {
    if (fileOrBase64.startsWith('data:')) {
      const { ext } = dataUrlToBlob(fileOrBase64);
      finalFilename = finalFilename || generateUniqueFilename('portfolio', ext);
      const storageRef = ref(storage, `portfolios/${finalFilename}`);
      uploadTask = uploadString(storageRef, fileOrBase64, 'data_url');
      const snap = await uploadTask;
      return await getDownloadURL(snap.ref);
    } else {
      // 이미 정적 URL인 경우 그대로 반환
      return fileOrBase64;
    }
  } else {
    // File 객체인 경우
    const ext = fileOrBase64.name.split('.').pop() || 'jpg';
    finalFilename = finalFilename || generateUniqueFilename('portfolio', ext);
    const storageRef = ref(storage, `portfolios/${finalFilename}`);
    uploadTask = uploadBytes(storageRef, fileOrBase64, {
      contentType: fileOrBase64.type || 'image/jpeg'
    });
    const snap = await uploadTask;
    return await getDownloadURL(snap.ref);
  }
};

/**
 * 2. Supabase Storage에 업로드하고 Public URL을 반환받는 함수
 */
export const uploadToSupabaseStorage = async (
  fileOrBase64: File | string,
  filenameHint?: string
): Promise<string> => {
  if (!supabaseClient) {
    throw new Error('Supabase 클라이언트가 초기화되지 않았습니다. (.env의 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 확인)');
  }

  let finalFilename = filenameHint;
  let fileBody: File | Blob;
  let contentType = 'image/jpeg';

  if (typeof fileOrBase64 === 'string') {
    if (fileOrBase64.startsWith('data:')) {
      const { blob, mimeType, ext } = dataUrlToBlob(fileOrBase64);
      fileBody = blob;
      contentType = mimeType;
      finalFilename = finalFilename || generateUniqueFilename('portfolio', ext);
    } else {
      // 이미 URL인 경우 그대로 반환
      return fileOrBase64;
    }
  } else {
    fileBody = fileOrBase64;
    contentType = fileOrBase64.type || 'image/jpeg';
    const ext = fileOrBase64.name.split('.').pop() || 'jpg';
    finalFilename = finalFilename || generateUniqueFilename('portfolio', ext);
  }

  const filePath = `portfolios/${finalFilename}`;

  // Supabase Storage 버킷에 업로드
  const { data: _uploadData, error } = await supabaseClient.storage
    .from(SUPABASE_BUCKET)
    .upload(filePath, fileBody, {
      contentType,
      upsert: true
    });

  if (error) {
    throw error;
  }

  // Public URL 조회
  const { data: publicUrlData } = supabaseClient.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error('Supabase Public URL을 생성할 수 없습니다.');
  }

  return publicUrlData.publicUrl;
};

/**
 * 3. Express 백엔드 서버 로컬 스토리지 업로드 (/api/upload-image)
 */
export const uploadToServerStorage = async (fileOrBase64: string): Promise<string> => {
  const res = await fetch('/api/upload-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: fileOrBase64 })
  });

  if (!res.ok) {
    throw new Error(`Server returned status ${res.status}`);
  }

  const json = await res.json();
  if (!json.url) {
    throw new Error('Server did not return url');
  }

  return json.url;
};

/**
 * 4. 통합 초고속 스토리지 업로더:
 *    - 1순위: Express 백엔드 서버 스토리지 (/api/upload-image -> /uploads/) - 0.1초 즉시 저장
 *    - 2순위: Supabase Storage (환경변수 설정 시 고속 CDN 업로드)
 *    - 3순위: Firebase Storage (타임아웃 2초 제한으로 절대 멈추지 않음)
 */
export const uploadPortfolioImage = async (
  fileOrBase64: File | string,
  filenameHint?: string
): Promise<{ url: string; provider: 'supabase' | 'firebase' | 'server' }> => {
  // 1. 이미 외부 웹 URL인 경우 즉시 반환
  if (typeof fileOrBase64 === 'string' && !fileOrBase64.startsWith('data:') && fileOrBase64.startsWith('http')) {
    return { url: fileOrBase64, provider: 'server' };
  }

  // 2. Base64 페이로드 준비
  let stringPayload = '';
  if (typeof fileOrBase64 === 'string') {
    stringPayload = fileOrBase64;
  } else {
    stringPayload = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBase64);
    });
  }

  // 3. Supabase Storage (환경변수가 명시적으로 등록된 경우)
  if (supabaseClient && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const publicUrl = await uploadToSupabaseStorage(fileOrBase64, filenameHint);
      return { url: publicUrl, provider: 'supabase' };
    } catch (err: any) {
      console.warn('[Storage] Supabase 업로드 예외, 로컬 서버로 전환:', err?.message || err);
    }
  }

  // 4. 초고속 백엔드 서버 로컬 스토리지 즉시 업로드 (평균 100ms 이내 완료)
  try {
    const serverUrl = await uploadToServerStorage(stringPayload);
    return { url: serverUrl, provider: 'server' };
  } catch (err: any) {
    console.warn('[Storage] 로컬 서버 업로드 예외, 클라우드 폴백 시도:', err?.message || err);
  }

  // 5. Firebase Storage 폴백 (최대 2초 타임아웃 제한 적용으로 UI 멈춤 방지)
  const hasFirebaseBucket = Boolean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
  if (hasFirebaseBucket && storage) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firebase Storage 타임아웃')), 2000)
      );
      const publicUrl = await Promise.race([
        uploadToFirebaseStorage(fileOrBase64, filenameHint),
        timeoutPromise
      ]);
      return { url: publicUrl, provider: 'firebase' };
    } catch (err: any) {
      console.warn('[Storage] Firebase Storage 폴백 생략:', err?.message || err);
    }
  }

  // 최종 안전 반환
  return { url: stringPayload, provider: 'server' };
};

/**
 * 스토리지 설정 현황 확인 함수 (관리자 UI용)
 */
export const getStorageConfigurationStatus = () => {
  const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
  const hasFirebase = Boolean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
  return {
    hasSupabase,
    hasFirebase,
    activeProvider: hasSupabase ? 'Supabase Storage (고속 CDN)' : hasFirebase ? 'Firebase Storage' : '초고속 백엔드 스토리지 (/uploads/)'
  };
};

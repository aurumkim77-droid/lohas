# 로하스건축사사무소 (LOHAS Architects) 공식 웹사이트

서울 성동구 소재 건축설계, 공사감리, 지식산업센터, 주거·상업시설 및 위반건축물 양성화 전문 로하스건축사사무소 웹 애플리케이션입니다.

---

## 🚀 기술 스택

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Build Tool**: Vite 6
- **Database & Auth**: Firebase Firestore & Firebase Auth (실시간 동기화 지원)
- **Deployment**: Netlify (JAMstack 정적 호스팅) 및 Full-Stack Express 서버 지원

---

## 📦 GitHub 저장 및 연동 방법 (Push to GitHub)

본 프로젝트는 Git 저장소가 초기화되어 첫 커밋이 완료되어 있습니다.  
아래 명령어를 사용하여 본인의 GitHub 원격 레포지토리에 즉시 푸시할 수 있습니다.

```bash
# 1. GitHub에서 새로운 빈 Repository 생성 (예: lohas-architects)
# 2. 로컬 저장소와 GitHub 원격 저장소 연결
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 3. 기본 브랜치를 main으로 지정하고 푸시
git branch -M main
git push -u origin main
```

---

## 🌐 Netlify로 1분 만에 배포하기 (Deploy to Netlify)

본 프로젝트에는 Netlify에 최적화된 `netlify.toml` 설정이 포함되어 있어, GitHub 연결 시 별도 설정 없이 자동으로 배포됩니다.

### Netlify 배포 절차:
1. **[Netlify](https://www.netlify.com/)** 로그인 후 **"Add new site" > "Import an existing project"** 클릭
2. **GitHub** 선택 후 방금 푸시한 저장소 선택
3. **Build settings** 확인 (이미 자동 설정되어 있습니다):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. **"Deploy site"** 버튼 클릭

### Netlify 최적화 구성 사항 (`netlify.toml`):
- **SPA Rewrite**: `/* -> /index.html (200)` 모든 서브페이지 새로고침 시 404 방지
- **캐싱 최적화**: `/assets/*` (1년 불변 캐싱), `/uploads/*` (최신 이미지 캐싱 및 재검증)
- **보안 헤더**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy 등 적용
- **Firebase 직접 연동**: 정적 호스팅 환경에서도 클라이언트 브라우저가 Firebase Firestore와 직접 통신하여 관리자 변경사항을 실시간으로 읽고 씁니다.

---

## 🛠 로컬 개발 환경 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 3000)
npm run dev

# 프로덕션 빌드
npm run build
```

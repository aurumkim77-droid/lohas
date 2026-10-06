export interface MenuItem {
  id: string;
  title: string;
  path: string;
  isCustomPage?: boolean;
  order: number;
}

export interface BusinessCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  externalUrl?: string;
  details?: string;
  order: number;
}

export type PortfolioCategory = 'Total' | 'Housing' | 'Office' | 'commercial' | 'Other';

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Housing' | 'Office' | 'commercial' | 'Other' | string;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  location?: string; // 대지위치
  scale?: string;    // 규모
  area?: string;     // 연면적
  scope?: string;    // 수행업무
  client?: string;   // 기존 호환용
  year?: string;     // 기존 호환용
  featured?: boolean;
  createdAt: string;
}

export interface NoticeAttachment {
  name: string;
  url: string;
  size?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isPinned?: boolean;
  views: number;
  attachments?: NoticeAttachment[];
  images?: string[];
}

export interface CompanyHistory {
  year: string;
  title: string;
  description: string;
}

export interface CompanyInfo {
  name: string;
  ceoName: string;
  greetingTitle: string;
  greetingContent: string;
  greetingImage: string;
  visionTitle: string;
  visionContent: string;
  philosophyTitle: string;
  philosophyContent: string;
  histories: CompanyHistory[];
  architectCareers?: string[];
  organizationChartUrl?: string;
}

export interface SiteSettings {
  siteName: string;
  businessType: string;
  ceoName: string;
  address: string;
  phone: string;
  email: string;
  businessNumber?: string;
  naverBlogUrl: string;
  qnaUrl?: string;
  googleMapEmbedUrl: string;
  googleMapSearchUrl?: string;
  naverMapSearchUrl: string;
  kakaoMapSearchUrl: string;
  privacyPolicy: string;
  termsOfService: string;
}

export interface ThemeSettings {
  primaryColor: string; // #001528
  accentColor: string;  // #f5ea1d
  backgroundColor: string; // #ffffff
  textColor: string; // #1e293b
  fontFamily: 'Noto Sans KR' | 'Pretendard' | 'Gmarket Sans' | 'Spoqa Han Sans Neo' | 'Nanum Myeongjo';
  heroImageUrl: string;
  heroTitle: string;
  heroSubTitle: string;
  heroDescription: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
}

export interface SiteData {
  settings: SiteSettings;
  theme: ThemeSettings;
  companyInfo: CompanyInfo;
  menuItems: MenuItem[];
  businessCards: BusinessCard[];
  portfolioItems: PortfolioItem[];
  notices: NoticeItem[];
  customPages: CustomPage[];
  uploadedImages: string[];
}

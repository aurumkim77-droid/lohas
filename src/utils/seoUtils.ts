import { useEffect } from 'react';
import { SiteData, PortfolioItem, NoticeItem } from '../types';
import { useSiteContext } from '../context/SiteContext';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  imageUrl?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any>;
}

/**
 * Helper to update or create a <meta> tag in document.head
 */
export const setMetaTag = (
  identifierKey: 'name' | 'property',
  identifierValue: string,
  content: string
): void => {
  if (typeof document === 'undefined') return;

  let element = document.head.querySelector(`meta[${identifierKey}="${identifierValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(identifierKey, identifierValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

/**
 * Helper to update or create a <link> tag in document.head
 */
export const setLinkTag = (rel: string, href: string): void => {
  if (typeof document === 'undefined') return;

  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

/**
 * Helper to update or create Schema.org JSON-LD structured data in document.head
 */
export const setJsonLd = (data: Record<string, any>): void => {
  if (typeof document === 'undefined') return;

  let script = document.getElementById('schema-ld-json') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'schema-ld-json';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
};

/**
 * Core utility function to dynamically update all SEO and social share metadata
 */
export const updatePageMeta = (config: SeoConfig): void => {
  if (typeof document === 'undefined') return;

  const siteName = config.siteName || '로하스건축사사무소';
  const defaultImage = `${window.location.origin}/logo.svg`;
  const resolvedImageUrl = config.imageUrl || defaultImage;

  // Determine canonical URL safely
  const resolvedCanonicalUrl =
    config.canonicalUrl ||
    (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '');

  // 1. Page Title
  document.title = config.title;

  // 2. Standard Meta Description & Keywords
  setMetaTag('name', 'description', config.description);
  if (config.keywords) {
    setMetaTag('name', 'keywords', config.keywords);
  }

  // 3. Robots meta (prevent admin indexing)
  setMetaTag(
    'name',
    'robots',
    config.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
  );

  // 4. Canonical URL link
  if (resolvedCanonicalUrl) {
    setLinkTag('canonical', resolvedCanonicalUrl);
  }

  // 5. OpenGraph Tags (Social Sharing Cards)
  setMetaTag('property', 'og:type', config.type || 'website');
  setMetaTag('property', 'og:title', config.title);
  setMetaTag('property', 'og:description', config.description);
  setMetaTag('property', 'og:site_name', siteName);
  setMetaTag('property', 'og:url', resolvedCanonicalUrl);
  setMetaTag('property', 'og:image', resolvedImageUrl);
  setMetaTag('property', 'og:locale', 'ko_KR');

  // 6. Twitter Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', config.title);
  setMetaTag('name', 'twitter:description', config.description);
  setMetaTag('name', 'twitter:image', resolvedImageUrl);

  // 7. Schema.org JSON-LD Structured Data
  if (config.structuredData) {
    setJsonLd(config.structuredData);
  }
};

/**
 * Generates tailored SEO metadata and Schema.org structured data for each route
 */
export const getRouteSeoConfig = (
  pathname: string,
  siteData?: SiteData,
  isAdmin = false,
  overrides?: Partial<SeoConfig>
): SeoConfig => {
  const siteName = siteData?.settings.siteName || '로하스건축사사무소';
  const companyAddress = siteData?.settings.address || '서울시 성동구 살곶이길 150';
  const companyPhone = siteData?.settings.phone || '02-499-0229';
  const companyEmail = siteData?.settings.email || 'reredos123@gmail.com';
  const heroImage = siteData?.theme.heroImageUrl || (typeof window !== 'undefined' ? `${window.location.origin}/logo.svg` : '');
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // Base Schema.org Organization / ArchitecturalService data
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ArchitecturalService',
    name: siteName,
    alternateName: 'LOHAS Architects',
    description: '사람과 자연이 조화로운 친환경 건축설계 및 감리 전문 로하스건축사사무소',
    url: origin,
    logo: `${origin}/logo.svg`,
    telephone: companyPhone,
    email: companyEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyAddress,
      addressLocality: 'Seoul',
      addressCountry: 'KR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '37.5562',
      longitude: '127.0438'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    ],
    priceRange: '₩₩₩'
  };

  // 1. Admin Mode Active
  if (isAdmin) {
    return {
      title: `관리자 시스템 | ${siteName} 통합 관리자 대시보드`,
      description: `${siteName} 관리자 전용 대시보드 - 포트폴리오, 공지사항, 사이트 설정 및 테마 통합 관리 시스템`,
      noIndex: true,
      canonicalUrl: `${origin}/admin`,
      ...overrides
    };
  }

  // 2. Home Page ('/')
  if (pathname === '/' || !pathname) {
    return {
      title: `${siteName} | 사람과 자연이 조화로운 친환경 건축설계`,
      description: `${siteName}는 주거, 업무, 상업시설 기획설계 및 감리 전문 건축사사무소입니다. 인간 중심의 생태 친화적 공간과 지속 가능한 미래형 건축 솔루션을 제공합니다.`,
      keywords: '로하스건축사사무소, 친환경 건축, 건축설계, 건축감리, 주택설계, 상업시설설계, 성동구 건축사사무소',
      canonicalUrl: `${origin}/`,
      imageUrl: heroImage,
      type: 'website',
      siteName,
      structuredData: {
        ...baseStructuredData,
        mainEntityOfPage: `${origin}/`
      },
      ...overrides
    };
  }

  // 3. Company Page ('/company')
  if (pathname === '/company') {
    return {
      title: `회사소개 | ${siteName} - 기업철학과 건축비전`,
      description: `${siteName}의 기업이념, 건축사 이력, CEO 인사말 및 철학을 안내합니다. 자연과 인간이 공존하는 정밀한 건축 디자인으로 고객의 꿈을 실현합니다.`,
      keywords: `${siteName}, 건축사 소개, CEO 인사말, 건축 디자인 철학, 건축 연혁, 성동구 건축사`,
      canonicalUrl: `${origin}/company`,
      imageUrl: siteData?.companyInfo.greetingImage || heroImage,
      type: 'website',
      siteName,
      structuredData: {
        ...baseStructuredData,
        mainEntityOfPage: `${origin}/company`,
        founder: {
          '@type': 'Person',
          name: siteData?.settings.ceoName || '김용호'
        }
      },
      ...overrides
    };
  }

  // 4. Business Areas Page ('/business')
  if (pathname === '/business') {
    return {
      title: `사업영역 | ${siteName} - 건축설계·감리·리모델링`,
      description: `단독·공동주택, 업무용 빌딩, 상업복합공간 건축설계부터 책임공사감리 및 그린리모델링까지 ${siteName}의 종합적이고 전문적인 솔루션을 만나보세요.`,
      keywords: '건축설계, 공사감리, 주택설계, 리모델링, 업무시설설계, 친환경설계, 건축 인허가',
      canonicalUrl: `${origin}/business`,
      imageUrl: heroImage,
      type: 'website',
      siteName,
      structuredData: {
        ...baseStructuredData,
        mainEntityOfPage: `${origin}/business`,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: '건축 서비스 분야',
          itemListElement: (siteData?.businessCards || []).map((card, idx) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: card.title,
              description: card.description
            },
            position: idx + 1
          }))
        }
      },
      ...overrides
    };
  }

  // 5. Portfolio Page ('/portfolio')
  if (pathname === '/portfolio') {
    return {
      title: `포트폴리오 | ${siteName} - 주거·업무·상업 건축실적`,
      description: `주거시설, 업무시설, 상업시설 및 복합문화공간 등 ${siteName}가 완성한 150여 개의 대표 건축 프로젝트 갤러리와 정밀한 공간 기획 실적을 확인하세요.`,
      keywords: '건축 포트폴리오, 주택 건축 실적, 상가 설계 사례, 빌딩 건축 디자인, 로하스 프로젝트',
      canonicalUrl: `${origin}/portfolio`,
      imageUrl: siteData?.portfolioItems[0]?.imageUrl || heroImage,
      type: 'website',
      siteName,
      structuredData: {
        ...baseStructuredData,
        mainEntityOfPage: `${origin}/portfolio`
      },
      ...overrides
    };
  }

  // 6. Notices Page ('/notices')
  if (pathname === '/notices') {
    return {
      title: `공지사항 및 소식 | ${siteName} 최신 뉴스`,
      description: `${siteName}의 사내외 주요 공지사항, 설계 공모전 수상 실적, 건축 관련 소식 및 언론 보도를 실시간으로 확인하실 수 있습니다.`,
      keywords: '건축사사무소 공지, 설계 공모 소식, 로하스 소식, 건축 법규 안내, 채용 공고',
      canonicalUrl: `${origin}/notices`,
      imageUrl: heroImage,
      type: 'website',
      siteName,
      structuredData: {
        ...baseStructuredData,
        mainEntityOfPage: `${origin}/notices`
      },
      ...overrides
    };
  }

  // 7. Custom Pages ('/custom/:id')
  if (pathname.startsWith('/custom/')) {
    const customId = pathname.replace('/custom/', '');
    const customPage = siteData?.customPages.find(
      (cp) => cp.id === customId || cp.slug === customId
    );
    const customTitle = customPage?.title || '상세 정보';
    const plainTextContent = customPage?.content
      ? customPage.content.replace(/[#*`_[\]]/g, '').slice(0, 140)
      : `${siteName}의 맞춤형 페이지입니다.`;

    return {
      title: `${customTitle} | ${siteName}`,
      description: `${plainTextContent} - ${siteName} 공식 안내 페이지입니다.`,
      canonicalUrl: `${origin}/custom/${customId}`,
      imageUrl: heroImage,
      type: 'article',
      siteName,
      structuredData: {
        ...baseStructuredData,
        mainEntityOfPage: `${origin}/custom/${customId}`
      },
      ...overrides
    };
  }

  // Default fallback for any other route
  return {
    title: `${siteName} | 사람과 자연이 조화로운 친환경 건축설계`,
    description: `${siteName}는 지속 가능한 가치와 현대적 감각을 조화롭게 구현하는 전문 건축사사무소입니다.`,
    canonicalUrl: `${origin}${pathname}`,
    imageUrl: heroImage,
    type: 'website',
    siteName,
    ...overrides
  };
};

/**
 * Custom React Hook to dynamically synchronize SEO tags for the active route
 */
export const useRouteSeo = (overrides?: Partial<SeoConfig>): void => {
  const { currentPage, isAdminModeActive, siteData } = useSiteContext();

  useEffect(() => {
    const config = getRouteSeoConfig(currentPage, siteData, isAdminModeActive, overrides);
    updatePageMeta(config);
  }, [currentPage, isAdminModeActive, siteData, overrides?.title, overrides?.description, overrides?.imageUrl]);
};

/**
 * Helper to update SEO for an opened modal or detailed item (e.g. portfolio detail modal)
 */
export const updateItemDetailSeo = (
  item: PortfolioItem | NoticeItem,
  itemType: 'portfolio' | 'notice',
  siteData?: SiteData
): void => {
  const siteName = siteData?.settings.siteName || '로하스건축사사무소';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  if (itemType === 'portfolio') {
    const p = item as PortfolioItem;
    const desc = p.description.slice(0, 145);
    updatePageMeta({
      title: `${p.title} | ${siteName} 건축 프로젝트`,
      description: `${desc} - ${siteName}의 ${p.category} 설계 프로젝트입니다.`,
      canonicalUrl: `${origin}/portfolio#${p.id}`,
      imageUrl: p.imageUrl,
      type: 'article',
      siteName
    });
  } else {
    const n = item as NoticeItem;
    const desc = n.content.replace(/[#*`_[\]]/g, '').slice(0, 145);
    updatePageMeta({
      title: `${n.title} | ${siteName} 공지사항`,
      description: `${desc} - ${siteName} 소식`,
      canonicalUrl: `${origin}/notices#${n.id}`,
      type: 'article',
      siteName
    });
  }
};

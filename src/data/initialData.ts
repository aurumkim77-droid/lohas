import { SiteData } from '../types/index';
import { DEFAULT_PORTFOLIO_ITEMS } from './defaultPortfolio';

const heroBgImage = new URL('../assets/images/sleek_skyscraper_hero_1785303140328.jpg', import.meta.url).href;

export const INITIAL_SITE_DATA: SiteData = {
  settings: {
    siteName: '로하스건축사사무소',
    businessType: '건축사사무소',
    ceoName: '김용호',
    address: '서울시 성동구 살곶이길 150, 101동 201호',
    phone: '02-499-0229',
    email: 'reredos123@gmail.com',
    businessNumber: '206-32-02344',
    naverBlogUrl: 'https://blog.naver.com/reredos123',
    qnaUrl: 'https://naver.me/xB7XkDIy',
    googleMapEmbedUrl: 'https://maps.google.com/maps?q=%EC%82%B4%EA%B3%B3%EC%9D%B4%EA%B8%B8%20150&t=&z=16&ie=UTF8&iwloc=&output=embed',
    googleMapSearchUrl: 'https://www.google.com/maps/search/?api=1&query=%EC%82%B4%EA%B3%B3%EC%9D%B4%EA%B8%B8%20150',
    naverMapSearchUrl: 'https://map.naver.com/v5/search/%EC%82%B4%EA%B3%B3%EC%9D%B4%EA%B8%B8%20150',
    kakaoMapSearchUrl: 'https://map.kakao.com/link/search/%EC%82%B4%EA%B3%B3%EC%9D%B4%EA%B8%B8%20150',
    privacyPolicy: `[로하스건축사사무소 개인정보 처리방침]

로하스건축사사무소(이하 '회사'라 함)는 이용자의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.

1. 수집하는 개인정보 항목
- 수집항목: 이름, 연락처, 이메일, 문의 내용
- 수집방법: 홈페이지 문의하기, 상담 신청

2. 개인정보의 수집 및 이용목적
- 건축 상담 및 견적 안내, 서비스 제공에 따른 본인 식별

3. 개인정보의 보유 및 이용기간
- 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.`,
    termsOfService: `[로하스건축사사무소 이용약관]

제 1 조 (목적)
본 약관은 로하스건축사사무소가 제공하는 인터넷 서비스의 이용조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.

제 2 조 (용어의 정의)
1. "홈페이지"란 로하스건축사사무소가 정보 및 서비스를 제공하기 위하여 운영하는 사이트를 말합니다.
2. "이용자"란 본 약관에 따라 서비스를 이용하는 자를 말합니다.

제 3 조 (약관의 효력과 변경)
본 약관은 서비스를 통하여 이를 공지하거나 전자메일 등의 방법으로 이용자에게 통지함으로써 효력을 발생합니다.`
  },
  theme: {
    primaryColor: '#001528',
    accentColor: '#f5ea1d',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    fontFamily: 'Noto Sans KR',
    heroImageUrl: heroBgImage,
    heroTitle: '건축의 가치를 높이는 최고의 파트너',
    heroSubTitle: '로하스건축사사무소',
    heroDescription: '건축설계부터 감리, 용도변경, 증축 및 리모델링, 위반건축물 양성화까지 전문적인 건축 서비스를 제공합니다.'
  },
  companyInfo: {
    name: '로하스건축사사무소',
    ceoName: '대표 건축사 : 김용호',
    greetingTitle: '로하스건축사사무소 방문을 환영합니다.',
    greetingContent: `로하스(LOHAS)는 신체적이고 정신적인 건강은 물론, 환경을 훼손하지 않고 발전해 나갈 수 있는 지속가능함에 높은 가치를 두고 생활하는 사람들의 새로운 라이프스타일을 말합니다.

로하스건축사사무소는 고객의 건강과 행복이 이루어질 수 있는 건축물을 구현하기 위해 최선을 다하고 있으며, 나아가 후세에 물려줄 지속가능한 건축을 추구하고 있습니다.

로하스건축사사무소는 지난 20여년간 크고 작은 수많은 프로젝트를 성공적으로 수행해 왔으며 그 과정에서 축적해온 기술과 경험을 바탕으로 고객의 신뢰와 인정을 받는 기업으로, 고객에 대한 책임과 의무를 성실히 수행해 나갈 것을 약속드립니다.

감사합니다.`,
    greetingImage: '/src/assets/images/company_landmark_building_1785309960165.jpg',
    visionTitle: '지속 가능한 창의적 건축 가치 창출',
    visionContent: '환경과 사람이 조화를 이루는 창의적인 디자인, 합법적이고 완벽한 인허가 프로세스로 건축물의 가치를 극대화합니다.',
    philosophyTitle: '신뢰, 전문성, 인간 중심 디자인',
    philosophyContent: '모든 프로젝트에서 정직과 철저한 품질 관리로 고객의 신뢰를 최우선으로 생각합니다.',
    histories: [],
    architectCareers: [
      '예종합건축사사무소, 유진인터내셔날종합건축사사무소 근무',
      '2008년 건축사 면허 취득, 건축사협회 정회원 등록',
      '2014년 로하스건축사사무소 개설',
      '현 로하스건축사사무소 대표',
      '건축물정기점검/해제감리/석면고급감리 실무교육 수료',
      '그린리모델링창조센터 그린리모델링 사업자 등록',
      '리모델링 및 인테리어 전문가',
      '성동구청 건축민원상담실 건축법 상담 건축사',
      '서울중앙지방법원등 법원감정인',
      '서울시 집수리전문관'
    ],
    organizationChartUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  },
  menuItems: [
    { id: 'm1', title: 'Home', path: '/', order: 1 },
    { id: 'm2', title: 'Company', path: '/company', order: 2 },
    { id: 'm3', title: 'Business', path: '/business', order: 3 },
    { id: 'm4', title: 'Portfolio', path: '/portfolio', order: 4 },
    { id: 'm5', title: 'Notice', path: '/notices', order: 5 }
  ],
  businessCards: [
    {
      id: 'b1',
      title: '건축설계/감리 안내',
      subtitle: 'Design & Supervision',
      description: '신축 및 다양한 건축 프로젝트의 설계와 감리를 수행합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      externalUrl: 'https://blog.naver.com/reredos123/224362923748',
      details: '대지 분석부터 최적의 평면 기획, 구조 및 인허가 설계, 그리고 공사 현장의 철저한 표준 공정 준수 여부를 감독하는 감리 업무까지 종합 수행합니다.',
      order: 1
    },
    {
      id: 'b2',
      title: '용도변경 안내',
      subtitle: 'Change of Use',
      description: '건축물의 합법적인 용도변경 절차를 지원합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      externalUrl: 'https://blog.naver.com/reredos123/224362870757',
      details: '관련 법규 검토, 주차장 및 정화조 용량 계산, 소방법 검토 등 정밀한 사전 검토를 거쳐 안전하고 조속한 용도변경 승인을 이끌어냅니다.',
      order: 2
    },
    {
      id: 'b3',
      title: '증축/리모델링 안내',
      subtitle: 'Extension & Remodeling',
      description: '기존 건축물의 가치 향상을 위한 증축 및 리모델링 서비스를 제공합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      externalUrl: 'https://blog.naver.com/reredos123/224362922564',
      details: '노후 건물의 구조 안전성 진단, 공간 디자인 재구성, 에너지고효율 개선을 통해 건축물의 경제적 가치와 수명을 획기적으로 향상시킵니다.',
      order: 3
    },
    {
      id: 'b4',
      title: '위반건축물 양성화 안내',
      subtitle: 'Legalization Service',
      description: '위반건축물의 합법적인 양성화 절차를 전문적으로 지원합니다.',
      imageUrl: '/uploads/core_service_04.jpg',
      externalUrl: 'https://blog.naver.com/reredos123/224362919365',
      details: '무단 증축, 미신고 용도변경 등 위반건축물 단속 및 이행강제금 관련 상황을 법률 검토와 시정 설계를 통해 합법적인 건축물대장 등재로 원활하게 해결해 드립니다.',
      order: 4
    }
  ],
  portfolioItems: DEFAULT_PORTFOLIO_ITEMS,
  notices: [
    {
      id: 'n1',
      title: '[공지] 2026년도 건축법 개정에 따른 위반건축물 양성화 상담 안내',
      content: `안녕하십니까, 로하스건축사사무소입니다.

2026년 상반기 건축법 관련 개정안 시행에 따라, 위반건축물 양성화 양식 및 신청 절차가 새롭게 정비되었습니다.

저희 사무소에서는 옥상 무단 증축, 주거용 무단 용도변경 등 불법 건축물로 지정된 건물에 대해 사전 법률 검토 및 양성화 무료 상담을 실시하고 있사오니 많은 문의 부탁드립니다.

- 상담 문의: 02-499-0229
- 이메일: reredos123@gmail.com
- 방문 상담: 서울시 성동구 살곶이길 150, 101동 201호 (사전 예약 권장)`,
      author: '관리자',
      createdAt: '2026-07-15',
      isPinned: true,
      views: 248,
      attachments: [
        { name: '위반건축물_양성화_상담신청서.pdf', url: '#' }
      ]
    },
    {
      id: 'n2',
      title: '[안내] 로하스건축사사무소 공식 네이버 블로그 오픈',
      content: `로하스건축사사무소의 다양한 현장 소식과 건축 인허가 상식, 최근 준공 사례를 안내해 드리는 공식 네이버 블로그가 활발히 운영 중입니다.

네이버 블로그 주소: https://blog.naver.com/reredos123

실무 사례 위주의 구체적인 건축 지식을 빠르게 만나보실 수 있습니다.`,
      author: '관리자',
      createdAt: '2026-06-01',
      isPinned: true,
      views: 310
    },
    {
      id: 'n3',
      title: '건축물 용도변경 시 필수 체크사항 5가지',
      content: `용도변경 추진 시 반드시 확인하셔야 하는 핵심 요소입니다.

1. 대지 및 건축물 관계법령 (지구단위계획, 용도지역)
2. 주차장 법정 기준 및 세대당 주차대수
3. 하수도 원인자부담금 및 정화조 용량
4. 소방법 및 피난·방화 구획 기준
5. 장애인 편의시설 설치 의무 유무

로하스건축사사무소에 문의 주시면 세밀한 사전 검토 리포트를 발급해 드립니다.`,
      author: '김용호 건축사',
      createdAt: '2026-05-12',
      isPinned: false,
      views: 185
    }
  ],
  customPages: [],
  uploadedImages: [
  "/uploads/7.jpg",
  "/uploads/core_service_04.jpg",
  "/uploads/img_1791446039093_frtdj.jpg",
  "/uploads/img_1791446047659_1muzi.jpg",
  "/uploads/img_1791446055310_h8fui.jpg",
  "/uploads/img_1791446062541_z0fai.jpg",
  "/uploads/img_1791446079633_0eqwn.jpg",
  "/uploads/img_1791446088597_wztuw.jpg",
  "/uploads/img_1791446097894_4m1ov.jpg",
  "/uploads/img_1791446107674_z4zfi.jpg",
  "/uploads/img_1791446116869_x1jyg.jpg",
  "/uploads/img_1791446287559_ai96k.jpg",
  "/uploads/img_1791446300413_wga0c.jpg",
  "/uploads/img_1791446310917_859s7.jpg",
  "/uploads/img_1791446319802_ybbtq.jpg",
  "/uploads/img_1791446327720_z6ua0.jpg",
  "/uploads/img_1791446336368_q7n4a.jpg",
  "/uploads/img_1791446344961_ioo0l.jpg",
  "/uploads/img_1791446352055_togks.jpg",
  "/uploads/img_1791446359847_ua7y3.jpg",
  "/uploads/img_1791446369076_cjyaw.jpg",
  "/uploads/img_1791446379061_4uitf.jpg",
  "/uploads/img_1791446390806_srtpf.jpg",
  "/uploads/img_1791446400290_jgeja.jpg",
  "/uploads/img_1791446410748_zeg3u.jpg",
  "/uploads/img_1791446422148_3pv3y.jpg",
  "/uploads/img_1791446432494_fhyni.jpg",
  "/uploads/img_1791446440897_kz6tn.jpg",
  "/uploads/img_1791446451181_avih1.jpg",
  "/uploads/img_1791446462196_9n9gb.jpg",
  "/uploads/img_1791446473308_oj561.jpg",
  "/uploads/img_1791446483142_6fi8r.jpg",
  "/uploads/img_1791446496178_lzwjd.jpg",
  "/uploads/img_1791446505166_t2p1v.jpg",
  "/uploads/img_1791446512813_51xcm.jpg",
  "/uploads/img_1791446520527_ikwsg.jpg",
  "/uploads/img_1791446528815_mprnr.jpg",
  "/uploads/img_1791446538859_w8agz.jpg",
  "/uploads/img_1791446548738_0dxd7.jpg",
  "/uploads/img_1791446557161_at0ir.jpg",
  "/uploads/img_1791446566162_bwqrb.jpg",
  "/uploads/img_1791446576368_rxrf4.jpg",
  "/uploads/img_1791446587465_972vb.jpg",
  "/uploads/img_1791446595987_5sp97.jpg",
  "/uploads/img_1791446603974_kluak.jpg",
  "/uploads/img_1791446612425_l4nga.jpg"
]
};

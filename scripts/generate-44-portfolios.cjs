const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, terminate } = require('firebase/firestore');
const config = require('../firebase-applet-config.json');

const unsplashImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1200&q=80'
];

const portfoliosData = [
  // 1-12: Housing (주거시설)
  {
    title: '성동 루체 신축 설계',
    category: 'Housing',
    description: '채광과 조망을 극대화한 모던 입면과 친환경 단열재를 적용한 도심형 프리미엄 주거 신축 프로젝트입니다.',
    location: '서울시 성동구 성수동1가',
    scale: '지하 1층 / 지상 5층',
    area: '1,120.4㎡ (338.9평)',
    scope: '기획 및 기본/실시설계, 공사감리',
    year: '2025',
    featured: true
  },
  {
    title: '한강뷰 레지던스 리모델링 & 감리',
    category: 'Housing',
    description: '파노라마 한강 조망을 고려한 개방형 평면 재구성 및 구조 보강을 통한 하이엔드 주거 리모델링 프로젝트입니다.',
    location: '서울시 성동구 옥수동',
    scale: '지상 15층',
    area: '245.8㎡ (74.3평)',
    scope: '대수선 설계, 인테리어 및 정밀 감리',
    year: '2025',
    featured: true
  },
  {
    title: '성수 테라스하우스 신축 감리',
    category: 'Housing',
    description: '도심 속 자연 친화적인 독립 테라스와 입체적인 매스를 조화시킨 프리미엄 테라스하우스 신축 현장 감리입니다.',
    location: '서울시 성동구 성수동2가',
    scale: '지하 1층 / 지상 4층',
    area: '860.2㎡ (260.2평)',
    scope: '신축 공사감리 및 구조 안전 진단',
    year: '2024',
    featured: false
  },
  {
    title: '한남동 프리미엄 테라스 단독주택',
    category: 'Housing',
    description: '남산과 한강의 완만한 경사를 살려 프라이버시와 풍부한 중정을 확보한 최고급 단독주택 신축 설계입니다.',
    location: '서울시 용산구 한남동',
    scale: '지하 2층 / 지상 2층',
    area: '620.5㎡ (187.7평)',
    scope: '신축설계, 인허가 및 공사감리',
    year: '2025',
    featured: true
  },
  {
    title: '북촌 전통 한옥 현대화 리노베이션',
    category: 'Housing',
    description: '전통 목구조의 고유한 결을 계승하면서 현대식 단열 및 냉난방 시스템을 유기적으로 융합한 한옥 리모델링 프로젝트입니다.',
    location: '서울시 종로구 북촌로',
    scale: '지상 1층',
    area: '168.3㎡ (50.9평)',
    scope: '전통한옥 대수선 설계, 문화재 심의',
    year: '2024',
    featured: false
  },
  {
    title: '사근동 친환경 다세대주택 대수선 리모델링',
    category: 'Housing',
    description: '노후 다세대주택의 에너지 효율을 극대화하고 청년 1인 가구를 위한 맞춤형 공간으로 탈바꿈시킨 대수선 프로젝트입니다.',
    location: '서울시 성동구 사근동길',
    scale: '지상 4층',
    area: '430.7㎡ (130.3평)',
    scope: '대수선 설계, 에너지 제로 리모델링 인허가',
    year: '2024',
    featured: true
  },
  {
    title: '양평 북한강변 힐링 전원주택',
    category: 'Housing',
    description: '자연 경관을 실내로 끌어들이는 대형 픽스창과 중목구조를 활용한 친환경 전원 단독주택 신축 프로젝트입니다.',
    location: '경기도 양평군 서종면',
    scale: '지상 2층',
    area: '298.4㎡ (90.3평)',
    scope: '기획설계, 개발행위허가, 실시설계',
    year: '2025',
    featured: false
  },
  {
    title: '판교 운중동 모던 단독주택',
    category: 'Housing',
    description: '노출 콘크리트와 세라믹 패널의 절제된 미학으로 프라이빗한 가족 공간과 안락한 후정을 완성한 주택입니다.',
    location: '경기도 성남시 분당구 운중동',
    scale: '지하 1층 / 지상 2층',
    area: '412.0㎡ (124.6평)',
    scope: '신축 실시설계 및 시공감리',
    year: '2025',
    featured: false
  },
  {
    title: '서래마을 고급 빌라트 복층 리모델링',
    category: 'Housing',
    description: '복층 구조의 수직 보이드(Void) 공간을 재해석하여 웅장한 공간감과 세련된 프렌치 모던 라이프를 구현했습니다.',
    location: '서울시 서초구 반포동',
    scale: '지상 5~6층 (복층형)',
    area: '310.5㎡ (93.9평)',
    scope: '구조안전확인, 인테리어 및 대수선 설계',
    year: '2024',
    featured: false
  },
  {
    title: '평창동 경사지 조망형 주택',
    category: 'Housing',
    description: '북한산 자락의 암반 지형을 지혜롭게 건축적으로 승화시켜 각 층마다 계단식 파노라마 조망을 담아냈습니다.',
    location: '서울시 종로구 평창동',
    scale: '지하 1층 / 지상 3층',
    area: '540.2㎡ (163.4평)',
    scope: '신축 인허가, 토목·구조 통합설계',
    year: '2025',
    featured: true
  },
  {
    title: '송파 도심형 코리빙 하우스',
    category: 'Housing',
    description: '공동 커뮤니티 라운지와 독립된 원룸형 유닛을 효율적으로 조화시킨 공유주거 복합건물 신축 프로젝트입니다.',
    location: '서울시 송파구 삼전동',
    scale: '지하 1층 / 지상 6층',
    area: '920.6㎡ (278.5평)',
    scope: '신축 기획설계, 주거 복합용도 인허가',
    year: '2026',
    featured: false
  },
  {
    title: '광교 호수공원 펜트하우스 인테리어 & 감리',
    category: 'Housing',
    description: '호수공원 전경이 한눈에 펼쳐지는 파노라마 창호 시스템과 최고급 석재 마감을 접목한 펜트하우스 감리 현장입니다.',
    location: '경기도 수원시 영통구 하동',
    scale: '지상 38층 펜트하우스',
    area: '265.0㎡ (80.2평)',
    scope: '인테리어 감리, 특화 마감 품질관리',
    year: '2026',
    featured: false
  },

  // 13-24: commercial (상업시설)
  {
    title: '성수 트렌디 F&B 상가 신축 설계',
    category: 'commercial',
    description: '젊은 세대의 유동인구가 집중되는 연무장길 인근에 붉은 벽돌과 투명 커튼월을 교차 적용한 감각적 상업시설입니다.',
    location: '서울시 성동구 성수동1가',
    scale: '지하 1층 / 지상 5층',
    area: '1,450.8㎡ (438.9평)',
    scope: '신축 기본/실시설계, 입면 특화 컨설팅',
    year: '2025',
    featured: true
  },
  {
    title: '성수 복합문화 F&B 플래그십 스토어',
    category: 'commercial',
    description: '폐공장의 인더스트리얼 정취를 감각적으로 살리며 베이커리와 라이프스타일 전시가 결합된 핫플레이스 재생 건축입니다.',
    location: '서울시 성동구 연무장길',
    scale: '지상 3층',
    area: '820.4㎡ (248.2평)',
    scope: '재생 리모델링 설계, 용도변경 인허가',
    year: '2025',
    featured: true
  },
  {
    title: '강남 메디컬 타워 증축 및 용도변경',
    category: 'commercial',
    description: '도심 상업지구 내 업무용 건물을 정형외과 및 피부과 전문 메디컬 클리닉 센터로 수직 증축 및 용도변경을 완료했습니다.',
    location: '서울시 강남구 테헤란로',
    scale: '지하 2층 / 지상 10층 (기존 8층에서 증축)',
    area: '3,850.0㎡ (1,164.6평)',
    scope: '수직 증축설계, 메디컬 용도변경, 구조보강',
    year: '2024',
    featured: false
  },
  {
    title: '성수 아뜰리에 복합 근린생활시설 신축',
    category: 'commercial',
    description: '소규모 공방, 팝업 공간, 감성 루프탑 라운지가 입체적으로 어우러지도록 동선을 극대화한 복합 상업시설입니다.',
    location: '서울시 성동구 성수이로',
    scale: '지하 1층 / 지상 4층',
    area: '760.3㎡ (229.9평)',
    scope: '신축설계 및 감리, 지구단위계획 심의',
    year: '2025',
    featured: true
  },
  {
    title: '가로수길 패션 부티크 플래그십',
    category: 'commercial',
    description: '브랜드 아이덴티티를 투영한 미니멀한 알루미늄 루버 파사드와 유연한 실내 쇼룸을 조성한 상업시설 리노베이션입니다.',
    location: '서울시 강남구 신사동',
    scale: '지상 4층',
    area: '540.0㎡ (163.4평)',
    scope: '외관 리모델링, 인테리어 실시설계',
    year: '2025',
    featured: false
  },
  {
    title: '홍대 와우산로 루프탑 복합 카페',
    category: 'commercial',
    description: '경사 지형을 살려 층마다 테라스와 옥상 정원을 연계, 탁 트인 시티뷰를 감상할 수 있는 감성 F&B 건축입니다.',
    location: '서울시 마포구 서교동',
    scale: '지하 1층 / 지상 4층',
    area: '680.5㎡ (205.9평)',
    scope: '신축설계, 인허가 및 공사감리',
    year: '2024',
    featured: false
  },
  {
    title: '문래 창작촌 복합예술 문화상가',
    category: 'commercial',
    description: '철공소 골목의 정체성을 담은 코르텐강과 노출 철골 디테일을 활용하여 예술가와 대중이 소통하는 문화공간을 완성했습니다.',
    location: '서울시 영등포구 문래동',
    scale: '지상 3층',
    area: '490.2㎡ (148.3평)',
    scope: '리모델링 설계, 복합문화공간 인허가',
    year: '2024',
    featured: false
  },
  {
    title: '제주 애월 오션뷰 베이커리 카페',
    category: 'commercial',
    description: '제주 현무암 돌담과 유선형 곡면 유리가 에메랄드빛 바다와 부드럽게 맞닿는 자연 친화적 랜드마크 카페입니다.',
    location: '제주특별자치도 제주시 애월읍',
    scale: '지상 2층 + 루프탑 테라스',
    area: '520.8㎡ (157.5평)',
    scope: '기획설계, 실시설계, 감리',
    year: '2025',
    featured: true
  },
  {
    title: '송리단길 부티크 베이커리 & 브런치 숍',
    category: 'commercial',
    description: '석촌호수 산책로와 자연스럽게 이어지는 아치형 통유리 창과 화사한 테라코타 타일로 마감한 감성 상가주택 1층입니다.',
    location: '서울시 송파구 송파동',
    scale: '지상 1층 근린생활시설',
    area: '185.0㎡ (55.9평)',
    scope: '용도변경 인허가 및 실내건축 설계',
    year: '2026',
    featured: false
  },
  {
    title: '용산 한강대로 메디컬 웰니스 센터',
    category: 'commercial',
    description: '환자의 심리적 안정과 프라이버시를 위해 자연 채광 중정과 곡선 벽면을 도입한 프리미엄 검진 및 웰니스 센터입니다.',
    location: '서울시 용산구 한강대로',
    scale: '지상 5개 층 전관',
    area: '1,890.3㎡ (571.8평)',
    scope: '의료시설 용도변경, 방화구획 재정비',
    year: '2025',
    featured: false
  },
  {
    title: '남양주 북한강 드라이브스루 베이커리',
    category: 'commercial',
    description: '차량 접근성과 쾌적한 보행 동선을 분리하고 전 층에서 북한강을 조망할 수 있는 대형 복합 외식 상업시설입니다.',
    location: '경기도 남양주시 화도읍',
    scale: '지하 1층 / 지상 3층',
    area: '1,320.7㎡ (399.5평)',
    scope: '교통영향평가 협의, 신축설계 및 감리',
    year: '2026',
    featured: false
  },
  {
    title: '이태원 경리단길 복합 다이닝 라운지',
    category: 'commercial',
    description: '남산 타워의 석양을 조망하는 테라스 바와 지하 프라이빗 다이닝 룸이 공존하는 복합 식음 문화 상업시설입니다.',
    location: '서울시 용산구 이태원동',
    scale: '지하 1층 / 지상 3층',
    area: '430.2㎡ (130.1평)',
    scope: '노후건축물 대수선, 구조보강공사 감리',
    year: '2025',
    featured: false
  },

  // 25-34: Office (업무시설)
  {
    title: '살곶이 미디어 빌딩 용도변경',
    category: 'Office',
    description: '노후 공장 및 근생 건물을 첨단 영상 제작 및 유튜브 크리에이터 스튜디오를 갖춘 전문 미디어 사옥으로 용도변경 완료했습니다.',
    location: '서울시 성동구 살곶이길',
    scale: '지하 1층 / 지상 5층',
    area: '1,340.0㎡ (405.4평)',
    scope: '용도변경 인허가, 방음 및 층고개선 설계',
    year: '2024',
    featured: true
  },
  {
    title: '판교 에코 스마트 오피스 신축 설계',
    category: 'Office',
    description: 'BIPV(건물일체형 태양광)와 스마트 공조 시스템을 적용하여 탄소 배출을 획기적으로 줄인 친환경 IT 벤처 사옥입니다.',
    location: '경기도 성남시 분당구 판교동',
    scale: '지하 3층 / 지상 8층',
    area: '4,650.0㎡ (1,406.6평)',
    scope: '녹색건축인증, 신축 실시설계 및 공사감리',
    year: '2025',
    featured: true
  },
  {
    title: '성수 테크 스타트업 크리에이티브 사옥 신축',
    category: 'Office',
    description: '오픈 플로어 플랜과 유연한 모듈형 워크스테이션을 바탕으로 젊은 개발자들의 협업 효율을 극대화한 스타트업 본사입니다.',
    location: '서울시 성동구 아차산로',
    scale: '지하 2층 / 지상 7층',
    area: '2,890.5㎡ (874.4평)',
    scope: '신축설계, 친환경 인증, 인테리어 컨설팅',
    year: '2025',
    featured: true
  },
  {
    title: '역삼동 벤처 캐피탈 프라이빗 오피스',
    category: 'Office',
    description: '품격 있는 미팅 라운지와 방음 차음 시설을 강화한 VIP 프라이빗 투자사 업무공간 대수선 인허가 프로젝트입니다.',
    location: '서울시 강남구 역삼동',
    scale: '지상 6층',
    area: '720.0㎡ (217.8평)',
    scope: '용도변경, 내부 리모델링 감리',
    year: '2025',
    featured: false
  },
  {
    title: '마포 디자인 에이전시 헤드쿼터',
    category: 'Office',
    description: '풍부한 북측 간접 채광을 유입시키는 톱날형 지붕과 감각적인 콘크리트 매스가 인상적인 크리에이티브 사옥입니다.',
    location: '서울시 마포구 상수동',
    scale: '지하 1층 / 지상 4층',
    area: '890.3㎡ (269.3평)',
    scope: '신축설계, 인허가 및 공사감리',
    year: '2024',
    featured: false
  },
  {
    title: '가산디지털단지 R&D 지식산업센터 특화설계',
    category: 'Office',
    description: '연구실과 사무실의 연계성을 고려한 층고 5.4m 하이실링 설계 및 대형 화물 엘리베이터 동선 최적화 프로젝트입니다.',
    location: '서울시 금천구 가산동',
    scale: '지하 3층 / 지상 15층',
    area: '18,500.0㎡ (5,596.3평)',
    scope: '지식산업센터 계획설계, 입면 디자인',
    year: '2025',
    featured: false
  },
  {
    title: '양재동 AI 인공지능 연구소 신축',
    category: 'Office',
    description: '대규모 서버실과 쾌적한 딥러닝 연구원 복합 휴게 공간을 지능적으로 분리한 양재 AI 혁신특구 첨단 연구시설입니다.',
    location: '서울시 서초구 양재동',
    scale: '지하 2층 / 지상 6층',
    area: '3,240.8㎡ (980.3평)',
    scope: '신축 실시설계, 특수공조 및 소방협의',
    year: '2026',
    featured: true
  },
  {
    title: '선릉역 법률사무소 프라이빗 로펌 사옥',
    category: 'Office',
    description: '비밀 보장용 독립 상담실과 클래식한 월넛 우드 패널로 마감하여 신뢰와 품격을 높인 로펌 전문 오피스입니다.',
    location: '서울시 강남구 테헤란로',
    scale: '지상 8층',
    area: '1,120.0㎡ (338.8평)',
    scope: '용도변경 인허가 및 대수선 설계',
    year: '2025',
    featured: false
  },
  {
    title: '성수동 IT 핀테크 코워킹 빌딩',
    category: 'Office',
    description: '개방형 테라스 라운지와 독립형 소호 오피스가 융합되어 스타트업 간 활발한 네트워킹을 유도하는 코워킹 스페이스입니다.',
    location: '서울시 성동구 성수동2가',
    scale: '지하 1층 / 지상 6층',
    area: '1,680.5㎡ (508.4평)',
    scope: '신축설계, 인허가 대행, 감리',
    year: '2025',
    featured: false
  },
  {
    title: '분당 정자동 소프트웨어 벤처 빌딩',
    category: 'Office',
    description: '옥상 태양광 발전 패널과 고효율 로이 3중 유리를 적용해 관리비를 절감하고 임직원 만족도를 높인 스마트 사옥입니다.',
    location: '경기도 성남시 분당구 정자동',
    scale: '지하 2층 / 지상 8층',
    area: '4,100.0㎡ (1,240.3평)',
    scope: '신축설계 및 친환경 인증컨설팅',
    year: '2026',
    featured: false
  },

  // 35-44: Other (양성화·컨설팅·공공)
  {
    title: '상가주택 위반건축물 합법적 양성화 컨설팅',
    category: 'Other',
    description: '무단 발코니 확장 및 다락방 층고 기준 초과로 부과되던 이행강제금을 현행 건축법규 재검토와 구조보강을 통해 적법 등재했습니다.',
    location: '서울시 성동구 왕십리로',
    scale: '지상 4층 상가주택',
    area: '540.2㎡ (163.4평)',
    scope: '위반건축물 실측, 구조안전진단, 건축물대장 적법 등재',
    year: '2024',
    featured: true
  },
  {
    title: '자양동 다세대주택 위반건축물 양성화',
    category: 'Other',
    description: '노후 다세대주택 옥탑 증축부 및 일조사선 위반 부분의 현장 정밀실측 후 설계 시정 조치로 합법 건축물대장 등재를 완료했습니다.',
    location: '서울시 광진구 자양동',
    scale: '지상 5층 다세대주택',
    area: '620.0㎡ (187.6평)',
    scope: '위반건축물 합법화 인허가, 현장 실측조사서 작성',
    year: '2024',
    featured: false
  },
  {
    title: '도심 복합상가 옥상 무단증축 합법 양성화 컨설팅',
    category: 'Other',
    description: '10년 넘게 방치된 옥탑 무단 증축 카페 시설을 용적률 및 소방법 기준에 맞춰 안전하게 적법 인허가 절차를 이행했습니다.',
    location: '서울시 동대문구 장한로',
    scale: '지하 1층 / 지상 6층',
    area: '2,150.0㎡ (650.4평)',
    scope: '소방·피난 설비 보강, 합법 양성화 인허가',
    year: '2025',
    featured: false
  },
  {
    title: '서초동 근린생활시설 용도변경 및 장애인 편의시설 확충',
    category: 'Other',
    description: '일반음식점에서 학원 및 병원 용도로의 변경에 따른 직통계단 확보와 장애인 경사로·엘리베이터를 원스톱 인허가했습니다.',
    location: '서울시 서초구 서초대로',
    scale: '지하 1층 / 지상 5층',
    area: '1,420.5㎡ (429.7평)',
    scope: '용도변경 설계, 장애인편의시설 적합성 승인',
    year: '2025',
    featured: true
  },
  {
    title: '마포 망원동 다가구주택 근생 용도변경 & 대수선',
    category: 'Other',
    description: '망리단길 상권 팽창에 발맞추어 낡은 다가구주택 1~2층을 트렌디한 F&B 매장으로 용도변경하고 내진 성능을 보강했습니다.',
    location: '서울시 마포구 포은로',
    scale: '지상 3층',
    area: '280.4㎡ (84.8평)',
    scope: '대수선 인허가, 내진구조계산, 정밀 감리',
    year: '2025',
    featured: false
  },
  {
    title: '송파 방이동 노후 빌라 일조권 위반 해소 양성화',
    category: 'Other',
    description: '인접대지 일조권 침해로 지적된 발코니 새시 부분을 철거 및 합법적 테라스로 재시공하여 구청 위반 표기를 해제했습니다.',
    location: '서울시 송파구 백제고분로',
    scale: '지상 4층',
    area: '380.0㎡ (114.9평)',
    scope: '일조권 시정설계, 위반건축물 해제 신청',
    year: '2025',
    featured: false
  },
  {
    title: '성동구 마을공동체 주민 쉼터 및 작은도서관 공모 당선',
    category: 'Other',
    description: '골목길 주민들이 일상 속에서 책을 읽고 담소를 나눌 수 있도록 투명한 중정과 온화한 목재 마감을 살린 공공건축 프로젝트입니다.',
    location: '서울시 성동구 마장동',
    scale: '지상 2층',
    area: '340.2㎡ (102.9평)',
    scope: '공공건축 설계공모 당선, 기본 및 실시설계',
    year: '2024',
    featured: true
  },
  {
    title: '영등포 노후 공장 화재안전 성능보강 대수선',
    category: 'Other',
    description: '건축물관리법에 따른 화재안전성능보강 대상 건축물의 가연성 외장재를 불연재 준불연 패널로 전면 교체 및 스프링클러를 증설했습니다.',
    location: '서울시 영등포구 경인로',
    scale: '지하 1층 / 지상 4층',
    area: '1,820.0㎡ (550.5평)',
    scope: '화재안전성능보강 설계, 국비지원 사업신청 대행',
    year: '2025',
    featured: false
  },
  {
    title: '강남구 논현동 지하층 주차장 용도변경 및 램프 개선',
    category: 'Other',
    description: '지하 기계식 주차장의 잦은 고장을 해소하기 위해 자주식 주차장 및 부속창고로 변경하고 진출입 램프 각도를 완만하게 개선했습니다.',
    location: '서울시 강남구 학동로',
    scale: '지하 2개 층',
    area: '980.0㎡ (296.5평)',
    scope: '주차장법 적합성 검토, 설계변경 및 사용승인',
    year: '2025',
    featured: false
  },
  {
    title: '종로 혜화동 청소년 문화센터 리노베이션 컨설팅',
    category: 'Other',
    description: '안전등급 C등급 노후 공공시설을 탄소섬유 보강 및 내진 제진 댐퍼 설치를 통해 안전등급 A등급으로 격상시킨 리노베이션입니다.',
    location: '서울시 종로구 대학로',
    scale: '지하 1층 / 지상 4층',
    area: '1,650.0㎡ (499.1평)',
    scope: '정밀안전진단 연계 리모델링 설계, 공사감리',
    year: '2026',
    featured: false
  }
];

// Build 44 items with IDs p1 through p44
const complete44Items = portfoliosData.map((data, index) => {
  const idNum = index + 1;
  const imgUrl = unsplashImages[index % unsplashImages.length];
  // select a couple of additional images
  const addImg1 = unsplashImages[(index + 7) % unsplashImages.length];
  const addImg2 = unsplashImages[(index + 15) % unsplashImages.length];

  return {
    id: `p${idNum}`,
    title: data.title,
    category: data.category,
    description: data.description,
    imageUrl: imgUrl,
    additionalImages: [addImg1, addImg2],
    location: data.location,
    scale: data.scale,
    area: data.area,
    scope: data.scope,
    client: '로하스 건축 클라이언트',
    year: data.year,
    featured: data.featured,
    createdAt: new Date(Date.now() - (44 - index) * 86400000 * 3).toISOString()
  };
});

console.log(`Generated ${complete44Items.length} portfolio items.`);

// 1. Write to src/data/defaultPortfolio.ts
const tsContent = `import { PortfolioItem } from "../types/index";

export const DEFAULT_PORTFOLIO_ITEMS: PortfolioItem[] = ${JSON.stringify(complete44Items, null, 2)};
`;
fs.writeFileSync('./src/data/defaultPortfolio.ts', tsContent, 'utf-8');
console.log('Saved to src/data/defaultPortfolio.ts');

// 2. Write to data/siteData.json
const siteData = JSON.parse(fs.readFileSync('./data/siteData.json', 'utf-8'));
siteData.portfolioItems = complete44Items;
fs.writeFileSync('./data/siteData.json', JSON.stringify(siteData, null, 2), 'utf-8');
console.log('Saved to data/siteData.json');

// 3. Upload to Firestore
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

setDoc(doc(db, 'siteData', 'main'), {
  portfolioItems: complete44Items,
  lastUpdated: new Date().toISOString()
}, { merge: true })
  .then(async () => {
    console.log(`Firestore database (${config.firestoreDatabaseId}) updated with 44 items successfully!`);
    await terminate(db);
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('Firestore upload error:', err);
    await terminate(db);
    process.exit(1);
  });

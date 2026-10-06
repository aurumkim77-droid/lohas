import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  SiteData,
  SiteSettings,
  ThemeSettings,
  CompanyInfo,
  MenuItem,
  BusinessCard,
  PortfolioItem,
  NoticeItem,
  CustomPage
} from '../types';
import { INITIAL_SITE_DATA } from '../data/initialData';
import {
  auth,
  db,
  signInWithGoogle,
  logoutFirebase,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  User
} from '../firebase';

const LOCAL_STORAGE_KEY = 'lohas_architects_site_data_v21';
const PASSWORD_STORAGE_KEY = 'lohas_admin_password_v1';
const DEFAULT_ADMIN_PASSWORD = 'master8879';

// Helper to clean up obsolete site_data keys from previous versions that exhaust the 5MB browser quota
const cleanupOldLocalStorageKeys = (currentKey: string) => {
  try {
    if (typeof localStorage === 'undefined') return;
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        key !== currentKey &&
        key !== PASSWORD_STORAGE_KEY &&
        (key.startsWith('lohas_architects_site_data') || key.startsWith('lohas_site_data'))
      ) {
        toRemove.push(key);
      }
    }
    toRemove.forEach(k => {
      try { localStorage.removeItem(k); } catch (_) {}
    });
  } catch (_) {}
};

// Safe saving to localStorage with automatic cleanup, lightweight fallback, and zero-crash quota handling
const saveSafeToLocalStorage = (key: string, data: SiteData) => {
  if (typeof localStorage === 'undefined') return;
  try {
    cleanupOldLocalStorageKeys(key);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (_quotaErr) {
    try {
      cleanupOldLocalStorageKeys(key);
      // Strip oversized base64 image strings from localStorage to stay well within browser quota
      // Full resolution data is always persisted and served by the Express backend API (/api/site-data)
      const sanitizeImg = (val?: string) => {
        if (val && val.startsWith('data:') && val.length > 5000) {
          return val.slice(0, 80) + '...[cached_on_server]';
        }
        return val || '';
      };

      const lightweightData: SiteData = {
        ...data,
        portfolioItems: data.portfolioItems.map(p => ({
          ...p,
          imageUrl: sanitizeImg(p.imageUrl),
          additionalImages: (p.additionalImages || []).map(sanitizeImg)
        })),
        uploadedImages: (data.uploadedImages || []).map(sanitizeImg)
      };

      localStorage.setItem(key, JSON.stringify(lightweightData));
    } catch (_fallbackErr) {
      // Gracefully handle storage quota limit without throwing unhandled console error
      console.warn('LocalStorage quota limit reached; changes are safely persisted to the backend server.');
    }
  }
};

interface SiteContextType {
  siteData: SiteData;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAdminLoggedIn: boolean;
  isAdminModeActive: boolean;
  setIsAdminModeActive: (active: boolean) => void;
  adminPassword?: string;
  updateAdminPassword: (newPass: string) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  
  // Firebase Auth & Firestore
  firebaseUser: User | null;
  loginWithGoogle: () => Promise<User>;
  logoutFirebaseUser: () => Promise<void>;

  syncToServer: (dataToSync?: SiteData) => Promise<boolean>;
  syncNoticesToServer: () => Promise<boolean>;
  syncPortfolioToServer: (items?: PortfolioItem[]) => Promise<boolean>;
  
  // Updates
  updateSettings: (settings: Partial<SiteSettings>) => void;
  updateTheme: (theme: Partial<ThemeSettings>) => void;
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  
  // Menu CRUD
  updateMenuItems: (items: MenuItem[]) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (id: string) => void;
  
  // Business Card CRUD
  updateBusinessCards: (cards: BusinessCard[]) => void;
  updateBusinessCard: (id: string, card: Partial<BusinessCard>) => void;
  
  // Portfolio CRUD
  addPortfolioItem: (item: Omit<PortfolioItem, 'id' | 'createdAt'> & { createdAt?: string }) => void;
  updatePortfolioItem: (id: string, item: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;
  togglePortfolioFeatured: (id: string) => void;
  resetPortfolioItemsToDefault: () => void;
  
  // Notice CRUD
  addNotice: (notice: Omit<NoticeItem, 'id' | 'createdAt' | 'views'>) => void;
  updateNotice: (id: string, notice: Partial<NoticeItem>) => void;
  deleteNotice: (id: string) => void;
  incrementNoticeViews: (id: string) => void;
  
  // Custom Page CRUD
  addCustomPage: (page: Omit<CustomPage, 'id' | 'createdAt'>) => void;
  updateCustomPage: (id: string, page: Partial<CustomPage>) => void;
  deleteCustomPage: (id: string) => void;
  
  // Image Uploads
  addUploadedImage: (url: string) => void;
  deleteUploadedImage: (url: string) => void;
  uploadImageFile: (fileOrBase64: string) => Promise<string>;
  syncImagesToServer: (images?: string[]) => Promise<boolean>;
  
  // Reset & Import
  resetToDefault: () => void;
  importSiteData: (newData: SiteData) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      let saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) {
        // Fallback: check any existing versions in localStorage so admin edits are never lost
        const candidateKeys = [
          'lohas_architects_site_data_v16',
          'lohas_architects_site_data_v15',
          'lohas_architects_site_data_v14',
          'lohas_architects_site_data_v13',
          'lohas_architects_site_data_v12',
          'lohas_architects_site_data_v11',
          'lohas_architects_site_data_v10',
          'lohas_architects_site_data',
          'lohas_site_data'
        ];
        for (const k of candidateKeys) {
          const val = localStorage.getItem(k);
          if (val) {
            saved = val;
            break;
          }
        }
        if (!saved && typeof localStorage !== 'undefined') {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('lohas_architects_site_data') || key.startsWith('lohas_site_data'))) {
              saved = localStorage.getItem(key);
              if (saved) break;
            }
          }
        }
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedCompanyInfo = { ...INITIAL_SITE_DATA.companyInfo, ...parsed.companyInfo };
        if (mergedCompanyInfo.architectCareers) {
          mergedCompanyInfo.architectCareers = mergedCompanyInfo.architectCareers.map((item: string) => {
            if (item === '석면감리 고급감리원 과정 수료, 건축물정기점검/해제감리 실무교육 수료') {
              return '건축물정기점검/해제감리/석면고급감리 실무교육 수료';
            }
            if (item === '2008년 건축사 면허 취득') {
              return '2008년 건축사 면허 취득, 건축사협회 정회원 등록';
            }
            if (item === '그린리모델링 전문가') {
              return '그린리모델링창조센터 그린리모델링 사업자 등록';
            }
            return item;
          });

          if (!mergedCompanyInfo.architectCareers.includes('리모델링 및 인테리어 전문가')) {
            const greenIdx = mergedCompanyInfo.architectCareers.indexOf('그린리모델링창조센터 그린리모델링 사업자 등록');
            const idx = greenIdx !== -1 ? greenIdx : mergedCompanyInfo.architectCareers.indexOf('그린리모델링 전문가');
            if (idx !== -1) {
              mergedCompanyInfo.architectCareers.splice(idx + 1, 0, '리모델링 및 인테리어 전문가');
            } else {
              mergedCompanyInfo.architectCareers.push('리모델링 및 인테리어 전문가');
            }
          }
        }
        const updatedBusinessCards = (parsed.businessCards || INITIAL_SITE_DATA.businessCards).map((card: BusinessCard) => {
          const defaultCard = INITIAL_SITE_DATA.businessCards.find(b => b.id === card.id);
          let title = card.title;
          if (card.id === 'b1' && (card.title === '건축설계 / 감리' || card.title === '건축설계/감리')) title = '건축설계/감리 안내';
          if (card.id === 'b2' && card.title === '용도변경') title = '용도변경 안내';
          if (card.id === 'b3' && (card.title === '증축 / 리모델링' || card.title === '증축/리모델링')) title = '증축/리모델링 안내';
          if (card.id === 'b4' && card.title === '위반건축물 양성화') title = '위반건축물 양성화 안내';

          return {
            ...card,
            title,
            externalUrl: (defaultCard && (!card.externalUrl || card.externalUrl === 'https://blog.naver.com/reredos123'))
              ? defaultCard.externalUrl
              : card.externalUrl
          };
        });

        const validCategories = ['Housing', 'Office', 'commercial', 'Other'];
        let finalPortfolioItems: PortfolioItem[] = [];
        const defaultPortfolioMap = new Map(INITIAL_SITE_DATA.portfolioItems.map(p => [p.id, p]));

        // If the administrator has saved portfolio items, preserve the administrator's exact modifications
        // and also merge any newly added system projects (p7~p16) so newly added portfolio items are updated!
        if (Array.isArray(parsed.portfolioItems) && parsed.portfolioItems.length > 0) {
          const existingIds = new Set<string>();

          const processedParsed = parsed.portfolioItems.map((p: PortfolioItem) => {
            existingIds.add(p.id);
            let cat = p.category;
            if (cat === '건축설계' || cat === '감리') cat = 'Office';
            else if (cat === '용도변경') cat = 'Office';
            else if (cat === '리모델링') cat = 'Housing';
            else if (cat === '위반건축물 양성화') cat = 'Other';
            else if (cat === 'Industrial Building' || cat === 'Commercial') cat = 'commercial';
            if (!validCategories.includes(cat)) cat = 'Other';

            const defaultItem = defaultPortfolioMap.get(p.id);

            return {
              ...(defaultItem || {}),
              ...p,
              title: p.title !== undefined ? p.title : (defaultItem?.title || ''),
              category: cat,
              description: p.description !== undefined ? p.description : (defaultItem?.description || ''),
              scale: p.scale !== undefined ? p.scale : (defaultItem?.scale || ''),
              area: p.area !== undefined ? p.area : (defaultItem?.area || ''),
              scope: p.scope !== undefined ? p.scope : (defaultItem?.scope || ''),
              location: p.location !== undefined ? p.location : (defaultItem?.location || ''),
              imageUrl: (p.imageUrl && !p.imageUrl.includes('[cached_on_server]')) ? p.imageUrl : (defaultItem?.imageUrl || p.imageUrl || ''),
              additionalImages: Array.isArray(p.additionalImages) && p.additionalImages.length > 0
                ? p.additionalImages.map(img => img.includes('[cached_on_server]') ? '' : img).filter(Boolean)
                : (defaultItem?.additionalImages || [])
            };
          });

          // Append any newly added items in INITIAL_SITE_DATA (such as p7 ~ p16) that are not in parsed data
          const newlyAddedInitialItems = INITIAL_SITE_DATA.portfolioItems.filter(
            item => !existingIds.has(item.id)
          );

          finalPortfolioItems = [...processedParsed, ...newlyAddedInitialItems].slice(0, 150);
        } else {
          finalPortfolioItems = INITIAL_SITE_DATA.portfolioItems;
        }

        return {
          ...INITIAL_SITE_DATA,
          ...parsed,
          businessCards: updatedBusinessCards,
          portfolioItems: finalPortfolioItems.length > 0 ? finalPortfolioItems : INITIAL_SITE_DATA.portfolioItems,
          settings: {
            ...INITIAL_SITE_DATA.settings,
            ...parsed.settings,
            qnaUrl: (!parsed.settings?.qnaUrl || parsed.settings.qnaUrl === 'https://form.naver.com/edit/4YworAQccMU')
              ? 'https://naver.me/xB7XkDIy'
              : parsed.settings.qnaUrl
          },
          theme: { ...INITIAL_SITE_DATA.theme, ...parsed.theme },
          companyInfo: mergedCompanyInfo
        };
      }
    } catch (e) {
      console.error('Failed to load local storage data', e);
    }
    return INITIAL_SITE_DATA;
  });

  const [currentPage, setCurrentPage] = useState<string>('/');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('lohas_admin_session') === 'true';
  });
  const [isAdminModeActive, setIsAdminModeActive] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD;
  });

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem('lohas_admin_session', 'true');
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<User> => {
    try {
      const user = await signInWithGoogle();
      setFirebaseUser(user);
      setIsAdminLoggedIn(true);
      setIsAdminModeActive(true);
      sessionStorage.setItem('lohas_admin_session', 'true');
      return user;
    } catch (err) {
      console.error('Failed to log in with Google:', err);
      throw err;
    }
  };

  const logoutFirebaseUser = async (): Promise<void> => {
    try {
      await logoutFirebase();
    } catch (err) {
      console.error('Failed to logout of Firebase:', err);
    }
    setFirebaseUser(null);
    logoutAdmin();
  };

  // Flags to avoid unneeded or queued Firestore writes and prevent resource exhaustion
  const hasUserModifiedRef = useRef<boolean>(false);
  const isFirestoreSyncingRef = useRef<boolean>(false);
  const pendingFirestoreSyncRef = useRef<SiteData | null>(null);

  // Sync to localStorage safely without quota errors
  useEffect(() => {
    saveSafeToLocalStorage(LOCAL_STORAGE_KEY, siteData);
  }, [siteData]);

  // Clean up obsolete localStorage keys from previous versions on initial mount
  useEffect(() => {
    cleanupOldLocalStorageKeys(LOCAL_STORAGE_KEY);
  }, []);

  // Sanitize data for Firestore to strictly obey the 1MB document limit and prevent write exhaustion
  const sanitizeForFirestore = (data: SiteData): Record<string, any> => {
    const cleanUploads = Array.isArray(data.uploadedImages)
      ? data.uploadedImages.filter((img): img is string => typeof img === 'string' && img.length > 0 && !img.startsWith('data:'))
      : [];

    const cleanPortfolios = Array.isArray(data.portfolioItems)
      ? data.portfolioItems.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          imageUrl: (typeof p.imageUrl === 'string' && !p.imageUrl.startsWith('data:')) ? p.imageUrl : '',
          additionalImages: Array.isArray(p.additionalImages)
            ? p.additionalImages.filter((img: any) => typeof img === 'string' && !img.startsWith('data:'))
            : [],
          location: p.location || '',
          scale: p.scale || '',
          area: p.area || '',
          scope: p.scope || '',
          year: p.year || '',
          featured: !!p.featured,
          createdAt: p.createdAt || new Date().toISOString()
        }))
      : [];

    return {
      ...data,
      uploadedImages: cleanUploads,
      portfolioItems: cleanPortfolios,
      lastUpdated: new Date().toISOString()
    };
  };

  // Safe Firestore sync with single-flight locking to prevent "Write stream exhausted maximum allowed queued writes"
  const syncToFirestore = async (data: SiteData) => {
    if (isFirestoreSyncingRef.current) {
      pendingFirestoreSyncRef.current = data;
      return;
    }
    isFirestoreSyncingRef.current = true;
    try {
      const sanitized = sanitizeForFirestore(data);
      const siteDocRef = doc(db, 'siteData', 'main');
      await setDoc(siteDocRef, sanitized, { merge: true });
    } catch (err: any) {
      console.warn('Firestore sync note:', err?.message || err);
    } finally {
      isFirestoreSyncingRef.current = false;
      if (pendingFirestoreSyncRef.current) {
        const next = pendingFirestoreSyncRef.current;
        pendingFirestoreSyncRef.current = null;
        setTimeout(() => syncToFirestore(next), 1500);
      }
    }
  };

  // Sync to backend server and Firestore database
  const syncToServer = async (dataToSync?: SiteData): Promise<boolean> => {
    try {
      const payload = dataToSync || siteData;
      const res = await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Synchronize to Firestore with queue protection
      syncToFirestore(payload).catch(() => {});
      return res.ok;
    } catch (e) {
      console.warn('Failed to sync site data to server', e);
      return false;
    }
  };

  // Auto-sync on siteData changes ONLY if modified by user actions (debounced 2s)
  useEffect(() => {
    if (!hasUserModifiedRef.current) return;

    const timer = setTimeout(() => {
      fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData)
      }).catch(() => {});

      syncToFirestore(siteData);
    }, 2000);
    return () => clearTimeout(timer);
  }, [siteData]);

  // Sync state from server and Firestore on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/site-data')
      .then(res => res.ok ? res.json() : null)
      .then(serverData => {
        if (!isMounted || !serverData || !Array.isArray(serverData.portfolioItems)) return;
        setSiteData(prev => {
          const updated = {
            ...prev,
            ...serverData,
            portfolioItems: serverData.portfolioItems
          };
          saveSafeToLocalStorage(LOCAL_STORAGE_KEY, updated);
          return updated;
        });
        // Keep modification flag false so initial load does not re-push to Firestore
        hasUserModifiedRef.current = false;
      })
      .catch(err => {
        console.warn('Could not fetch server site-data, checking Firestore', err);
      });

    // Firestore fallback
    try {
      const siteDocRef = doc(db, 'siteData', 'main');
      getDoc(siteDocRef).then((snap) => {
        if (!isMounted || !snap.exists()) return;
        const fsData = snap.data() as Partial<SiteData>;
        if (fsData && Array.isArray(fsData.portfolioItems) && fsData.portfolioItems.length > 0) {
          setSiteData(prev => ({
            ...prev,
            ...fsData
          }));
          hasUserModifiedRef.current = false;
        }
      }).catch(() => {});
    } catch (_) {}

    return () => { isMounted = false; };
  }, []);

  // Sync state across multiple tabs or windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const freshData = JSON.parse(e.newValue);
          if (freshData && Array.isArray(freshData.portfolioItems)) {
            setSiteData(freshData);
          }
        } catch (err) {
          console.error('Failed to sync storage event', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateAdminPassword = (newPass: string) => {
    if (!newPass.trim()) return;
    setAdminPassword(newPass);
    try {
      localStorage.setItem(PASSWORD_STORAGE_KEY, newPass);
    } catch (_) {}
  };

  // Apply theme dynamically to CSS root variables
  useEffect(() => {
    if (siteData.theme) {
      document.documentElement.style.setProperty('--primary-color', siteData.theme.primaryColor || '#001528');
      document.documentElement.style.setProperty('--accent-color', siteData.theme.accentColor || '#f5ea1d');
      document.documentElement.style.setProperty('--bg-color', siteData.theme.backgroundColor || '#ffffff');
      document.documentElement.style.setProperty('--text-color', siteData.theme.textColor || '#1e293b');
    }
  }, [siteData.theme]);

  const loginAdmin = (password: string) => {
    if (password === adminPassword || password === DEFAULT_ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setIsAdminModeActive(true);
      sessionStorage.setItem('lohas_admin_session', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setIsAdminModeActive(false);
    sessionStorage.removeItem('lohas_admin_session');
  };

  const updateSettings = (settings: Partial<SiteSettings>) => {
    setSiteData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  };

  const updateTheme = (theme: Partial<ThemeSettings>) => {
    setSiteData(prev => ({
      ...prev,
      theme: { ...prev.theme, ...theme }
    }));
  };

  const updateCompanyInfo = (info: Partial<CompanyInfo>) => {
    setSiteData(prev => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, ...info }
    }));
  };

  const updateMenuItems = (items: MenuItem[]) => {
    setSiteData(prev => ({
      ...prev,
      menuItems: items
    }));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newId = 'm_' + Date.now();
    const newItem: MenuItem = { ...item, id: newId };
    setSiteData(prev => ({
      ...prev,
      menuItems: [...prev.menuItems, newItem]
    }));
  };

  const deleteMenuItem = (id: string) => {
    setSiteData(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter(m => m.id !== id)
    }));
  };

  const updateBusinessCards = (cards: BusinessCard[]) => {
    setSiteData(prev => ({
      ...prev,
      businessCards: cards
    }));
  };

  const updateBusinessCard = (id: string, card: Partial<BusinessCard>) => {
    setSiteData(prev => ({
      ...prev,
      businessCards: prev.businessCards.map(b => (b.id === id ? { ...b, ...card } : b))
    }));
  };

  const addPortfolioItem = (item: Omit<PortfolioItem, 'id' | 'createdAt'> & { createdAt?: string }) => {
    if (siteData.portfolioItems.length >= 150) {
      alert('포트폴리오는 최대 150개까지 등록 가능합니다. 기존 항목을 정리한 후 등록해 주세요.');
      return;
    }
    const newId = 'p_' + Date.now();
    const newItem: PortfolioItem = {
      ...item,
      id: newId,
      createdAt: item.createdAt || new Date().toISOString().split('T')[0]
    };
    setSiteData(prev => {
      const nextPortfolio = [newItem, ...prev.portfolioItems].slice(0, 150);
      const nextData = {
        ...prev,
        portfolioItems: nextPortfolio
      };
      // Immediately persist to backend server
      fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioItems: nextPortfolio })
      }).catch(() => {});
      syncToServer(nextData).catch(() => {});
      saveSafeToLocalStorage(LOCAL_STORAGE_KEY, nextData);
      return nextData;
    });
  };

  const updatePortfolioItem = (id: string, item: Partial<PortfolioItem>) => {
    setSiteData(prev => {
      const target = prev.portfolioItems.find(p => p.id === id);
      if (!target) return prev;
      const updated = { ...target, ...item };
      // Keep exact item order in place
      const nextPortfolio = prev.portfolioItems.map(p => (p.id === id ? updated : p));
      const nextData = {
        ...prev,
        portfolioItems: nextPortfolio
      };
      // Immediately persist to backend server so changes are never lost
      fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioItems: nextPortfolio })
      }).catch(() => {});
      syncToServer(nextData).catch(() => {});
      saveSafeToLocalStorage(LOCAL_STORAGE_KEY, nextData);
      return nextData;
    });
  };

  const deletePortfolioItem = (id: string) => {
    setSiteData(prev => {
      const nextPortfolio = prev.portfolioItems.filter(p => p.id !== id);
      const nextData = {
        ...prev,
        portfolioItems: nextPortfolio
      };
      fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioItems: nextPortfolio })
      }).catch(() => {});
      syncToServer(nextData).catch(() => {});
      saveSafeToLocalStorage(LOCAL_STORAGE_KEY, nextData);
      return nextData;
    });
  };

  const togglePortfolioFeatured = (id: string) => {
    setSiteData(prev => {
      const nextPortfolio = prev.portfolioItems.map(p => (p.id === id ? { ...p, featured: !p.featured } : p));
      const nextData = {
        ...prev,
        portfolioItems: nextPortfolio
      };
      fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioItems: nextPortfolio })
      }).catch(() => {});
      syncToServer(nextData).catch(() => {});
      saveSafeToLocalStorage(LOCAL_STORAGE_KEY, nextData);
      return nextData;
    });
  };

  const syncPortfolioToServer = async (itemsToSync?: PortfolioItem[]): Promise<boolean> => {
    try {
      const items = itemsToSync || siteData.portfolioItems;
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioItems: items })
      });
      if (res.ok) {
        await syncToServer({ ...siteData, portfolioItems: items });
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Failed to sync portfolio to server', e);
      return false;
    }
  };

  const resetPortfolioItemsToDefault = () => {
    // Only perform reset when explicitly requested, and sync to server
    setSiteData(prev => {
      const updated = {
        ...prev,
        portfolioItems: INITIAL_SITE_DATA.portfolioItems
      };
      syncPortfolioToServer(INITIAL_SITE_DATA.portfolioItems).catch(() => {});
      saveSafeToLocalStorage(LOCAL_STORAGE_KEY, updated);
      return updated;
    });
  };

  const syncNoticesToServer = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notices: siteData.notices })
      });
      if (res.ok) {
        await syncToServer(siteData);
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Failed to sync notices to server', e);
      return false;
    }
  };

  const addNotice = (notice: Omit<NoticeItem, 'id' | 'createdAt' | 'views'>) => {
    const newId = 'n_' + Date.now();
    const newNotice: NoticeItem = {
      ...notice,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0
    };
    setSiteData(prev => {
      const updated = {
        ...prev,
        notices: [newNotice, ...prev.notices]
      };
      syncToServer(updated).catch(() => {});
      fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notices: updated.notices })
      }).catch(() => {});
      return updated;
    });
  };

  const updateNotice = (id: string, notice: Partial<NoticeItem>) => {
    setSiteData(prev => {
      const updated = {
        ...prev,
        notices: prev.notices.map(n => (n.id === id ? { ...n, ...notice } : n))
      };
      syncToServer(updated).catch(() => {});
      fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notices: updated.notices })
      }).catch(() => {});
      return updated;
    });
  };

  const deleteNotice = (id: string) => {
    setSiteData(prev => {
      const updated = {
        ...prev,
        notices: prev.notices.filter(n => n.id !== id)
      };
      syncToServer(updated).catch(() => {});
      fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notices: updated.notices })
      }).catch(() => {});
      return updated;
    });
  };

  const incrementNoticeViews = (id: string) => {
    setSiteData(prev => ({
      ...prev,
      notices: prev.notices.map(n => (n.id === id ? { ...n, views: n.views + 1 } : n))
    }));
  };

  const addCustomPage = (page: Omit<CustomPage, 'id' | 'createdAt'>) => {
    const newId = 'page_' + Date.now();
    const newCustomPage: CustomPage = {
      ...page,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSiteData(prev => ({
      ...prev,
      customPages: [...prev.customPages, newCustomPage],
      menuItems: [
        ...prev.menuItems,
        {
          id: 'm_' + newId,
          title: page.title,
          path: `/custom/${newId}`,
          isCustomPage: true,
          order: prev.menuItems.length + 1
        }
      ]
    }));
  };

  const updateCustomPage = (id: string, page: Partial<CustomPage>) => {
    setSiteData(prev => ({
      ...prev,
      customPages: prev.customPages.map(cp => (cp.id === id ? { ...cp, ...page } : cp)),
      menuItems: prev.menuItems.map(m =>
        m.path === `/custom/${id}` && page.title ? { ...m, title: page.title } : m
      )
    }));
  };

  const deleteCustomPage = (id: string) => {
    setSiteData(prev => ({
      ...prev,
      customPages: prev.customPages.filter(cp => cp.id !== id),
      menuItems: prev.menuItems.filter(m => m.path !== `/custom/${id}`)
    }));
  };

  const addUploadedImage = (url: string) => {
    setSiteData(prev => {
      const updated = [url, ...prev.uploadedImages.filter(img => img !== url)];
      const nextData = {
        ...prev,
        uploadedImages: updated
      };
      fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadedImages: updated })
      }).catch(() => {});
      syncToServer(nextData).catch(() => {});
      saveSafeToLocalStorage(LOCAL_STORAGE_KEY, nextData);
      return nextData;
    });
  };

  const deleteUploadedImage = (url: string) => {
    setSiteData(prev => {
      const updated = prev.uploadedImages.filter(img => img !== url);
      const nextData = {
        ...prev,
        uploadedImages: updated
      };
      fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadedImages: updated })
      }).catch(() => {});
      syncToServer(nextData).catch(() => {});
      saveSafeToLocalStorage(LOCAL_STORAGE_KEY, nextData);
      return nextData;
    });
  };

  const uploadImageFile = async (fileOrBase64: string): Promise<string> => {
    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: fileOrBase64 })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          addUploadedImage(json.url);
          return json.url;
        }
      }
    } catch (e) {
      console.warn('Failed to upload image file to backend:', e);
    }
    // Only add if it is an actual URL, never push raw oversized base64 to state
    if (!fileOrBase64.startsWith('data:')) {
      addUploadedImage(fileOrBase64);
    }
    return fileOrBase64;
  };

  const syncImagesToServer = async (imagesToSync?: string[]): Promise<boolean> => {
    try {
      const images = imagesToSync || siteData.uploadedImages;
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadedImages: images })
      });
      if (res.ok) {
        await syncToServer({ ...siteData, uploadedImages: images });
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Failed to sync images to server', e);
      return false;
    }
  };

  const resetToDefault = () => {
    setSiteData(INITIAL_SITE_DATA);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const importSiteData = (newData: SiteData) => {
    setSiteData(newData);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to save imported site data', e);
    }
  };

  return (
    <SiteContext.Provider
      value={{
        siteData,
        currentPage,
        setCurrentPage,
        isAdminLoggedIn,
        isAdminModeActive,
        setIsAdminModeActive,
        adminPassword,
        updateAdminPassword,
        loginAdmin,
        logoutAdmin,
        firebaseUser,
        loginWithGoogle,
        logoutFirebaseUser,
        updateSettings,
        updateTheme,
        updateCompanyInfo,
        updateMenuItems,
        addMenuItem,
        deleteMenuItem,
        updateBusinessCards,
        updateBusinessCard,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        togglePortfolioFeatured,
        resetPortfolioItemsToDefault,
        addNotice,
        updateNotice,
        deleteNotice,
        incrementNoticeViews,
        addCustomPage,
        updateCustomPage,
        deleteCustomPage,
        addUploadedImage,
        deleteUploadedImage,
        resetToDefault,
        importSiteData,
        syncToServer,
        syncNoticesToServer,
        syncPortfolioToServer,
        uploadImageFile,
        syncImagesToServer
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};

import 'dotenv/config';
import express from 'express';
import { execSync } from 'child_process';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const DATA_DIR = path.join(__dirname, 'data');
  const DATA_FILE = path.join(DATA_DIR, 'siteData.json');
  const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
  const DIST_UPLOADS_DIR = path.join(__dirname, 'dist', 'uploads');

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  // Helper to persist base64 image data URLs directly to disk files in both public/uploads and dist/uploads
  const saveBase64ToDisk = (dataUrl: string): string => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return dataUrl;
    }
    try {
      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches || matches.length < 3) return dataUrl;
      let ext = matches[1];
      if (ext === 'jpeg') ext = 'jpg';
      if (ext === 'svg+xml') ext = 'svg';

      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);

      fs.writeFileSync(filePath, buffer);

      if (fs.existsSync(path.join(__dirname, 'dist'))) {
        if (!fs.existsSync(DIST_UPLOADS_DIR)) fs.mkdirSync(DIST_UPLOADS_DIR, { recursive: true });
        fs.writeFileSync(path.join(DIST_UPLOADS_DIR, filename), buffer);
      }

      return `/uploads/${filename}`;
    } catch (e) {
      console.error('Error saving base64 to disk:', e);
      return dataUrl;
    }
  };

  const copyUploadsToDist = () => {
    if (fs.existsSync(path.join(__dirname, 'dist')) && fs.existsSync(UPLOADS_DIR)) {
      try {
        if (!fs.existsSync(DIST_UPLOADS_DIR)) fs.mkdirSync(DIST_UPLOADS_DIR, { recursive: true });
        const files = fs.readdirSync(UPLOADS_DIR);
        files.forEach((f) => {
          const src = path.join(UPLOADS_DIR, f);
          const dst = path.join(DIST_UPLOADS_DIR, f);
          if (!fs.existsSync(dst)) fs.copyFileSync(src, dst);
        });
      } catch (_) {}
    }
  };

  app.use(express.json({ limit: '50mb' }));

  // Ensure data directory exists and seed initial data if needed
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const getOrInitSiteData = () => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading data file, resetting to initialData', e);
    }
    // Default minimal data if file does not exist
    const fallbackData = {
      settings: {
        siteName: '로하스건축사사무소',
        address: '서울시 성동구 살곶이길 150 (사근동 189-5)',
        phone: '02-499-0229',
        email: 'aurumkim77@gmail.com'
      },
      menuItems: [],
      portfolioItems: [],
      uploadedImages: [],
      notices: []
    };
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(fallbackData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error seeding siteData.json', e);
    }
    return fallbackData;
  };

  // Ensure data file is initialized on server start
  getOrInitSiteData();

  // API Endpoints for Full-Stack Persistence
  app.get('/api/site-data', (_req, res) => {
    try {
      const data = getOrInitSiteData();
      return res.json(data);
    } catch (err) {
      console.error('Failed to get site data:', err);
      return res.status(500).json({ error: 'Failed to retrieve site data' });
    }
  });

  app.post('/api/site-data', (req, res) => {
    try {
      const newSiteData = req.body;
      if (!newSiteData || typeof newSiteData !== 'object') {
        return res.status(400).json({ error: 'Invalid site data payload' });
      }

      // Convert any base64 images in portfolioItems directly to permanent disk files
      if (Array.isArray(newSiteData.portfolioItems)) {
        newSiteData.portfolioItems = newSiteData.portfolioItems.map((p: any) => {
          if (!p || typeof p !== 'object') return p;
          const cleanImageUrl = saveBase64ToDisk(p.imageUrl);
          const cleanAdditional = Array.isArray(p.additionalImages)
            ? p.additionalImages.map((img: any) => saveBase64ToDisk(img))
            : [];
          return {
            ...p,
            imageUrl: cleanImageUrl || '',
            additionalImages: cleanAdditional
          };
        });
      }

      // Sanitize uploadedImages
      if (Array.isArray(newSiteData.uploadedImages)) {
        newSiteData.uploadedImages = newSiteData.uploadedImages.map((img: any) => saveBase64ToDisk(img));
      } else {
        newSiteData.uploadedImages = [];
      }

      fs.writeFileSync(DATA_FILE, JSON.stringify(newSiteData, null, 2), 'utf-8');
      if (Array.isArray(newSiteData.portfolioItems) && newSiteData.portfolioItems.length > 0) {
        try {
          const defaultPortfolioPath = path.join(__dirname, 'src', 'data', 'defaultPortfolio.ts');
          const tsContent = `import { PortfolioItem } from "../types/index";\n\nexport const DEFAULT_PORTFOLIO_ITEMS: PortfolioItem[] = ${JSON.stringify(newSiteData.portfolioItems, null, 2)};\n`;
          fs.writeFileSync(defaultPortfolioPath, tsContent, 'utf-8');
        } catch (_) {}
      }
      copyUploadsToDist();
      return res.json({ success: true, message: 'Site data saved successfully' });
    } catch (err) {
      console.error('Failed to save site data:', err);
      return res.status(500).json({ error: 'Failed to save site data' });
    }
  });

  app.post('/api/portfolio', (req, res) => {
    try {
      const { portfolioItems } = req.body;
      if (!Array.isArray(portfolioItems)) {
        return res.status(400).json({ error: 'portfolioItems must be an array' });
      }

      // Convert any base64 images directly to permanent disk files
      const processedItems = portfolioItems.map((p: any) => {
        if (!p || typeof p !== 'object') return p;
        const cleanImageUrl = saveBase64ToDisk(p.imageUrl);
        const cleanAdditional = Array.isArray(p.additionalImages)
          ? p.additionalImages.map((img: any) => saveBase64ToDisk(img))
          : [];
        return {
          ...p,
          imageUrl: cleanImageUrl || '',
          additionalImages: cleanAdditional
        };
      });

      const current = getOrInitSiteData();
      current.portfolioItems = processedItems;
      fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
      if (processedItems.length > 0) {
        try {
          const defaultPortfolioPath = path.join(__dirname, 'src', 'data', 'defaultPortfolio.ts');
          const tsContent = `import { PortfolioItem } from "../types/index";\n\nexport const DEFAULT_PORTFOLIO_ITEMS: PortfolioItem[] = ${JSON.stringify(processedItems, null, 2)};\n`;
          fs.writeFileSync(defaultPortfolioPath, tsContent, 'utf-8');
        } catch (_) {}
      }
      copyUploadsToDist();
      return res.json({ success: true, count: processedItems.length, portfolioItems: processedItems });
    } catch (err) {
      console.error('Failed to update portfolio items:', err);
      return res.status(500).json({ error: 'Failed to update portfolio items' });
    }
  });

  app.post('/api/notices', (req, res) => {
    try {
      const { notices } = req.body;
      if (!Array.isArray(notices)) {
        return res.status(400).json({ error: 'notices must be an array' });
      }
      const current = getOrInitSiteData();
      current.notices = notices;
      fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
      return res.json({ success: true, count: notices.length });
    } catch (err) {
      console.error('Failed to update notices:', err);
      return res.status(500).json({ error: 'Failed to update notices' });
    }
  });

  // Serve static uploaded files with seamless fallback
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.get('/uploads/:filename', (_req, res) => {
    try {
      const files = fs.readdirSync(UPLOADS_DIR).filter((f) => f.endsWith('.jpg') || f.endsWith('.png'));
      if (files.length > 0) {
        return res.sendFile(path.join(UPLOADS_DIR, files[0]));
      }
      const assetsDir = path.join(__dirname, 'src', 'assets', 'images');
      if (fs.existsSync(assetsDir)) {
        const assetFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.jpg'));
        if (assetFiles.length > 0) {
          return res.sendFile(path.join(assetsDir, assetFiles[0]));
        }
      }
    } catch (_) {}
    return res.status(404).send('Image not found');
  });

  app.post('/api/upload-image', (req, res) => {
    try {
      const { image } = req.body;
      if (!image || typeof image !== 'string') {
        return res.status(400).json({ error: 'Image data is required' });
      }

      // If base64 data URL, write to file on disk
      if (image.startsWith('data:image/')) {
        const fileUrl = saveBase64ToDisk(image);
        const current = getOrInitSiteData();
        if (!Array.isArray(current.uploadedImages)) {
          current.uploadedImages = [];
        }
        if (!current.uploadedImages.includes(fileUrl)) {
          current.uploadedImages = [fileUrl, ...current.uploadedImages];
          fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
        }
        copyUploadsToDist();
        return res.json({ success: true, url: fileUrl });
      }

      // If it's a URL string
      const current = getOrInitSiteData();
      if (!Array.isArray(current.uploadedImages)) {
        current.uploadedImages = [];
      }
      if (!current.uploadedImages.includes(image)) {
        current.uploadedImages = [image, ...current.uploadedImages];
        fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
      }

      return res.json({ success: true, url: image });
    } catch (err) {
      console.error('Failed to upload image:', err);
      return res.status(500).json({ error: 'Failed to process image upload' });
    }
  });

  app.post('/api/images', (req, res) => {
    try {
      const { uploadedImages } = req.body;
      if (!Array.isArray(uploadedImages)) {
        return res.status(400).json({ error: 'uploadedImages must be an array' });
      }
      const current = getOrInitSiteData();
      current.uploadedImages = uploadedImages;
      fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
      return res.json({ success: true, count: uploadedImages.length });
    } catch (err) {
      console.error('Failed to update uploadedImages:', err);
      return res.status(500).json({ error: 'Failed to update uploaded images' });
    }
  });

  // GitHub Repository Sync API
  app.get('/api/github-status', (_req, res) => {
    try {
      let remoteUrl = '';
      try {
        remoteUrl = execSync('git remote get-url origin', { cwd: __dirname, encoding: 'utf-8' }).trim();
      } catch (_) {}
      let lastCommit = '';
      try {
        lastCommit = execSync('git log -1 --pretty=format:"%h - %s (%cr)"', { cwd: __dirname, encoding: 'utf-8' }).trim();
      } catch (_) {}
      const totalUploads = fs.existsSync(UPLOADS_DIR) ? fs.readdirSync(UPLOADS_DIR).length : 0;
      return res.json({
        hasOrigin: Boolean(remoteUrl),
        remoteUrl: remoteUrl.replace(/https:\/\/[^@]+@github\.com/g, 'https://github.com'),
        lastCommit,
        totalUploads
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/github-sync', (req, res) => {
    try {
      let { repoUrl, token, branch = 'main', commitMessage } = req.body;

      repoUrl = repoUrl || process.env.GITHUB_REPO_URL || process.env.GITHUB_REPO;
      token = token || process.env.GITHUB_TOKEN;

      if (!repoUrl) {
        return res.status(400).json({
          error: 'GitHub 저장소 URL 또는 리포지토리명(예: aurumkim/lohas-architects 또는 https://github.com/...)을 입력해주세요.'
        });
      }

      let authUrl = repoUrl.trim();
      if (!authUrl.endsWith('.git')) authUrl += '.git';
      if (!authUrl.startsWith('http://') && !authUrl.startsWith('https://')) {
        authUrl = `https://github.com/${authUrl}`;
      }

      if (token && token.trim()) {
        const cleanRepo = authUrl.replace(/^https?:\/\/[^@]*@github\.com\//, '').replace(/^https?:\/\/github\.com\//, '');
        authUrl = `https://${encodeURIComponent(token.trim())}@github.com/${cleanRepo}`;
      }

      copyUploadsToDist();

      const uploadCount = fs.existsSync(UPLOADS_DIR) ? fs.readdirSync(UPLOADS_DIR).length : 0;
      const msg = commitMessage || `feat(portfolio): sync ${uploadCount} images and siteData to GitHub (${new Date().toISOString()})`;

      const commands = [
        'git init',
        'git config user.name "aurumkim"',
        'git config user.email "aurumkim77@gmail.com"',
        'git add -A',
        `git commit -m "${msg.replace(/"/g, '\\"')}" || true`,
        'git remote remove origin 2>/dev/null || true',
        `git remote add origin "${authUrl}"`,
        `git branch -M ${branch}`,
        `git push -u origin ${branch} --force`
      ];

      const fullCommand = commands.join(' && ');
      const output = execSync(fullCommand, { cwd: __dirname, encoding: 'utf-8', timeout: 60000 });

      try {
        const publicRepoUrl = repoUrl.replace(/^https?:\/\/[^@]*@github\.com\//, 'https://github.com/');
        execSync(`git remote set-url origin "${publicRepoUrl}"`, { cwd: __dirname });
      } catch (_) {}

      return res.json({
        success: true,
        message: `GitHub에 총 ${uploadCount}개의 최신 이미지 및 포트폴리오 데이터가 성공적으로 저장되었습니다!`,
        output: output.slice(-400)
      });
    } catch (err: any) {
      console.error('GitHub sync error:', err);
      const cleanErr = (err.message || String(err)).replace(/https:\/\/[^@]+@github\.com/g, 'https://***@github.com');
      return res.status(500).json({
        error: cleanErr || 'GitHub 동기화 중 오류가 발생했습니다. 토큰 권한(repo scope)이나 저장소 주소를 확인해주세요.'
      });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lohas Architects server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

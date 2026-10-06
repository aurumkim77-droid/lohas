import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_SITE_DATA } from './src/data/initialData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const DATA_DIR = path.join(__dirname, 'data');
  const DATA_FILE = path.join(DATA_DIR, 'siteData.json');

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
    // Seed initial data
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SITE_DATA, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error seeding siteData.json', e);
    }
    return INITIAL_SITE_DATA;
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

      // Sanitize uploadedImages: ensure it is strictly an array of string URLs
      if (Array.isArray(newSiteData.uploadedImages)) {
        newSiteData.uploadedImages = newSiteData.uploadedImages.filter(
          (img: any) => typeof img === 'string' && img.trim().length > 0 && !img.startsWith('data:')
        );
      } else {
        newSiteData.uploadedImages = [];
      }

      // Sanitize portfolio items if present
      if (Array.isArray(newSiteData.portfolioItems)) {
        newSiteData.portfolioItems = newSiteData.portfolioItems.map((p: any) => {
          if (!p || typeof p !== 'object') return p;
          // Don't store oversized base64 strings in siteData.json
          const cleanImageUrl = typeof p.imageUrl === 'string' && p.imageUrl.startsWith('data:') && p.imageUrl.length > 2000
            ? ''
            : p.imageUrl;
          const cleanAdditional = Array.isArray(p.additionalImages)
            ? p.additionalImages.filter((img: any) => typeof img === 'string' && !img.startsWith('data:'))
            : [];
          return {
            ...p,
            imageUrl: cleanImageUrl,
            additionalImages: cleanAdditional
          };
        });
      }

      fs.writeFileSync(DATA_FILE, JSON.stringify(newSiteData, null, 2), 'utf-8');
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
      const current = getOrInitSiteData();
      current.portfolioItems = portfolioItems;
      fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
      return res.json({ success: true, count: portfolioItems.length });
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

  const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

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
        const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (!matches || matches.length < 3) {
          return res.status(400).json({ error: 'Invalid base64 image data' });
        }
        let ext = matches[1];
        if (ext === 'jpeg') ext = 'jpg';
        if (ext === 'svg+xml') ext = 'svg';

        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);

        fs.writeFileSync(filePath, buffer);
        const fileUrl = `/uploads/${filename}`;

        const current = getOrInitSiteData();
        if (!Array.isArray(current.uploadedImages)) {
          current.uploadedImages = [];
        }
        if (!current.uploadedImages.includes(fileUrl)) {
          current.uploadedImages = [fileUrl, ...current.uploadedImages];
          fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
        }

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

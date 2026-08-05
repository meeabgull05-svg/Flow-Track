import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import trackRouter from './api/routes/track.js';
import adminRouter from './api/routes/admin.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mount API routes
app.use('/api/track', trackRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

if (!process.env.VERCEL) {
  setupVite().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[FlowTrack Server] Server running on http://0.0.0.0:${PORT}`);
    });
  });
}

export default app;

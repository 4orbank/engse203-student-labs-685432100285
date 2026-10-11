import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'node:path';
import { existsSync } from 'node:fs';

import { config } from './config.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/userRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // ① CORS
  app.use(cors({ origin: config.corsOrigin }));

  // ② Logging: Development / Production
  app.use(morgan(config.isProd ? 'combined' : 'dev'));

  // ③ JSON Body
  app.use(express.json());

  // ④ API Routes
  app.get('/api', (req, res) => {
    res.json({
      message: 'Campus Service API is running',
      version: '3.0.0',
    });
  });

  app.use('/api/health', healthRoutes);
  app.use('/api/requests', requestRoutes);
  app.use('/api/users', userRoutes);

  // ⑤ Production: ให้ Express เสิร์ฟ React Frontend
  if (config.isProd && existsSync(config.staticDir)) {
    app.use(express.static(config.staticDir));

    // React Router: หน้าเว็บที่ไม่ขึ้นต้นด้วย /api
    app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
      res.sendFile(path.join(config.staticDir, 'index.html'));
    });
  } else {
    // Development: Frontend เปิดผ่าน Vite พอร์ต 5173
    app.get('/', (req, res) => {
      res.json({
        message: 'API (dev) — หน้าเว็บอยู่ที่พอร์ต 5173',
      });
    });
  }

  // ⑥ Error Handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
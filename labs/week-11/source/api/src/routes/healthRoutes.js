import { Router } from 'express';
import { getDbStatus } from '../services/requestService.js';
import { config } from '../config.js';

const router = Router();

// CP37 — Health Check Endpoint
router.get('/', (req, res) => {
  const database = getDbStatus();
  const ok = database.connected;

  res.status(ok ? 200 : 503).json({
    status: ok ? 'ok' : 'degraded',
    env: config.nodeEnv,
    uptime: Math.round(process.uptime()),
    database,
    time: new Date().toISOString(),
  });
});

export default router;
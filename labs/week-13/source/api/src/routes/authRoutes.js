import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

const router = Router();

// Challenge 2: จำกัดการเดารหัสผ่าน
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const failedLogins = new Map();

// ให้ Checker และ Tests รีเซ็ตตัวนับได้
export function resetLoginLimiter() {
  failedLogins.clear();
}

router.post('/login', (req, res) => {
  const errors = validateLoginInput(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง',
      details: errors,
    });
  }

  const email = req.body.email.trim().toLowerCase();
  const now = Date.now();

  const record = failedLogins.get(email);

  // ล็อกหลังกรอกรหัสผ่านผิดครบ 5 ครั้ง
  if (record && record.count >= MAX_FAILED_ATTEMPTS) {
    if (now - record.lastFailedAt < LOCK_DURATION_MS) {
      return res.status(429).json({
        error: 'เข้าสู่ระบบผิดหลายครั้งเกินไป กรุณาลองใหม่ภายหลัง',
      });
    }

    failedLogins.delete(email);
  }

  const result = authService.login(req.body.email, req.body.password);

  if (!result) {
    const current = failedLogins.get(email);

    failedLogins.set(email, {
      count: (current?.count ?? 0) + 1,
      lastFailedAt: now,
    });

    return res.status(401).json({
      error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    });
  }

  // เข้าสู่ระบบสำเร็จ รีเซ็ตจำนวนครั้งที่ผิด
  failedLogins.delete(email);

  return res.status(200).json(result);
});

export default router;
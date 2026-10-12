import { verifyToken } from '../services/authService.js';

/**
 * 🏫 TODO W13-AUTH (CP51) — ป้องกัน route ด้วย JWT
 *
 *   authenticate      → "คุณคือใคร"         ไม่มี token / token ปลอม / หมดอายุ  → 401
 *   requireRole(role) → "คุณทำสิ่งนี้ได้ไหม"  รู้ว่าเป็นใคร แต่ไม่มีสิทธิ์          → 403
 *
 * header ที่ส่งมา:  Authorization: Bearer <token>
 */
export function authenticate(req, res, next) {
  const authorization = req.get('Authorization');
  const parts = authorization?.split(' ');

  if (parts?.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    return res.status(401).json({ error: 'ต้องเข้าสู่ระบบก่อน' });
  }

  try {
    req.user = verifyToken(parts[1]);
    next();
  } catch {
    return res.status(401).json({ error: 'ต้องเข้าสู่ระบบก่อน' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({
        error: 'ไม่มีสิทธิ์ทำรายการนี้',
      });
    }

    next();
  };
}
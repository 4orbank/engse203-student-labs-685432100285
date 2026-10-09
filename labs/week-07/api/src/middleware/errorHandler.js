
import { config } from '../config.js';

/** Error ที่กำหนด HTTP status ได้เอง */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

/** ส่ง error จาก async handler ไปยัง errorHandler */
export function asyncHandler(handler) {
  return function (req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

/** จัดการข้อผิดพลาดจาก route และ middleware */
export function errorHandler(err, req, res, next) {
  console.error('เกิดข้อผิดพลาด:', err.message);

  const statusCode = err.statusCode || err.status || 500;
  const message = config.isProduction
    ? 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์'
    : err.message;

  res.status(statusCode).json({ error: message });
}

/** จัดการเส้นทางที่ไม่มีอยู่ */
export function notFound(req, res) {
  res.status(404).json({
    error: `ไม่พบเส้นทาง ${req.method} ${req.originalUrl}`,
  });
}

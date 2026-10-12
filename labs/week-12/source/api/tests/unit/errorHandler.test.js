import { describe, test, expect, vi } from 'vitest';
import {
  AppError,
  asyncHandler,
  errorHandler,
} from '../../src/middleware/errorHandler.js';

function mockResponse() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
}

describe('Error Handler — Additional Coverage', () => {
  test('AppError เก็บข้อความและ HTTP status', () => {
    const err = new AppError('ข้อมูลไม่ถูกต้อง', 400);

    expect(err.message).toBe('ข้อมูลไม่ถูกต้อง');
    expect(err.status).toBe(400);
  });

  test('AppError ไม่กำหนด status → ค่าเริ่มต้น 500', () => {
    const err = new AppError('ระบบผิดพลาด');

    expect(err.status).toBe(500);
  });

  test('errorHandler ส่งข้อผิดพลาด 400 พร้อมข้อความ', () => {
    const res = mockResponse();
    const err = new AppError('ข้อมูลไม่ถูกต้อง', 400);

    errorHandler(err, {}, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'ข้อมูลไม่ถูกต้อง' }),
    );
  });

  test('errorHandler ซ่อนข้อความภายในเมื่อเกิด 500', () => {
    const res = mockResponse();
    const err = new Error('ความลับของระบบ');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      errorHandler(err, {}, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
        }),
      );
    } finally {
      spy.mockRestore();
    }
  });

  test('asyncHandler ส่ง Promise rejection ไปยัง next', async () => {
    const err = new Error('async failure');
    const next = vi.fn();
    const handler = asyncHandler(async () => {
      throw err;
    });

    await handler({}, {}, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});
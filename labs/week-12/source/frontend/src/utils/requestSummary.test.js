import { describe, test, expect } from 'vitest';
import { summarizeRequests } from './requestSummary.js';

describe('summarizeRequests', () => {
  test('รายการว่าง → ทุกค่าเป็น 0', () => {
    expect(summarizeRequests([])).toEqual({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  });

  // 🏫 TODO W12-DEBUG (CP47 · BUG #2): เพิ่ม test ที่ใช้ข้อมูลหน้าตาเดียวกับที่ API ส่งมา
  //   เปิด DevTools → Network → GET /api/requests → ดูค่า status จริง แล้วคัดลอกมาใช้
});

test('BUG #2 นับสถานะ in-progress จาก API ได้ถูกต้อง', () => {
  const requests = [
    { id: 'REQ-001', status: 'pending' },
    { id: 'REQ-002', status: 'in-progress' },
    { id: 'REQ-004', status: 'pending' },
    { id: 'REQ-005', status: 'pending' },
  ];

  expect(summarizeRequests(requests)).toEqual({
    total: 4,
    pending: 3,
    inProgress: 1,
    completed: 0,
  });
});
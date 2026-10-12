import { describe, test, expect } from 'vitest';
import {
  validateRequestInput,
  isValidStatus,
} from '../../src/validators/requestValidator.js';

// ข้อมูลตั้งต้นที่ถูกต้อง เปลี่ยนทีละช่องสำหรับแต่ละกรณีทดสอบ
const valid = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'ห้อง 301',
  details: 'แอร์ไม่เย็นตั้งแต่เช้า',
  priority: 'normal',
};

const withField = (patch) => ({ ...valid, ...patch });

describe('CP45 — Unit Tests จาก TEST_CASES.md', () => {
  test('TC-01 ข้อมูลถูกต้องทุกช่อง → ไม่มี error', () => {
    expect(validateRequestInput(valid)).toEqual([]);
  });

  test('TC-02 รายละเอียด 9 ตัวอักษร → error 1 ข้อ', () => {
    expect(validateRequestInput(withField({ details: '123456789' }))).toHaveLength(1);
  });

  test('TC-03 รายละเอียด 10 ตัวอักษรพอดี → ต้องผ่าน', () => {
    expect(validateRequestInput(withField({ details: '1234567890' }))).toEqual([]);
  });

  test('TC-04 รายละเอียด 11 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(withField({ details: '12345678901' }))).toEqual([]);
  });

  test('TC-05 ชื่อผู้แจ้ง 1 ตัวอักษร → error 1 ข้อ', () => {
    expect(validateRequestInput(withField({ requesterName: 'ก' }))).toHaveLength(1);
  });

  test('TC-06 ชื่อผู้แจ้ง 2 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(withField({ requesterName: 'กข' }))).toEqual([]);
  });

  test('TC-07 priority urgent → ผ่าน', () => {
    expect(validateRequestInput(withField({ priority: 'urgent' }))).toEqual([]);
  });

  test('TC-08 priority high → error 1 ข้อ', () => {
    expect(validateRequestInput(withField({ priority: 'high' }))).toHaveLength(1);
  });

  test('TC-09 สถานที่ว่าง → error 1 ข้อ', () => {
    expect(validateRequestInput(withField({ location: '' }))).toHaveLength(1);
  });

  test('TC-10 input เป็น null → error 1 ข้อ', () => {
    expect(validateRequestInput(null)).toHaveLength(1);
  });

  test('TC-11 input เป็น object ว่าง → error 5 ข้อ', () => {
    expect(validateRequestInput({})).toHaveLength(5);
  });

  test('รายละเอียดมีแต่ช่องว่าง → error 1 ข้อ', () => {
    expect(validateRequestInput(withField({ details: '   ' }))).toHaveLength(1);
  });

  test('ประเภทคำร้องนอกรายการ → error 1 ข้อ', () => {
    expect(validateRequestInput(withField({ requestType: 'ประเภทอื่น' }))).toHaveLength(1);
  });

  test.each([[], 123, 'ข้อความ'])(
    'input ผิดรูปแบบ %j → error 1 ข้อ',
    (input) => {
      expect(validateRequestInput(input)).toHaveLength(1);
    },
  );
});

describe('isValidStatus', () => {
  test('pending → true', () => {
    expect(isValidStatus('pending')).toBe(true);
  });

  test('in-progress → true', () => {
    expect(isValidStatus('in-progress')).toBe(true);
  });

  test('completed → true', () => {
    expect(isValidStatus('completed')).toBe(true);
  });

  test('done → false', () => {
    expect(isValidStatus('done')).toBe(false);
  });
});
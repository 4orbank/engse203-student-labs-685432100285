import { describe, test, expect } from 'vitest';
import { validateRequestInput, isValidStatus } from '../../src/validators/requestValidator.js';

/** Unit test — ทดสอบ pure function โดยตรง ไม่ต้องเปิด server ไม่ต้องมีฐานข้อมูล */
const valid = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'ห้อง 301',
  details: 'แอร์ไม่เย็นตั้งแต่เช้า',
  priority: 'normal',
};
const withField = (patch) => ({ ...valid, ...patch });

describe('validateRequestInput — ข้อมูลถูกต้อง', () => {
  test('ทุกช่องถูกต้อง → ไม่มี error', () => {
    expect(validateRequestInput(valid)).toEqual([]);
  });
});

describe('validateRequestInput — รายละเอียด (ค่าขอบ 10 ตัวอักษร)', () => {
  test('9 ตัวอักษร → error (ต่ำกว่าขอบ 1)', () => {
    expect(validateRequestInput(withField({ details: '123456789' }))).toHaveLength(1);
  });
  test('10 ตัวอักษร → ผ่าน (ตรงขอบพอดี)', () => {
    expect(validateRequestInput(withField({ details: '1234567890' }))).toEqual([]);
  });
  test('11 ตัวอักษร → ผ่าน (เกินขอบ 1)', () => {
    expect(validateRequestInput(withField({ details: '12345678901' }))).toEqual([]);
  });
  test('ช่องว่างล้วนถูกตัดทิ้งก่อนนับ → error', () => {
    expect(validateRequestInput(withField({ details: '            ' }))).toHaveLength(1);
  });
});

describe('validateRequestInput — ชื่อผู้แจ้ง (ค่าขอบ 2 ตัวอักษร)', () => {
  test('1 ตัวอักษร → error', () => {
    expect(validateRequestInput(withField({ requesterName: 'ก' }))).toHaveLength(1);
  });
  test('2 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(withField({ requesterName: 'กข' }))).toEqual([]);
  });
});

describe('validateRequestInput — ค่าที่ต้องอยู่ในรายการ', () => {
  test('ประเภทคำร้องนอกรายการ → error', () => {
    expect(validateRequestInput(withField({ requestType: 'แจ้งเหตุ' }))).toContain('ประเภทคำร้องไม่ถูกต้อง');
  });
  test.each(['normal', 'urgent'])('priority "%s" → ผ่าน', (priority) => {
    expect(validateRequestInput(withField({ priority }))).toEqual([]);
  });
  test('priority "high" → error', () => {
    expect(validateRequestInput(withField({ priority: 'high' }))).toHaveLength(1);
  });
});

describe('validateRequestInput — ข้อมูลผิดรูปแบบ', () => {
  test.each([null, undefined, 'text', 42, []])('input = %j → error เดียว', (input) => {
    expect(validateRequestInput(input)).toEqual(['ต้องส่งข้อมูลคำร้องมาด้วย']);
  });
  test('ผิดหลายช่องพร้อมกัน → ได้ error ครบทุกช่อง', () => {
    expect(validateRequestInput({})).toHaveLength(5);
  });
});

describe('isValidStatus', () => {
  test.each(['pending', 'in-progress', 'completed'])('"%s" → true', (s) => {
    expect(isValidStatus(s)).toBe(true);
  });
  test.each(['done', 'in progress', '', undefined])('%j → false', (s) => {
    expect(isValidStatus(s)).toBe(false);
  });
});

describe('CP48 — ตรวจค่าขอบสูงสุดและชนิดข้อมูล', () => {
  test('ชื่อผู้แจ้ง 100 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(withField({ requesterName: 'ก'.repeat(100) }))).toEqual([]);
  });
  test('ชื่อผู้แจ้ง 101 ตัวอักษร → ไม่ผ่าน', () => {
    expect(validateRequestInput(withField({ requesterName: 'ก'.repeat(101) })))
      .toContain('ชื่อผู้แจ้งต้องไม่เกิน 100 ตัวอักษร');
  });
  test('สถานที่ 100 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(withField({ location: 'ก'.repeat(100) }))).toEqual([]);
  });
  test('สถานที่ 101 ตัวอักษร → ไม่ผ่าน', () => {
    expect(validateRequestInput(withField({ location: 'ก'.repeat(101) })))
      .toContain('สถานที่ต้องไม่เกิน 100 ตัวอักษร');
  });
  test('รายละเอียด 1000 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(withField({ details: 'ก'.repeat(1000) }))).toEqual([]);
  });
  test('รายละเอียด 1001 ตัวอักษร → ไม่ผ่าน', () => {
    expect(validateRequestInput(withField({ details: 'ก'.repeat(1001) })))
      .toContain('รายละเอียดต้องไม่เกิน 1000 ตัวอักษร');
  });
  test.each(['requesterName', 'location', 'details'])(
    '%s เป็นตัวเลข → แจ้งว่าต้องเป็นข้อความ',
    (field) => {
      const labels = { requesterName: 'ชื่อผู้แจ้ง', location: 'สถานที่', details: 'รายละเอียด' };
      const errors = validateRequestInput(withField({ [field]: 123 }));
      expect(errors).toContain(`${labels[field]}ต้องเป็นข้อความ`);
    },
  );
});

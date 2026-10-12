/**
 * requestValidator.js — กฎตรวจข้อมูลคำร้อง เป็น "pure function"
 * CP48: ตรวจชนิดข้อมูลและค่าขอบสูงสุดของข้อความ
 */

export const REQUEST_TYPES = ['แจ้งซ่อม', 'บริการบัญชีผู้ใช้', 'ขอใช้อุปกรณ์', 'อื่น ๆ'];
export const PRIORITIES = ['normal', 'urgent'];
export const STATUSES = ['pending', 'in-progress', 'completed'];

export const MIN_NAME = 2;
export const MIN_DETAILS = 10;
export const MAX_NAME = 100;
export const MAX_LOCATION = 100;
export const MAX_DETAILS = 1000;

function checkText(value, label, { min = 1, max }) {
  if (typeof value !== 'string') {
    return `${label}ต้องเป็นข้อความ`;
  }

  const length = value.trim().length;
  if (length < min) {
    if (min === 1) return `กรุณาระบุ${label}`;
    return `${label}ต้องมีอย่างน้อย ${min} ตัวอักษร`;
  }
  if (length > max) {
    return `${label}ต้องไม่เกิน ${max} ตัวอักษร`;
  }
  return null;
}

export function validateRequestInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return ['ต้องส่งข้อมูลคำร้องมาด้วย'];
  }

  const errors = [];
  const nameError = checkText(input.requesterName, 'ชื่อผู้แจ้ง', {
    min: MIN_NAME,
    max: MAX_NAME,
  });
  if (nameError) errors.push(nameError);

  if (!REQUEST_TYPES.includes(input.requestType)) {
    errors.push('ประเภทคำร้องไม่ถูกต้อง');
  }

  const locationError = checkText(input.location, 'สถานที่', {
    max: MAX_LOCATION,
  });
  if (locationError) errors.push(locationError);

  const detailsError = checkText(input.details, 'รายละเอียด', {
    min: MIN_DETAILS,
    max: MAX_DETAILS,
  });
  if (detailsError) errors.push(detailsError);

  if (!PRIORITIES.includes(input.priority)) {
    errors.push('ความเร่งด่วนต้องเป็น normal หรือ urgent');
  }
  return errors;
}

/** สถานะที่ PUT /api/requests/:id รับได้ */
export function isValidStatus(status) {
  return STATUSES.includes(status);
}

/** ข้อมูลเข้าสู่ระบบ: ตรวจรูปแบบ ส่วนถูกหรือผิดให้ authService ตัดสิน */
export function validateLoginInput(input) {
  if (!input || typeof input !== 'object') return ['ต้องส่งอีเมลและรหัสผ่าน'];
  const errors = [];
  if (typeof input.email !== 'string' || !input.email.includes('@') || input.email.length > 254) {
    errors.push('รูปแบบอีเมลไม่ถูกต้อง');
  }
  if (typeof input.password !== 'string' || input.password.length === 0 || input.password.length > 200) {
    errors.push('กรุณาระบุรหัสผ่าน');
  }
  return errors;
}

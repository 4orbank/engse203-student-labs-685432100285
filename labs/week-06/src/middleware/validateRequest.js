const REQUEST_TYPES = ['แจ้งซ่อม', 'บริการบัญชีผู้ใช้', 'ขอใช้อุปกรณ์', 'อื่น ๆ'];
const PRIORITIES = ['normal', 'urgent'];

/** ตัวช่วยอ่านข้อความอย่างปลอดภัย — ให้มาแล้ว */
function readText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * TODO W06-M2 (CP04) · ตรวจ body ก่อนถึง controller
 *
 * เกณฑ์ที่ต้องตรวจ
 *   requesterName  ต้องยาวอย่างน้อย 2 ตัวอักษร
 *   requestType    ต้องอยู่ใน REQUEST_TYPES
 *   location       ต้องไม่ว่าง
 *   details        ต้องยาวอย่างน้อย 10 ตัวอักษร
 *   priority       ต้องอยู่ใน PRIORITIES
 *
 * ถ้าไม่ผ่าน → res.status(400).json({ error: '...', details: [รายการที่ผิด] })
 * ถ้าผ่าน   → next()
 *
 * ⚠ ใช้ readText() ตรวจ อย่าใช้ input.requesterName?.trim().length < 2
 *    เพราะถ้าค่าเป็น undefined จะได้ false แล้วหลุดผ่านไป
 */
export function validateRequest(req, res, next) {
  const { requesterName, requestType, location, details, priority } = req.body || {};
  const errors = [];

  if (readText(requesterName).length < 2) {
    errors.push('requesterName ต้องยาวอย่างน้อย 2 ตัวอักษร');
  }

  if (!REQUEST_TYPES.includes(requestType)) {
    errors.push('requestType ไม่ถูกต้อง');
  }

  if (readText(location).length === 0) {
    errors.push('location ต้องไม่ว่าง');
  }

  if (readText(details).length < 10) {
    errors.push('details ต้องยาวอย่างน้อย 10 ตัวอักษร');
  }

  if (!PRIORITIES.includes(priority)) {
    errors.push('priority ไม่ถูกต้อง');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'ข้อมูลไม่ถูกต้อง',
      details: errors
    });
  }

  next();
}
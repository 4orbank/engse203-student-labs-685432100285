import * as service from '../services/requestService.js';

/**
 * controller รู้จัก req/res และเป็นคนตัดสิน status code
 * แต่ไม่จัดการข้อมูลเอง — ให้ service ทำ
 */

/**
 * TODO W06-C1 (CP02) · GET /api/requests
 * - อ่าน req.query.status (ถ้ามี) ส่งต่อให้ service.findAll()
 * - ตอบ 200 พร้อมรายการ
 */
export function listRequests(req, res) {
  const requests = service.findAll({
    status: req.query.status
  });

  res.status(200).json(requests);
}

/**
 * TODO W06-C2 (CP02) · GET /api/requests/:id
 * - อ่านรหัสจาก req.params.id
 * - ไม่พบ → 404 พร้อมข้อความ · พบ → 200 พร้อมข้อมูล
 */
export function getRequest(req, res) {
  const request = service.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      error: 'ไม่พบคำร้อง'
    });
  }

  res.status(200).json(request);
}

/**
 * TODO W06-C3 (CP04) · POST /api/requests
 * - validateRequest middleware ตรวจ body มาให้แล้ว ตรงนี้เชื่อ req.body ได้เลย
 * - เรียก service.create() แล้วตอบ 201 พร้อมคำร้องที่สร้าง
 * ⚠ POST สำเร็จตอบ 201 ไม่ใช่ 200
 */
export async function createRequest(req, res) {
  const request = await service.create(req.body);
  res.status(201).json(request);
}

export function updateRequestStatus(req, res) {
  const allowedStatuses = ['pending', 'in-progress', 'completed'];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'สถานะไม่ถูกต้อง' });
  }

  const request = service.updateStatus(req.params.id, status);

  if (!request) {
    return res.status(404).json({ error: 'ไม่พบคำร้อง' });
  }

  res.status(200).json(request);
}

/**
 * TODO W06-C5 (CP05) · DELETE /api/requests/:id
 * - ไม่พบ → 404 · ลบสำเร็จ → 204 (ไม่มีข้อมูลส่งกลับ ใช้ res.status(204).end())
 */
export async function deleteRequest(req, res) {
  const deleted = await service.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      error: 'ไม่พบคำร้อง'
    });
  }

  res.status(204).send();
}

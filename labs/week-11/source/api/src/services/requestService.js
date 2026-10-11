import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { AppError } from '../middleware/errorHandler.js';
import { config } from '../config.js';


// Week 11 — SQLite Request Service
// ตำแหน่งฐานข้อมูลใช้ config.dbFile ซึ่งคำนวณจาก
// import.meta.url ผ่าน fileURLToPath() ใน config.js
// เพื่อให้ path ถูกต้องไม่ว่าจะรันโปรแกรมจากโฟลเดอร์ใด
let db;

// CP26–CP27: เปิดฐานข้อมูล SQLite
export async function loadSeed() {
  db = new DatabaseSync(config.dbFile);
  db.exec('PRAGMA foreign_keys = ON');

  const table = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table' AND name = 'requests'
  `).get();

  if (!table) {
    const schema = readFileSync(config.schemaFile, 'utf8');
    db.exec(schema);
  }

  // Challenge: สร้าง INDEX แม้ฐานข้อมูลมีตารางอยู่แล้ว
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_requests_status
    ON requests(status)
  `);
}

// SQL สำหรับคืนข้อมูลให้ตรงกับ Frontend
// SQL สำหรับคืนข้อมูลให้ตรงกับ Frontend
const SELECT_REQUESTS = `
  SELECT
    r.id,
    u.name AS requesterName,
    r.request_type AS requestType,
    r.location,
    r.details,
    r.priority,
    r.status
  FROM requests r
  JOIN users u ON r.requester_id = u.id
`;

// CP28: อ่านคำร้องทั้งหมดและกรองสถานะ
export function findAll({ status } = {}) {
  if (status) {
    return db.prepare(
      SELECT_REQUESTS + ' WHERE r.status = ? ORDER BY r.id'
    ).all(status);
  }

  return db.prepare(
    SELECT_REQUESTS + ' ORDER BY r.id'
  ).all();
}

// CP28: ค้นหาคำร้องจาก ID
export function findById(id) {
  return db.prepare(
    SELECT_REQUESTS + ' WHERE r.id = ?'
  ).get(id) ?? null;
}

// CP29: แปลงชื่อผู้แจ้งเป็น User ID
function resolveUserId(name) {
  const found = db.prepare(`
    SELECT id FROM users WHERE name = ?
  `).get(name);

  if (found) {
    return found.id;
  }

  const email = `user-${randomUUID()}@rmutl.ac.th`;

  const result = db.prepare(`
    INSERT INTO users (name, department, email)
    VALUES (?, ?, ?)
  `).run(name, 'ไม่ระบุ', email);

  return result.lastInsertRowid;
}

// CP32: แปลง SQLite Error เป็น HTTP Error
function toAppError(err) {
  const message = err.message ?? '';

  if (message.includes('FOREIGN KEY constraint failed')) {
    return new AppError('อ้างถึงข้อมูลที่ไม่มีอยู่จริง', 400);
  }

  if (message.includes('CHECK constraint failed')) {
    return new AppError('ค่าที่ส่งมาไม่อยู่ในรายการที่กำหนด', 400);
  }

  if (message.includes('UNIQUE constraint failed')) {
    return new AppError('ข้อมูลนี้มีอยู่แล้วในระบบ', 409);
  }

  if (message.includes('NOT NULL constraint failed')) {
    return new AppError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 400);
  }

  return err;
}

// CP29: เพิ่มคำร้องใหม่ลง SQLite
export function create(input) {
  db.exec('BEGIN IMMEDIATE');

  try {
    const requesterId = resolveUserId(input.requesterName);
    const id = `REQ-${randomUUID().toUpperCase()}`;

    db.prepare(`
      INSERT INTO requests (
        id,
        requester_id,
        request_type,
        location,
        details,
        priority,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      requesterId,
      input.requestType,
      input.location,
      input.details,
      input.priority ?? 'normal',
      'pending'
    );

    db.exec('COMMIT');
    return findById(id);
  } catch (error) {
    db.exec('ROLLBACK');
    throw toAppError(error);
  }
}

// CP30: อัปเดตสถานะคำร้อง
export function updateStatus(id, status) {
  const result = db.prepare(`
    UPDATE requests
    SET status = ?
    WHERE id = ?
  `).run(status, id);

  if (result.changes === 0) {
    return null;
  }

  return findById(id);
}

// CP30: ลบคำร้อง
export function remove(id) {
  const result = db.prepare(`
    DELETE FROM requests
    WHERE id = ?
  `).run(id);

  if (result.changes === 0) {
    return null;
  }

    return true;
}

// Challenge: อ่านรายชื่อผู้ใช้ทั้งหมดจาก SQLite
export function findUsers() {
  return db.prepare(`
    SELECT
      id,
      name,
      department,
      email
    FROM users
    ORDER BY id
  `).all();
}

// CP37 — ตรวจสอบความพร้อมของฐานข้อมูล SQLite
export function getDbStatus() {
  try {
    if (!db) {
      return {
        connected: false,
        reason: 'ยังไม่ได้เปิดฐานข้อมูล',
      };
    }

    const n = db.prepare(
      "SELECT COUNT(*) AS c FROM sqlite_master WHERE type = 'table'"
    ).get().c;

    return {
      connected: true,
      driver: 'sqlite',
      tables: n,
    };
  } catch (error) {
    return {
      connected: false,
      reason: error.message,
    };
  }
}
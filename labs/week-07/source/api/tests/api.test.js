
import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;

before(async () => {
  await loadSeed();
  app = createApp();
});

const validRequest = {
  requesterName: 'ทดสอบ ระบบ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

describe('Campus Service API', () => {
  test('1. GET /api/requests คืนรายการเป็น array และ status 200', async () => {
    const res = await request(app).get('/api/requests');

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  test('2. GET /api/requests/:id ที่มีอยู่ ตอบ 200', async () => {
    const res = await request(app).get('/api/requests/REQ-001');

    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'REQ-001');
  });

  test('3. GET /api/requests/:id ที่ไม่มี ตอบ 404', async () => {
    const res = await request(app).get('/api/requests/REQ-999');

    assert.equal(res.status, 404);
  });

  test('4. POST ข้อมูลถูกต้อง ตอบ 201 และ status เป็น pending', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send(validRequest);

    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'pending');
    assert.ok(res.body.id.startsWith('REQ-'));
  });

  test('5. POST ข้อมูลไม่ครบ ตอบ 400', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ requesterName: 'ทดสอบ' });

    assert.equal(res.status, 400);
  });

  test('6. API ตอบ CORS header สำหรับ origin ที่อนุญาต', async () => {
    const res = await request(app)
      .get('/api/requests')
      .set('Origin', 'http://localhost:5173');

    assert.equal(res.status, 200);
    assert.equal(
      res.headers['access-control-allow-origin'],
      'http://localhost:5173',
    );
  });
});
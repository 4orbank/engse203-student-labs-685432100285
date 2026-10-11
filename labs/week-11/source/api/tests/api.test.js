
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

describe('Week 10 - SQLite API Tests', () => {

  test('1. GET /api/requests returns 200 and array', async () => {
    const res = await request(app).get('/api/requests');

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  test('2. GET returns requesterName instead of requester_id', async () => {
    const res = await request(app).get('/api/requests');

    assert.equal(res.status, 200);
    assert.ok(res.body.length > 0);
    assert.ok('requesterName' in res.body[0]);
    assert.ok(!('requester_id' in res.body[0]));
  });

  test('3. GET existing request returns 200', async () => {
    const res = await request(app).get('/api/requests/REQ-001');

    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'REQ-001');
  });

  test('4. GET nonexistent request returns 404', async () => {
    const res = await request(app).get('/api/requests/REQ-999');

    assert.equal(res.status, 404);
  });

  test('5. POST valid request returns 201', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({
        requesterName: 'สมชาย ใจดี',
        requestType: 'แจ้งซ่อม',
        location: 'ห้องปฏิบัติการ 301',
        details: 'ทดสอบเพิ่มคำร้องจาก Automated Test',
        priority: 'normal'
      });

    assert.equal(res.status, 201);
    assert.ok(res.body.id);

    // ลบข้อมูลที่สร้างจากการทดสอบ
    const removed = await request(app)
      .delete(`/api/requests/${res.body.id}`);

    assert.equal(removed.status, 204);
  });

  test('6. POST incomplete request returns 400', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({
        requesterName: 'ทดสอบ'
      });

    assert.equal(res.status, 400);
  });

  test('7. SQL Injection through status does not bypass filter', async () => {
    const res = await request(app)
      .get('/api/requests')
      .query({ status: "' OR '1'='1" });

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, []);
  });

});

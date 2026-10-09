# API Contract — Campus Service Request

## 1. Base URL

```text
http://localhost:3001
```

## 2. Endpoints

### 2.1 GET /api/requests

**วัตถุประสงค์:** ดึงรายการคำร้องทั้งหมด

- Method: `GET`
- Request Body: ไม่มี
- Success Response: `200 OK`

ตัวอย่าง Response:

```json
[
  {
    "id": "REQ-001",
    "requesterName": "สมชาย",
    "title": "ขอใช้งานห้องประชุม",
    "status": "pending"
  }
]
```

หมายเหตุ: ตัวอย่างนี้แสดงเฉพาะฟิลด์หลัก รูปแบบข้อมูลจริงขึ้นอยู่กับ API ที่ใช้งาน

### 2.2 POST /api/requests

**วัตถุประสงค์:** สร้างคำร้องใหม่

- Method: `POST`
- Content-Type: `application/json`
- Success Response: ใช้รหัสสถานะและรูปแบบข้อมูลตามที่ API ส่งกลับ
- Error Response: `400 Bad Request` เมื่อข้อมูลไม่ถูกต้อง

ตัวอย่าง Request Body:

```json
{
  "requesterName": "สมชาย",
  "title": "ขอใช้งานห้องประชุม",
  "description": "ขอจองห้องสำหรับประชุมกลุ่ม"
}
```

### 2.3 GET /api/requests/:id

**วัตถุประสงค์:** ดูรายละเอียดคำร้องตาม ID

- Method: `GET`
- Path Parameter: `id` คือรหัสคำร้อง
- Success Response: `200 OK`
- Error Response: `404 Not Found` เมื่อไม่พบคำร้อง

ตัวอย่าง:

```text
GET /api/requests/REQ-001
```

### 2.4 PUT /api/requests/:id

**วัตถุประสงค์:** เปลี่ยนสถานะคำร้อง

- Method: `PUT`
- Path Parameter: `id` คือรหัสคำร้อง
- Content-Type: `application/json`
- Success Response: `200 OK`
- Error Response: `400 Bad Request` เมื่อสถานะไม่ถูกต้อง

ตัวอย่าง Request Body:

```json
{
  "status": "approved"
}
```

ค่าของ `status` ต้องเป็นค่าที่ API รองรับ

### 2.5 DELETE /api/requests/:id

**วัตถุประสงค์:** ลบคำร้องตาม ID

- Method: `DELETE`
- Path Parameter: `id` คือรหัสคำร้อง
- Success Response: ขึ้นอยู่กับการกำหนดของ API
- Error Response: `404 Not Found` เมื่อไม่พบคำร้อง

ตัวอย่าง:

```text
DELETE /api/requests/REQ-001
```

## 3. Error Response

เมื่อเกิดข้อผิดพลาด API จะส่งข้อมูลในรูปแบบ JSON เช่น

```json
{
  "error": "ข้อความอธิบายข้อผิดพลาด"
}
```

## 4. Notes

- Frontend เรียก API ผ่าน `apiClient.js`
- `requestService.js` เป็น Service Layer สำหรับเรียก endpoint
- API ใช้ Express และเปิดใช้งาน CORS ตามค่าจาก configuration
- ควรตรวจสอบ Response จริงจาก API เพื่อยืนยันชื่อฟิลด์และรายละเอียดของแต่ละ endpoint
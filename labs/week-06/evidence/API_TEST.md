# API_TEST — LAB 06

**ชื่อ–รหัส:** ธนาคาร ลือนาม 685432100285  
**วันที่ทดสอบ:** 5 ตุลาคม 2569

> บันทึกผลจริงที่เห็นจากการทดสอบ API

| # | Method | Path | ส่งอะไร | status ที่ควรได้ | status ที่ได้จริง | ผ่าน |
|---|---|---|---|---:|---:|---|
| 1 | GET | `/` | — | 200 | 200 | ☑ |
| 2 | GET | `/api/requests` | — | 200 | 200 | ☑ |
| 3 | GET | `/api/requests/REQ-001` | — | 200 | 200 | ☑ |
| 4 | GET | `/api/requests/REQ-999` | — | 404 | 404 | ☑ |
| 5 | POST | `/api/requests` | ข้อมูลครบถูกต้อง | 201 | 201 | ☑ |
| 6 | POST | `/api/requests` | `{"requesterName":"x"}` | 400 | 400 | ☑ |
| 7 | DELETE | `/api/requests/REQ-003` | — | 204 | 204 | ☑ |
| 8 | DELETE | `/api/requests/REQ-999` | — | 404 | 404 | ☑ |
| 9 | GET | `/api/unknown` | — | 404 | 404 | ☑ |

## ⭐ Challenge

| # | Method | Path | status ที่ควรได้ | ที่ได้จริง | ผ่าน |
|---|---|---|---:|---:|---|
| 10 | GET | `/api/requests?status=pending` | 200 | 200 | ☑ |
| 11 | PUT | `/api/requests/REQ-001` + `{"status":"in-progress"}` | 200 | 404 | ☐ |
| 12 | PUT | `/api/requests/REQ-001` + `{"status":"มั่ว"}` | 400 | 404 | ☐ |

## ทดสอบว่าข้อมูลอยู่ถาวร (CP08)

| ขั้น | ทำอะไร | ผลที่เห็น |
|---|---|---|
| 1 | POST เพิ่มคำร้องใหม่ | สร้าง `REQ-MUUZ3HE8-D290` สำเร็จ ตอบ 201 |
| 2 | GET ดูรายการ — เห็นคำร้องใหม่ไหม | พบ `REQ-MUUZ3HE8-D290` |
| 3 | Ctrl+C ปิดเซิร์ฟเวอร์ แล้วเปิดใหม่ | เปิด Server ใหม่สำเร็จที่ port 3001 |
| 4 | GET ดูรายการอีกครั้ง — คำร้องยังอยู่ไหม | ยังพบ `REQ-MUUZ3HE8-D290` ข้อมูลครบ |

## สรุปผล

- ผ่าน 9 / 9 รายการ
- Challenge ผ่าน 1 / 3 รายการ
- รายการที่ไม่ผ่าน: Challenge PUT 2 รายการ ซึ่งเป็นส่วนเสริม

## Screenshot ที่แนบ

- [ ] `images/postman-get-200.png`
- [ ] `images/postman-post-201.png`
- [ ] `images/terminal-logger.png`
# AI_USAGE — LAB 06

## ครั้งที่ 1

**ถามอะไร**
ถามเรื่องการแยกโครงสร้าง Express API เป็น routes, controllers และ services

**AI ตอบว่าอย่างไร (สรุปสั้น)**
แนะนำให้ routes ใช้กำหนด path และ method, controllers รับ request และส่ง response ส่วน services จัดการข้อมูลและ business logic

**ใช้ส่วนไหน / แก้เองตรงไหน**
นำแนวทางมาใช้จัดโครงสร้างไฟล์ `routes`, `controllers` และ `services` และแก้โค้ดให้ตรงกับ starter ของ LAB 06

**เข้าใจโค้ดที่ได้มาไหม**
☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 2

**ถามอะไร**
ถามเรื่อง middleware สำหรับ validation, logger, notFound และ errorHandler รวมถึงการบันทึกข้อมูลลงไฟล์ JSON

**AI ตอบว่าอย่างไร (สรุปสั้น)**
แนะนำให้ใช้ middleware แยกหน้าที่กัน และให้ service อ่าน/เขียน `data/requests.json` เพื่อให้ข้อมูลยังอยู่หลัง restart server

**ใช้ส่วนไหน / แก้เองตรงไหน**
นำแนวทางมาเขียนและปรับ `validateRequest.js`, `logger.js`, `errorHandler.js` และ `requestService.js` รวมถึงทดสอบ API และแก้โค้ดตามผลที่ได้จริง

**เข้าใจโค้ดที่ได้มาไหม**
☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## สรุป

* ส่วนที่เขียนเองทั้งหมด: การรันคำสั่ง ทดสอบ API และปรับแก้โค้ดให้ทำงานกับโปรเจกต์
* ส่วนที่ AI ช่วย: แนะนำโครงสร้าง Express API, middleware, error handling และ persistence
* ส่วนที่ยังไม่มั่นใจ: รายละเอียดบางส่วนของ Express middleware และการจัดการไฟล์แบบ asynchronous

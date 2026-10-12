# บันทึกการไล่ปัญหา (Debug Log)

🏫 **TODO W12-LOG (CP45 · CP47)** — แต่ละ bug ตอบ 6 ข้อ · เขียนสั้น ๆ แต่ต้องชัด

> BUG #0 ไม่มีผู้ใช้แจ้ง — คุณจะเจอเองตอนเขียน unit test ค่าขอบใน CP45
> BUG #1–#3 มาจาก `BUG_REPORTS.md`

---

## BUG #0 · Validator ปฏิเสธรายละเอียด 10 ตัวอักษรพอดี

- **อาการ:** รายละเอียด 10 ตัวอักษรถูกปฏิเสธ ทั้งที่กฎกำหนดว่าอย่างน้อย 10 ตัวอักษร
- **วิธีทำซ้ำ:** ส่งข้อมูลถูกต้องทุกช่อง โดยกำหนด details = '1234567890' แล้วรัน Unit Test TC-03
- **เครื่องมือ:** Vitest และ VS Code
- **สาเหตุ (ไฟล์:บรรทัด):** api/src/validators/requestValidator.js ในเงื่อนไขตรวจสอบ details ใช้ length <= MIN_DETAILS แทน length < MIN_DETAILS
- **วิธีแก้:** เปลี่ยนเครื่องหมาย <= เป็น < ในเงื่อนไขตรวจสอบรายละเอียด
- **test ที่กัน:** TC-03 ใน api/tests/unit/requestValidator.test.js ก่อนแก้ทดสอบผ่าน 27/28 หลังแก้ผ่าน 28/28

## BUG #1 · ลบคำร้องแล้วเพิ่มใหม่ ได้ 500

- **อาการ:** หลังลบคำร้อง REQ-003 แล้วสร้างคำร้องใหม่ ระบบตอบ HTTP 500 และไม่สามารถบันทึกข้อมูลได้
- **วิธีทำซ้ำ:** เปิด Dashboard ลบ REQ-003 โดยยังมี REQ-005 อยู่ จากนั้นสร้างคำร้องใหม่ผ่านหน้า New Request พบข้อผิดพลาด
- **เครื่องมือ:** VS Code Debugger, Breakpoint, Debug Console, Stack Trace และ Vitest
- **สาเหตุ (ไฟล์:บรรทัด):** api/src/services/requestService.js:99-103 ฟังก์ชัน nextId() ใช้ COUNT(*) + 1 ทำให้สร้างรหัส REQ-005 ซ้ำกับรายการที่มีอยู่
- **วิธีแก้:** เปลี่ยน nextId() ให้ใช้ MAX ของหมายเลขรหัสคำร้องแล้วบวก 1 แทนการนับจำนวนแถว
- **test ที่กัน:** BUG #1 ใน api/tests/integration/requests.api.test.js ก่อนแก้ผ่าน 33/34 หลังแก้ผ่าน 34/34

## BUG #2 · Dashboard แสดง "กำลังดำเนินการ 0"

- **อาการ:** Dashboard แสดงจำนวนกำลังดำเนินการเป็น 0 ทั้งที่มีคำร้องสถานะ in-progress อยู่
- **วิธีทำซ้ำ:** เปิดหน้า Dashboard พบ REQ-002 มีสถานะ in-progress แต่การ์ดกำลังดำเนินการแสดง 0
- **เครื่องมือ:** Safari Web Inspector (Network), curl, VS Code และ Vitest
- **สาเหตุ (ไฟล์:บรรทัด):** frontend/src/utils/requestSummary.js ในฟังก์ชัน summarizeRequests() ใช้ count('in progress') ซึ่งไม่ตรงกับค่า in-progress ที่ Backend ส่งมา
- **วิธีแก้:** เปลี่ยน count('in progress') เป็น count('in-progress')
- **test ที่กัน:** BUG #2 ใน frontend/src/utils/requestSummary.test.js ก่อนแก้ผ่าน 1/2 หลังแก้ผ่าน 2/2

## BUG #3 · เปลี่ยนสถานะคำร้องที่ไม่มีอยู่ ได้ 500

- **อาการ:** ส่ง PUT เพื่อเปลี่ยนสถานะคำร้องที่ไม่มีอยู่ ระบบตอบ HTTP 500 แทน HTTP 404
- **วิธีทำซ้ำ:** ส่ง PUT /api/requests/REQ-999 พร้อม JSON {"status":"completed"} พบว่า API ตอบ 500
- **เครื่องมือ:** curl, Terminal, Stack Trace และ Vitest
- **สาเหตุ (ไฟล์:บรรทัด):** api/src/controllers/requestController.js:30 เรียก updated.id ก่อนตรวจสอบว่า updated เป็น null หรือไม่
- **วิธีแก้:** ย้าย console.log() ไปหลัง if (!updated) เพื่อให้ระบบตอบ 404 เมื่อไม่พบคำร้อง
- **test ที่กัน:** BUG #3 ใน api/tests/integration/requests.api.test.js ก่อนแก้ผ่าน 32/33 หลังแก้ผ่าน 33/33

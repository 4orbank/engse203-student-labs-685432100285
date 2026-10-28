# Week 11 — Full-Stack Integration

## Architecture

ระบบ Campus Service แบ่งเป็น 3 ชั้น

1. Frontend: React และ Vite สำหรับแสดงผลและรับข้อมูลจากผู้ใช้
2. API: Node.js และ Express สำหรับจัดการ HTTP requests, validation และ business logic
3. Database: SQLite สำหรับจัดเก็บ users และ requests โดยเชื่อมโยงข้อมูลด้วย foreign key

## Run locally

### API
```bash
cd labs/week-11/source/api
npm ci
npm test
npm start
```

### Frontend
เปิด Terminal อีกหน้าต่างหนึ่ง

```bash
cd labs/week-11/source/frontend
npm ci
npm run build
npm run dev
```

Frontend ใช้ Vite development server ส่วน API ทำงานที่พอร์ต 3001 ตามค่าเริ่มต้น

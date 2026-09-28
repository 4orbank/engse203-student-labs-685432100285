# Week 05 — React Routing Data Fetching Mini App

## ภาพรวม

Campus Service Request ถูกแยกเป็นหลายหน้าและใช้ React Router จัดการ URL โดยใช้ HashRouter เพื่อให้ทำงานบน GitHub Pages ได้

## Component Flow

```text
HashRouter
└── App
    └── AppLayout
        ├── AppHeader
        └── Outlet
            ├── DashboardPage
            │   ├── SummaryPanel
            │   ├── FilterBar
            │   └── RequestList
            ├── NewRequestPage
            │   └── RequestForm
            ├── RequestDetailPage
            ├── AboutPage
            └── NotFoundPage
```

## Data Flow

```text
DashboardPage
    ↓ useEffect
requestService
    ├── requestStorage
    │   └── localStorage
    └── initialRequests.json
```

การอ่านข้อมูลและการเขียนข้อมูลอยู่ใน Service/Storage Layer ไม่ให้ component เรียก `fetch()` หรือ `localStorage` โดยตรง

## Routing

- `#/` → Dashboard
- `#/requests/new` → New Request
- `#/requests/:requestId` → Request Detail
- `#/about` → About
- เส้นทางอื่น → Not Found

## เหตุผลการออกแบบ

ใช้ `AppLayout` เป็น layout กลางเพื่อให้ header และโครงหน้าไม่ต้องเขียนซ้ำทุกหน้า และใช้ `Outlet` เป็นตำแหน่งสำหรับหน้า child route

ใช้ Service Layer แยกจาก UI เพื่อให้ component รับผิดชอบการแสดงผล ส่วนการโหลด เพิ่ม ลบ reset และ persistence อยู่ใน service

ข้อมูลใน localStorage ใช้ envelope ที่มี `schemaVersion`, `updatedAt` และ `requests` เพื่อให้ตรวจรูปแบบข้อมูลก่อนนำมาใช้ได้ และถ้าข้อมูลเสียหายจะโหลด seed กลับมาแทน

## useEffect Dependency Array

Dashboard ใช้ dependency array `[scenario, reloadKey]` เพราะข้อมูลต้องโหลดใหม่เมื่อ scenario ใน URL เปลี่ยน หรือเมื่อผู้ใช้กด retry ผ่าน `reloadKey`

Request Detail ใช้ `[requestId]` เพราะรายละเอียดต้องโหลดใหม่เมื่อ ID ใน URL เปลี่ยน

ทั้งสอง Effect มี cleanup guard เพื่อไม่ให้ผลลัพธ์จากการโหลดข้อมูลที่ไม่เกี่ยวข้องแล้วมา update state หลัง component ถูกถอดออก

## Week 05 Features

- React Router + HashRouter
- Dashboard / New Request / Request Detail / About / Not Found
- Loading / Success / Empty / Error / Retry
- Service Layer สำหรับ data fetching
- localStorage persistence
- schema validation และ recovery
- Add / Delete / Reset
- Responsive layout และ keyboard navigation

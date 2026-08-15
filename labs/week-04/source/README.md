# ENGSE203 LAB 4 — Campus Service Request

## ผู้จัดทำ

- ชื่อ–นามสกุล: กรุณากรอกก่อนส่ง
- รหัสนักศึกษา: กรุณากรอกก่อนส่ง
- Section: กรุณากรอกก่อนส่ง

## URLs

- Repository: กรุณากรอกหลัง push
- Pull Request: กรุณากรอกหลังเปิด PR
- GitHub Pages: กรุณากรอกหลัง deploy

## Component Tree

```text
App (state owner: requests, statusFilter)
├── AppHeader
├── SummaryPanel
├── RequestForm (local formData/errors/feedback state)
├── FilterBar
└── RequestList
    └── RequestCard
```

## Setup และ Run

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## State / Props / Callback Explanation

`App` owns `requests` and `statusFilter` because both are used by the summary, filter, form, and list. Props flow down as `summary`, `requests`, and filter values. Events flow back through `onAddRequest`, `onFilterChange`, and `onDeleteRequest`; App updates state immutably.

## Test Evidence

| Test ID | Actual Result | Pass/Fail | Evidence/Screenshot |
|---|---|---|---|
| TC-01 Initial | 3 initial requests and summary render | Pass | Manual browser check required |
| TC-02 Controlled input | Fields are controlled by form state | Pass | Manual browser check required |
| TC-03 Invalid | Errors display and no request is added | Pass | Capture validation screenshot |
| TC-04 Valid add | Pending request adds and form resets | Pass | Manual browser check required |
| TC-05 Filter | Status filter shows matching requests | Pass | Manual browser check required |
| TC-06 All | All filter restores all requests | Pass | Manual browser check required |
| TC-07 Empty | Empty message is shown for no matches | Pass | Capture empty-state screenshot |
| TC-08 Delete | Request deletes by id and summary updates | Pass | Manual browser check required |
| TC-09 Mobile | Responsive CSS supports 375px | Pending manual check | Capture mobile screenshot |
| TC-10 Keyboard | Labels, focus, errors, feedback are supported | Pending manual check | Manual keyboard check required |
| TC-11 Build | Production build completes | Pending build | Terminal output |
| TC-12 Pages | Deployment has not been published yet | Pending deployment | Capture Pages Incognito screenshot |

## Week 03 → Week 04 Reflection

Week 03 updates the page by selecting and mutating DOM elements directly. This LAB keeps request data in React state, then React renders the UI from that state. Adding, deleting, and filtering use immutable updates, so the summary and list remain consistent without manually changing each DOM element.

## AI / External Resource Disclosure

Used Codex for guidance and implementation support based on the course starter, React Beginner Bridge, and supplied class material. The implementation was checked with `npm run check` and manual browser verification remains required for the listed interaction and screenshot evidence.

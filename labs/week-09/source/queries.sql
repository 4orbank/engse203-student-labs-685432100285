-- ① คำร้องทั้งหมด เรียงตามรหัส
SELECT *
FROM requests
ORDER BY id;

-- ② คำร้องที่ยังไม่ได้ดำเนินการ
SELECT *
FROM requests
WHERE status = 'pending';

-- ③ คำร้องเร่งด่วนที่ยังไม่เสร็จ
SELECT *
FROM requests
WHERE priority = 'urgent'
  AND status != 'completed';

-- ④ ค้นคำร้องจากคำบางส่วนในรายละเอียด
SELECT *
FROM requests
WHERE details LIKE '%คอมพิวเตอร์%';

-- ⑤ คำร้องพร้อมชื่อผู้แจ้ง
SELECT requests.id, users.name, requests.request_type,
       requests.details, requests.status
FROM requests
JOIN users ON requests.requester_id = users.id;

-- ⑥ คำร้องเฉพาะของภาควิชาวิศวกรรมซอฟต์แวร์
SELECT requests.id, users.name, users.department,
       requests.details, requests.status
FROM requests
JOIN users ON requests.requester_id = users.id
WHERE users.department = 'วิศวกรรมซอฟต์แวร์';

-- ⑦ รายชื่อผู้แจ้งที่ไม่ซ้ำกัน
SELECT DISTINCT users.name
FROM users
JOIN requests ON users.id = requests.requester_id
ORDER BY users.name;

-- ⑧ คำร้อง 3 รายการล่าสุด
SELECT *
FROM requests
ORDER BY created_at DESC, id DESC
LIMIT 3;

-- ⑨ นับจำนวนคำร้องแยกตามสถานะ
SELECT status, COUNT(*) AS total_requests
FROM requests
GROUP BY status;

-- ⑩ ผู้แจ้งและจำนวนคำร้อง รวมผู้ที่ไม่เคยแจ้ง
SELECT users.name, COUNT(requests.id) AS total_requests
FROM users
LEFT JOIN requests ON users.id = requests.requester_id
GROUP BY users.id, users.name
ORDER BY total_requests DESC, users.name;

-- ⑪ สร้าง INDEX เพื่อให้ค้นด้วย status ได้เร็วขึ้น
CREATE INDEX IF NOT EXISTS idx_requests_status
ON requests(status);

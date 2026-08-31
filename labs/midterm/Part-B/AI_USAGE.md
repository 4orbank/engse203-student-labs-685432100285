# AI Usage Log — สอบกลางภาค

ชื่อ-รหัส: _______________

บันทึกทุกครั้งที่ใช้ AI ระหว่างสอบ

| เวลา | งาน (B1/B2/B3/B4) | ถาม AI ว่าอะไร | ใช้คำตอบส่วนไหน | แก้เอง/ตรวจสอบอย่างไร |
|---|---|---|---|---|
| |B1|ช่วยดูจุดผิดใน DashboardPage.jsx และช่วยอธิบายว่าควรแก้ตรงไหน|ใช้แนวทางแก้ตัวกรองสถานะ|รันโปรแกรมและตรวจสอบว่าการกรองแต่ละสถานะทำงานถูกต้อง|
| |B2|ช่วยทำช่องค้นหาและให้ค้นหาร่วมกับตัวกรองสถานะ|ใช้แนวทางสร้าง searchText และ filteredRequests|ทดลองค้นหาชื่อผู้แจ้งและรายละเอียด และลองใช้ร่วมกับตัวกรองสถานะ|
| |B3|ช่วยทำปุ่ม “ทำเสร็จ” และเชื่อมกับ updateRequestStatus|ใช้แนวทางเขียน handleMarkDone และส่ง onMarkDone ไปยัง RequestList / RequestCard|ใช้แนวทางเขียน handleMarkDone และส่ง onMarkDone ไปยัง RequestList / RequestCard|
|---|B4.1|ช่วยสร้าง PriorityBadge สำหรับแสดงระดับความเร่งด่วน|ใช้โครงสร้าง component และการตรวจค่า urgent / normal|ใช้โครงสร้าง component และการตรวจค่า urgent / normal|
|---|B4.2|ช่วยตรวจกรณี priority เป็นค่าอื่น|ใช้แนวทางเพิ่มกรณี priority-unknown|ทดสอบด้วยค่า high ชั่วคราว แล้วตรวจว่าแสดง “ไม่ระบุ” จากนั้นลบโค้ดทดสอบnpm run build|
|---|B4.3|ช่วยนำ PriorityBadge ไปใช้ใน RequestCard|ใช้ import PriorityBadge และส่ง request.priority เข้า component|ใช้ import PriorityBadge และส่ง request.priority เข้า component|

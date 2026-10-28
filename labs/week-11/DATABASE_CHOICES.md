# Database Choices

## 1. Why SQLite?
SQLite เหมาะกับโครงการนี้เพราะติดตั้งง่าย ไม่ต้องมี database server แยก และจัดเก็บข้อมูลในไฟล์เดียว รองรับ SQL, transactions และ foreign keys

## 2. Why not NoSQL?
ข้อมูล users และ requests มีความสัมพันธ์กันชัดเจน โดย requests อ้างอิง users ผ่าน requester_id จึงเหมาะกับ relational database และ JOIN

NoSQL อาจเหมาะกับข้อมูลที่มีโครงสร้างเปลี่ยนแปลงบ่อย แต่ไม่จำเป็นสำหรับโจทย์นี้

## 3. Why asynchronous operations?
การทำงานแบบ asynchronous ช่วยให้ Node.js จัดการงาน I/O ได้โดยไม่ต้องรอแต่ละงานให้เสร็จก่อน จึงเหมาะกับ API ที่ต้องรับหลาย requests

ทั้งนี้ SQLite อาจมีข้อจำกัดเมื่อมีการเขียนพร้อมกันจำนวนมาก จึงควรเลือกฐานข้อมูลตามลักษณะการใช้งานจริง

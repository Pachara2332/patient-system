# Patient Management System (Real-Time) 🏥

ระบบจัดการข้อมูลคนไข้แบบ Real-Time ด้วย Next.js และ WebSocket ที่ออกแบบมาเพื่อการซิงค์ข้อมูลระหว่าง "ฝั่งคนไข้" และ "ฝั่งเจ้าหน้าที่" โดยไม่มีอาการหน่วง (Zero-latency feel) พร้อมระบบ Debounce และเช็คสถานะการพิมพ์อัตโนมัติ

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)
![WebSocket](https://img.shields.io/badge/WebSocket-ws-blue)

## 📋 คำอธิบาย (Description)
โปรเจกต์นี้เป็นการจำลองสถานการณ์คลินิกหรือโรงพยาบาล ที่ต้องการให้เจ้าหน้าที่พยาบาลสามารถมองเห็นข้อมูลที่คนไข้กำลังกรอกอยู่ ณ วินาทีนั้นได้ทันที เพื่อลดเวลาการรอคอย และเตรียมพร้อมให้บริการ 

**ฟีเจอร์เด่น:**
- **Real-Time Data Sync:** ทันทีที่คนไข้พิมพ์ ข้อมูลจะไปเด้งที่จอเจ้าหน้าที่ทันที 
- **Typing Indicator (Status):** ฝั่งเจ้าหน้าที่จะรู้ได้ทันทีว่าคนไข้กำลังทำอะไรอยู่ผ่าน Status Badge
  - 🟢 **Active:** กำลังพิมพ์
  - 🟡 **Inactive:** หยุดพิมพ์เกิน 5 วินาที
  - 🔵 **Submitted:** กรอกเสร็จแล้ว
- **Late-Joiner Cache:** แม้เจ้าหน้าที่จะเปิดจอทีหลัง แต่ระบบจะส่งข้อมูลที่คนไข้พิมพ์ทิ้งไว้มาแสดงผลให้ทันที (ไม่เกิดอาการจอดำหรือ Waiting ค้าง)
- **Debounce Optimization:** มีการหน่วงเวลาส่งข้อมูล 300ms เพื่อป้องกันการยิง Request รัวๆ ไปทำร้าย Server

---

## 🚀 การติดตั้ง (Installation)

โปรเจกต์นี้ใช้ `npm` หรือ `yarn` ในการจัดการแพ็กเกจ

1. **โคลนโปรเจกต์ (Clone the repository)**
```bash
git clone https://github.com/your-username/patient-system.git
cd patient-system
```

2. **ติดตั้ง Dependencies**
```bash
npm install
```

3. **รันเซิร์ฟเวอร์ (Development Server)**
```bash
npm run dev
```
> คำสั่ง `npm run dev` ถูกตั้งค่ามาให้รันทั้ง **Next.js (Port 3000)** และ **WebSocket Server (Port 3001)** ควบคู่กันอัตโนมัติด้วยคำสั่ง `concurrently`

---

## 💻 วิธีใช้งาน (Usage)

หลังจากรันเซิร์ฟเวอร์เสร็จเรียบร้อยแล้ว:

1. **เปิดเบราว์เซอร์ 2 หน้าต่างคู่กัน (ซ้าย-ขวา)**
2. ฝั่งซ้าย (คนไข้) เปิดลิงก์: [http://localhost:3000/patient](http://localhost:3000/patient)
3. ฝั่งขวา (เจ้าหน้าที่) เปิดลิงก์: [http://localhost:3000/staff](http://localhost:3000/staff)
4. ลองพิมพ์ข้อมูลอะไรก็ได้ในหน้าคนไข้ฝั่งซ้าย จะสังเกตเห็นว่าข้อมูลฝั่งขวาอัปเดตตามทันที พร้อมมีสถานะ **Active** เด้งขึ้นมา

---

## 🏗 โครงสร้างโค้ดที่สำคัญ (Architecture)

- `ws-server.js` - สคริปต์ Node.js เพียวๆ ที่ทำหน้าที่ตั้งรับ WebSocket และแจกจ่ายข้อมูล (Broadcast) พร้อมเก็บ State Cache
- `app/patient/page.tsx` - หน้าจอคนไข้ จัดการเรื่อง Form Validation, Debounce timeout และสถานะ Inactive
- `app/staff/page.tsx` - หน้าจอเจ้าหน้าที่ คอยรับข้อมูล (Listen) และแสดงผล UI ตามข้อมูลและสถานะล่าสุด

---

## 👨‍💻 ข้อมูลเพิ่มเติม (Contributing/Authors)
โปรเจกต์นี้เป็นส่วนหนึ่งของการพัฒนาและทดสอบทักษะการเขียน Web Application ด้วย Modern Stack 
หากมีข้อเสนอแนะหรือพบเจอบั๊ก สามารถเปิด Issue ได้เลยครับ

## 📄 License
[MIT License](https://opensource.org/licenses/MIT) - สามารถนำโค้ดไปศึกษาและดัดแปลงใช้งานได้อย่างอิสระ

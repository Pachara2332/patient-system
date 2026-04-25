# Patient Management System (Real-Time) 🏥
https://patient-system-production-8241.up.railway.app/


ระบบจัดการข้อมูลคนไข้แบบ Real-Time ด้วย **Next.js**, **Tailwind CSS** และ **WebSocket**  
ออกแบบมาเพื่อการซิงค์ข้อมูลระหว่าง **ฝั่งคนไข้** และ **ฝั่งเจ้าหน้าที่** โดยไม่มีอาการหน่วง  
พร้อมระบบ Debounce, Typing Indicator และเช็คสถานะการพิมพ์อัตโนมัติ

![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)
![WebSocket](https://img.shields.io/badge/WebSocket-ws-blue)
![Deploy](https://img.shields.io/badge/Deploy-Railway-blueviolet)

---

## 📋 คำอธิบาย (Description)

โปรเจกต์นี้เป็นการจำลองสถานการณ์คลินิกหรือโรงพยาบาล ที่ต้องการให้เจ้าหน้าที่สามารถมองเห็นข้อมูลที่คนไข้กำลังกรอกอยู่ ณ วินาทีนั้นได้ทันที เพื่อลดเวลาการรอคอย และเตรียมพร้อมให้บริการ

### ฟีเจอร์เด่น

- **Real-Time Data Sync:** ทันทีที่คนไข้พิมพ์ ข้อมูลจะไปเด้งที่จอเจ้าหน้าที่ทันที
- **Typing Indicator (Status Badge):** ฝั่งเจ้าหน้าที่จะรู้ได้ทันทีว่าคนไข้กำลังทำอะไรอยู่
  - 🟢 **Active** — กำลังพิมพ์
  - 🟡 **Inactive** — หยุดพิมพ์เกิน 5 วินาที
  - 🔵 **Submitted** — กรอกเสร็จแล้ว
- **Late-Joiner Cache:** แม้เจ้าหน้าที่จะเปิดจอทีหลัง ระบบจะส่งข้อมูลล่าสุดมาแสดงผลให้ทันที
- **Debounce Optimization:** หน่วงเวลาส่งข้อมูล 300ms ป้องกันการยิง Request รัวๆ
- **Auto Reconnect:** หากขาดการเชื่อมต่อ ระบบจะพยายามเชื่อมต่อใหม่อัตโนมัติทุก 3 วินาที
- **Ping/Pong Keep-Alive:** ป้องกันการถูกตัดเชื่อมต่อจาก Proxy (ทุก 25 วินาที)
- **Form Validation:** ตรวจสอบความถูกต้องของข้อมูล (ชื่อ, นามสกุล, อายุ, อีเมล, เบอร์โทร, ที่อยู่)

---

## 🏗 สถาปัตยกรรม (Architecture)

```
Patient (Browser)          Staff (Browser)
       |                         ▲
       | WebSocket (/ws)         | WebSocket (/ws)
       ▼                         |
  ┌──────────────────────────────────┐
  │         server.js                │
  │  ┌────────────┐ ┌─────────────┐  │
  │  │  Next.js   │ │  WebSocket  │  │
  │  │  (HTTP)    │ │  Server     │  │
  │  └────────────┘ └─────────────┘  │
  │         Single Port (PORT)       │
  └──────────────────────────────────┘
```

**Data Flow:**
1. คนไข้พิมพ์ข้อมูลในฟอร์ม
2. ข้อมูลถูก Debounce (300ms) แล้วส่งผ่าน WebSocket ไปยัง Server
3. Server เก็บ Cache แล้ว Broadcast ให้ทุก Client ที่เชื่อมต่ออยู่
4. หน้าจอเจ้าหน้าที่รับข้อมูล → อัปเดต State → แสดงผลทันที

---

## 📁 โครงสร้างไฟล์ที่สำคัญ

```
patient-system/
├── server.js              # Custom Server: รวม Next.js + WebSocket ไว้ในพอร์ตเดียว (Production)
├── ws-server.js           # WebSocket Server แยก (Development, Port 3001)
├── app/
│   ├── page.tsx           # หน้าแรก: Portal เลือกเข้าฝั่งคนไข้หรือเจ้าหน้าที่
│   ├── patient/page.tsx   # หน้าคนไข้: ฟอร์มกรอกข้อมูล + ส่ง WebSocket
│   └── staff/page.tsx     # หน้าเจ้าหน้าที่: แสดงข้อมูล Real-Time + Status Badge
├── components/
│   ├── Form.tsx           # คอมโพเนนต์ฟอร์ม: Validation + onChange callback
│   └── PatientStatus.tsx  # คอมโพเนนต์ Badge สถานะ (Active/Inactive/Submitted)
└── package.json
```

---

## 🚀 การติดตั้ง (Installation)

1. **โคลนโปรเจกต์**
```bash
git clone https://github.com/your-username/patient-system.git
cd patient-system
```

2. **ติดตั้ง Dependencies**
```bash
npm install
```

3. **รันเซิร์ฟเวอร์ (Development)**
```bash
npm run dev
```
> คำสั่งนี้จะรัน Next.js (Port 3000) และ WebSocket Server (Port 3001) ควบคู่กันอัตโนมัติ

---

## 💻 วิธีใช้งาน (Usage)

1. เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)
2. กดการ์ด **Patient Portal** → เปิดแท็บใหม่สำหรับกรอกข้อมูล
3. กดการ์ด **Staff Dashboard** → เปิดแท็บใหม่สำหรับดูข้อมูล Real-Time
4. ลองพิมพ์ข้อมูลในหน้าคนไข้ แล้วสังเกตหน้าเจ้าหน้าที่จะอัปเดตตามทันที

---

## 🌐 การ Deploy (Railway)

โปรเจกต์นี้ใช้ `server.js` (Custom Server) รวม Next.js + WebSocket ไว้ในพอร์ตเดียว เพื่อรองรับ Platform อย่าง Railway ที่เปิดได้แค่ 1 พอร์ต

```bash
npm run build    # Build Next.js
npm run start    # รัน server.js (Production)
```

**แนะนำ:** ตั้ง Region ของ Railway เป็น `asia-southeast1` (Singapore) เพื่อความเร็วสำหรับผู้ใช้ในประเทศไทย

---

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|---|---|---|
| Next.js | 16.2 | Frontend Framework (App Router) |
| React | 19.2 | UI Library |
| Tailwind CSS | 4.0 | Styling |
| ws | 8.x | WebSocket Server |
| concurrently | 9.x | รัน Dev Server คู่กัน |
| TypeScript | 5.x | Type Safety |

---

## 👨‍💻 ผู้พัฒนา (Author)

โปรเจกต์นี้เป็นส่วนหนึ่งของการพัฒนาและทดสอบทักษะ Web Application ด้วย Modern Stack  
หากมีข้อเสนอแนะหรือพบเจอบั๊ก สามารถเปิด Issue ได้เลยครับ

## 📄 License

[MIT License](https://opensource.org/licenses/MIT) — สามารถนำโค้ดไปศึกษาและดัดแปลงใช้งานได้อย่างอิสระ

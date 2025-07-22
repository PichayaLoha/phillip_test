# PhillipTest Project

โครงการนี้ประกอบด้วยส่วน Backend ที่พัฒนาด้วย Node.js และส่วน Frontend ที่พัฒนาด้วย React.

## โครงสร้างโปรเจกต์

```
PhillipTest/
├── backend/          # ส่วน Backend (Node.js)
└── frontend/         # ส่วน Frontend (React)
```

## การตั้งค่าและรันโปรเจกต์

### 1. Backend (Node.js)

1.  เข้าไปยังไดเรกทอรี `backend`:
    ```bash
    cd backend
    ```

2.  ติดตั้ง Dependencies:
    ```bash
    npm install
    ```

3.  ตั้งค่าฐานข้อมูล (ถ้ามี):
    ตรวจสอบไฟล์ `backend/database/database.sql` และ `backend/config/config.js` สำหรับการตั้งค่าฐานข้อมูล

4.  รัน Backend Server:
    ```bash
    node app.js
    # หรือใช้ nodemon ถ้าติดตั้งไว้
    # nodemon app.js
    ```
    Backend จะรันอยู่ที่ `http://localhost:3000` (หรือพอร์ตที่กำหนดใน `config.js`)

### 2. Frontend (React)

1.  เข้าไปยังไดเรกทอรี `frontend`:
    ```bash
    cd frontend
    ```

2.  ติดตั้ง Dependencies:
    ```bash
    npm install
    ```

3.  รัน Frontend Application:
    ```bash
    npm start
    ```
    Frontend จะเปิดขึ้นมาในเบราว์เซอร์ที่ `http://localhost:3001` (หรือพอร์ตเริ่มต้นของ React)
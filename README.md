# พ่อบ้านเทียบราคา (phobaan-price-compare)

เว็บแอปเทียบราคาสินค้าใช้ในบ้านต่อหน่วย (บาท/ลิตร หรือ บาท/กก.) เพื่อหาตัวเลือกที่คุ้มที่สุด
สร้างด้วย React + Vite

## รันบนเครื่อง

```bash
npm install
npm run dev        # เปิด http://localhost:3000
```

## Build

```bash
npm run build      # ผลลัพธ์อยู่ในโฟลเดอร์ dist/
npm run preview    # ทดลองเปิดไฟล์ที่ build แล้ว
```

## Deploy ขึ้น GitHub Pages

1. Merge โค้ดเข้า branch `main`
2. ไปที่ **Settings → Pages → Build and deployment → Source** แล้วเลือก **GitHub Actions**
3. Workflow `.github/workflows/deploy.yml` จะ build และ deploy ให้อัตโนมัติทุกครั้งที่ push เข้า `main`
4. เว็บจะอยู่ที่ `https://<username>.github.io/phobaan-price-compare/`

## โครงสร้างไฟล์

```
index.html          หน้า HTML หลัก
src/main.jsx        จุดเริ่มของ React
src/App.jsx         ตรรกะและหน้าจอเทียบราคา
src/styles.css      สไตล์ทั้งหมด
vite.config.js      ตั้งค่า Vite
```

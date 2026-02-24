# 🚀 PANDUAN SETUP & INSTALASI - FRONTEND TOKO BUKU

## 📋 Checklist Persiapan

Sebelum memulai, pastikan Anda sudah memiliki:

- ✅ Node.js >= 14 (download dari https://nodejs.org)
- ✅ npm atau yarn package manager
- ✅ Backend Toko Buku sudah berjalan
- ✅ Git atau terminal/command prompt
- ✅ Text editor atau IDE (VS Code)

---

## 1️⃣ Download & Setup Project

### Step 1: Clone/Extract Project
```bash
# Jika pakai Git
git clone <repository-url>
cd FRONTEND

# Atau jika sudah extract folder
cd "c:\TOKO BUKU 1\FRONTEND"
```

### Step 2: Install Dependencies
```bash
npm install
```

**Tunggu proses selesai (±2-3 menit)**

Ini akan menginstall semua package yang diperlukan di folder `node_modules/`

### Step 3: Verify Installation
```bash
npm --version
node --version
```

Pastikan output menunjukkan versi Node & npm.

---

## 2️⃣ Konfigurasi Environment

### Edit File `.env`

Pastikan file `.env` di root folder FRONTEND berisi:

```env
REACT_APP_API_URL=http://localhost:4000
```

**Catatan:**
- Port default backend adalah 4000
- Jika backend berjalan di port lain, sesuaikan disini
- Jangan ganti `REACT_APP_` prefix, ini dikenali React

---

## 3️⃣ Jalankan Backend (Penting!)

Sebelum menjalankan frontend, pastikan backend sudah berjalan:

```bash
# Di folder UKTAPI
cd "c:\TOKO BUKU 1\UKTAPI"
npm start

# Output yang diharapkan:
# ✅ Server berjalan di: http://localhost:4000
```

**Jangan tutup terminal backend!**

---

## 4️⃣ Jalankan Frontend

Buka terminal/command prompt yang baru (jangan tutup yang backend):

```bash
# Navigate ke folder FRONTEND
cd "c:\TOKO BUKU 1\FRONTEND"

# Start development server
npm start
```

**Tunggu process selesai (±1-2 menit)**

Output yang diharapkan:
```
Compiled successfully!

You can now view toko-buku-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://YOUR-IP:3000
```

Aplikasi akan otomatis membuka di browser → http://localhost:3000

---

## 5️⃣ Login ke Aplikasi

### Gunakan Demo Credentials:
```
Username: user
Password: 12345
```

Setelah login, Anda akan melihat Dashboard.

---

## ⚙️ Troubleshooting

### ❌ Error: "npm command not found"
**Solusi:**
1. Install Node.js dari https://nodejs.org
2. Restart terminal/command prompt
3. Cek: `npm --version`

### ❌ Error: "Port 3000 already in use"
**Solusi:**
```bash
# Gunakan port lain
PORT=3001 npm start

# Akses di http://localhost:3001
```

### ❌ Error: "Cannot connect to backend"
**Solusi:**
1. Pastikan backend berjalan: `http://localhost:4000`
2. Cek konfigurasi `.env` sudah benar
3. Restart frontend & backend

### ❌ Error: "Module not found"
**Solusi:**
```bash
# Clear cache & reinstall
rm -rf node_modules package-lock.json
npm install
```

### ❌ Blank page atau "compilation error"
**Solusi:**
1. Buka browser DevTools (F12)
2. Cek console untuk error messages
3. Restart frontend: Ctrl+C lalu `npm start`

### ❌ Login gagal "Username atau password salah"
**Solusi:**
1. Pastikan username: `user` dan password: `12345`
2. Pastikan backend sudah berjalan
3. Cek network tab di DevTools untuk API errors

---

## 📦 Struktur Folder Penting

Setelah npm install, folder akan berisi:

```
FRONTEND/
├── node_modules/          ← Dependencies (auto-generated)
├── public/                ← Static files & index.html
├── src/                   ← Source code
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── App.js
│   └── index.js
├── .env                   ← Environment configuration
├── .gitignore            ← Git ignore file
├── package.json          ← Dependencies definition
└── README.md             ← Project description
```

---

## 🔗 Backend-Frontend Integration

Frontend akan otomatis terhubung ke backend melalui API:

```
Frontend (http://localhost:3000)
    ↓
Axios HTTP Client
    ↓
Backend API (http://localhost:4000)
    ↓
Database
```

Semua request otomatis menambahkan JWT token di header.

---

## 📚 File Dokumentasi

Baca dokumentasi sesuai kebutuhan:

| File | Untuk | Pembaca |
|------|-------|---------|
| `README.md` | Overview & quick start | Everyone |
| `RINGKASAN.md` | Summary fitur & cara pakai | Product Owner |
| `DOKUMENTASI.md` | Dokumentasi lengkap fitur | End User |
| `DEVELOPMENT.md` | Panduan development & code | Developer |
| `SETUP.md` (file ini) | Panduan instalasi | DevOps/Setup |

---

## 🎯 Apa Selanjutnya?

### Untuk User/Admin:
1. Baca `DOKUMENTASI.md`
2. Mulai gunakan aplikasi

### Untuk Developer:
1. Baca `DEVELOPMENT.md`
2. Mulai develop fitur baru

### Untuk DevOps:
1. Setup di production server
2. Build: `npm run build`
3. Deploy folder `/build`

---

## 🔍 Verify Installation

Untuk memastikan setup berhasil:

### 1. Check Frontend Running
- Buka: http://localhost:3000
- Harus ada halaman login

### 2. Check Backend Running
- Buka: http://localhost:4000/api-docs
- Harus ada Swagger documentation

### 3. Check API Connection
- Buka DevTools (F12) → Network tab
- Login dengan username/password
- Cek apakah ada request ke `/auth/login`
- Response harus 200 OK dengan token

### 4. Check Local Storage
- Buka DevTools → Application → Local Storage
- Check ada item `accessToken`, `user`, etc

---

## 💾 Useful Commands

```bash
# Development
npm start              # Run dev server
npm test              # Run tests

# Production
npm run build         # Build optimized

# Maintenance
npm install           # Install dependencies
npm update            # Update dependencies
npm outdated          # Check outdated packages

# Cleanup
npm cache clean --force   # Clear npm cache
rm -rf node_modules       # Remove node_modules
```

---

## 🚨 Important Notes

⚠️ **DO:**
- Keep `.env` file in git ignore
- Use `npm install` not `npm install --save` for new packages
- Test di development sebelum production
- Keep dependencies updated

⚠️ **DON'T:**
- Don't commit `node_modules` folder
- Don't change `.env` di production secara manual
- Don't run `npm eject` (permanent!)
- Don't share credentials di code

---

## 📞 Getting Help

Jika ada masalah:

1. Cek error message di console
2. Google error message
3. Cek dokumentasi file
4. Hubungi tim developer

---

## ✅ Setup Complete!

Jika semua langkah berhasil, Anda sudah siap:

✅ Frontend berjalan di localhost:3000
✅ Backend berjalan di localhost:4000
✅ Database terhubung
✅ Dapat login dengan demo account
✅ Dapat mengakses semua fitur

**Selamat! Sekarang Anda siap menggunakan atau mengembangkan aplikasi Toko Buku!** 🎉

---

**Last Updated:** 4 Februari 2026  
**Version:** 1.0.0

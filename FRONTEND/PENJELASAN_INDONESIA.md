# 📚 PENJELASAN FRONTEND TOKO BUKU DALAM BAHASA INDONESIA

## 🎯 Ringkasan untuk Pemula

Saya telah membuat **aplikasi frontend (bagian depan) untuk Toko Buku** menggunakan React.

### Apa itu Frontend?
Frontend adalah bagian yang **dilihat dan digunakan oleh pengguna**. Kalau sistem Toko Buku diibaratkan toko fisik:
- **Backend** = gudang dengan sistem manajemen
- **Frontend** = tampilan toko di depan yang ramah dan mudah digunakan

### Apa yang sudah saya buat?
Sebuah aplikasi web yang memungkinkan:
- Manager dapat mengelola buku, kategori, dan pengguna
- Kasir dapat membuat pesanan
- User dapat melihat data mereka

---

## 📁 Struktur Folder (Explanation)

```
FRONTEND/                  ← Folder utama aplikasi
├── src/                   ← Kode sumber aplikasi
│   ├── components/        ← Bagian-bagian kecil UI (header, alert, dll)
│   ├── pages/            ← Halaman-halaman besar (login, dashboard, dll)
│   ├── services/         ← Koneksi ke backend API
│   └── context/          ← Penyimpanan data global (login info)
├── public/               ← File statis (index.html)
├── package.json          ← Daftar library yang digunakan
├── .env                  ← Konfigurasi (URL backend)
└── Documentation/        ← File panduan
```

---

## 📄 Apa Isi Setiap Folder?

### **src/components/**
Bagian-bagian kecil UI yang bisa dipakai berkali-kali:
- `Header.js` = Menu navigasi di atas halaman
- `Common.js` = Loading, Alert, Layout
- `ProtectedRoute.js` = Proteksi halaman yang memerlukan login

### **src/pages/**
Halaman-halaman besar aplikasi:
- `LoginPage.js` = Halaman login
- `DashboardPage.js` = Halaman utama setelah login
- `BooksPage.js` = Halaman manajemen buku
- `CategoriesPage.js` = Halaman kategori (manager only)
- `UsersPage.js` = Halaman pengguna (manager only)
- `OrdersPage.js` = Halaman pesanan (kasir only)
- `ProfilePage.js` = Halaman profil user

### **src/services/**
Tempat komunikasi dengan backend:
- `api.js` = Konfigurasi koneksi ke API backend

### **src/context/**
Penyimpanan data yang bisa diakses dari mana saja:
- `AuthContext.js` = Menyimpan data login user

---

## 🔄 Alur Kerja (Bagaimana Cara Kerjanya?)

### Alur Login
```
1. User buka aplikasi di browser
   ↓
2. Tampil halaman login (LoginPage.js)
   ↓
3. User input username & password
   ↓
4. Klik tombol Login
   ↓
5. Aplikasi kirim data ke backend (API)
   ↓
6. Backend verifikasi, kembalikan token (semacam kunci)
   ↓
7. Token disimpan di browser (localStorage)
   ↓
8. User berhasil login, diarahkan ke Dashboard
```

### Alur Akses Halaman
```
1. User klik menu "Buku"
   ↓
2. Aplikasi check apakah user sudah login (ada token?)
   ↓
3. Ada token? → Tampilkan halaman Buku
   Tidak ada token? → Arahkan ke halaman Login
   ↓
4. Halaman Buku tampil dengan data dari backend
```

### Alur Fetch Data
```
1. Halaman load, butuh data buku
   ↓
2. Axios (HTTP client) mengirim permintaan
   ↓
3. Otomatis menambahkan token ke permintaan
   ↓
4. Kirim ke backend: "Berikan data buku!"
   ↓
5. Backend cek token valid, kirim data
   ↓
6. Aplikasi terima data, simpan di state
   ↓
7. Halaman update, tampilkan data buku
```

---

## 🔐 Fitur Keamanan (Bagaimana Aman?)

### 1. JWT Token (Kunci Akses)
- Setiap user login, backend berikan token
- Token ini dipakai untuk akses halaman protected
- Token simpan di browser (secure)
- Token dikirim otomatis ke setiap request

### 2. Protected Routes (Halaman Terlindungi)
- Halaman tertentu hanya bisa diakses jika sudah login
- Kalau belum login, otomatis redirect ke halaman login

### 3. Role-Based Access (Akses Berdasar Peran)
- Manager: bisa akses semua menu
- Kasir: hanya bisa akses Buku & Pesanan
- Pelanggan: akses terbatas

### 4. Auto Token Refresh (Refresh Token Otomatis)
- Token diberikan waktu kadaluarsa (expired)
- Aplikasi otomatis refresh token
- User tidak perlu login ulang

### 5. Auto Logout (Logout Otomatis)
- Jika token sudah expired dan tidak bisa refresh
- User otomatis di-logout
- Diarahkan ke halaman login

---

## 📊 Halaman-Halaman yang Ada

### **Halaman Login** (LoginPage.js)
```
┌─────────────────────────┐
│   HALAMAN LOGIN         │
├─────────────────────────┤
│ Username: [_______]     │
│ Password: [_______]     │
│ [  TOMBOL LOGIN  ]      │
└─────────────────────────┘
```

### **Halaman Dashboard** (DashboardPage.js)
```
┌──────────────────────────────────────┐
│   Selamat Datang, John!              │
├──────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐    │
│ │ 150    │ │  45    │ │ 50JT   │    │
│ │Buku    │ │Pesanan │ │Pendapat│    │
│ └────────┘ └────────┘ └────────┘    │
├──────────────────────────────────────┤
│ Akses Cepat:                         │
│ • Manajemen Buku                     │
│ • Manajemen Pesanan                  │
│ • dll                                │
└──────────────────────────────────────┘
```

### **Halaman Buku** (BooksPage.js)
```
┌─────────────────────────────────────────┐
│   [+ TAMBAH BUKU BARU]                  │
├─────────────────────────────────────────┤
│ ID │ Judul      │ Pengarang  │ Harga   │
├────┼────────────┼────────────┼─────────┤
│ 1  │ Novel Keren│ Penulis X  │ 50.000  │
│ 2  │ Buku Sains │ Penulis Y  │ 75.000  │
│    │ [Edit][Del]│            │         │
└─────────────────────────────────────────┘
```

### **Halaman Pesanan** (OrdersPage.js)
```
┌──────────────────────────────────────┐
│  [+ BUAT PESANAN BARU]               │
├──────────────────────────────────────┤
│ No │ Tanggal    │ Total   │ Status   │
├────┼────────────┼─────────┼──────────┤
│ 1  │ 01-01-2026 │ 150.000 │ Selesai  │
│ 2  │ 02-01-2026 │ 200.000 │ Pending  │
│    │ [Detail]   │         │          │
└──────────────────────────────────────┘
```

---

## 🔌 Integrasi dengan Backend (Bagaimana Konek?)

### Setup:
1. Frontend berjalan di: **http://localhost:3000**
2. Backend berjalan di: **http://localhost:4000**
3. File `.env` sudah config URL backend

### Cara Komunikasi:
```
Frontend Request:
GET http://localhost:4000/books

Backend Response:
{
  "data": [
    { "id": 1, "title": "Buku 1", "price": 50000 },
    { "id": 2, "title": "Buku 2", "price": 75000 }
  ]
}

Frontend:
Terima data → Simpan di state → Tampilkan di halaman
```

---

## 📦 Teknologi yang Digunakan (Apa saja?)

### **React** (Framework utama)
Digunakan untuk membuat UI yang interaktif

### **React Router** (Navigasi)
Digunakan untuk switch antar halaman tanpa reload browser

### **Axios** (HTTP Client)
Digunakan untuk komunikasi dengan backend

### **Bootstrap** (Styling)
Digunakan untuk membuat UI yang cantik dan responsive

---

## 🚀 Cara Menjalankan (Step by Step)

### **Step 1: Install**
```bash
cd "c:\TOKO BUKU 1\FRONTEND"
npm install
```
Tunggu ±3 menit, ini mengdownload semua library yang dipakai.

### **Step 2: Pastikan Backend Berjalan**
```bash
cd "c:\TOKO BUKU 1\UKTAPI"
npm start
```
Harus ada pesan: "Server berjalan di http://localhost:4000"

### **Step 3: Jalankan Frontend**
```bash
cd "c:\TOKO BUKU 1\FRONTEND"
npm start
```
Browser otomatis buka ke http://localhost:3000

### **Step 4: Login**
```
Username: user
Password: 12345
```

---

## 📚 Dokumentasi (File-File Penjelasan)

Saya sudah buat 8 file dokumentasi lengkap:

| File | Untuk Siapa | Isi |
|------|-----------|-----|
| START_HERE.md | Pemula | Penjelasan ringkas & checklist |
| README.md | Everyone | Quick start & overview |
| RINGKASAN.md | Manager/Owner | Summary fitur |
| SETUP.md | DevOps | Cara install & setup |
| DOKUMENTASI.md | User/Admin | Fitur & cara pakai |
| DEVELOPMENT.md | Developer | Architecture & coding |
| STRUKTUR.md | Developer | Detail folder structure |
| INDEX.md | Everyone | Navigasi semua doc |

---

## 💡 Fitur-Fitur Utama

### ✅ Login Aman
- Username & password
- JWT token protection
- Session persistence

### ✅ Manajemen Data
- Tambah data (Create)
- Lihat data (Read)
- Edit data (Update)
- Hapus data (Delete)

### ✅ Role-Based Access
- Manager: Semua menu
- Kasir: Menu terbatas
- Pelanggan: Menu paling terbatas

### ✅ UI User-Friendly
- Responsive (mobile & desktop)
- Loading indicators
- Error messages
- Success notifications

---

## 🎯 Alur User Typical

```
1. User buka aplikasi
   ↓
2. Halaman login muncul
   ↓
3. Input username: "user" & password: "12345"
   ↓
4. Klik Login
   ↓
5. Dashboard terbuka
   ↓
6. Pilih menu sesuai peran:
   - Manager: Buku, Kategori, Pengguna, Pesanan
   - Kasir: Buku, Pesanan
   ↓
7. Lakukan CRUD (Tambah/Edit/Hapus)
   ↓
8. Atau klik Profil untuk lihat data user
   ↓
9. Klik Logout untuk keluar
```

---

## 🔍 Troubleshooting (Kalau Ada Error)

### ❌ "Port 3000 already in use"
```
Port sudah terpakai, gunakan port lain:
PORT=3001 npm start
```

### ❌ "Cannot get /api/books" (Error di network)
```
Backend belum running.
Pastikan backend sudah start:
npm start di folder UKTAPI
```

### ❌ "Login failed"
```
Username atau password salah.
Coba: user / 12345
```

### ❌ "Blank page / white screen"
```
Buka DevTools (F12)
Cek console untuk error
Restart: Ctrl+C lalu npm start
```

---

## ✨ Kelebihan Frontend Ini

✅ **Lengkap**: Semua fitur sudah ada
✅ **Aman**: JWT token protection
✅ **User-Friendly**: UI yang mudah dipakai
✅ **Responsive**: Bisa di mobile & desktop
✅ **Well-Documented**: Ada 8 file dokumentasi
✅ **Easy to Extend**: Mudah ditambah fitur
✅ **Production Ready**: Siap deploy

---

## 🎓 Belajar Lebih Lanjut

### Dokumentasi:
- React: https://react.dev
- Bootstrap: https://getbootstrap.com
- Axios: https://axios-http.com

### Fitur Baru:
- Search & filter
- Pagination
- Export Excel
- Analytics
- Dark mode

---

## 📞 Butuh Bantuan?

1. **Baca dokumentasi** yang sesuai
2. **Cek troubleshooting** section
3. **Lihat code comments** di file
4. **Hubungi developer**

---

## ✅ Final Checklist

Sebelum mulai:
- ✅ Node.js sudah install
- ✅ Sudah cd ke folder FRONTEND
- ✅ Sudah run npm install
- ✅ Backend sudah running
- ✅ Siap jalankan npm start

---

## 🎉 Selesai!

Frontend Toko Buku sudah **READY TO USE!** 

Tinggal:
1. npm install
2. npm start
3. Login
4. Gunakan aplikasi!

**Happy Coding!** 💻

---

**Dibuat:** 4 Februari 2026  
**Versi:** 1.0.0  
**Status:** ✅ Production Ready

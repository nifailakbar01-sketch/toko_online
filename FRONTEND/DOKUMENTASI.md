# 📚 DOKUMENTASI FRONTEND TOKO BUKU

## Daftar Isi
1. [Pengenalan](#pengenalan)
2. [Struktur Folder](#struktur-folder)
3. [Instalasi dan Setup](#instalasi-dan-setup)
4. [Penjelasan Fitur](#penjelasan-fitur)
5. [Alur Aplikasi](#alur-aplikasi)
6. [Komponen-Komponen](#komponen-komponen)
7. [Cara Menggunakan](#cara-menggunakan)

---

## Pengenalan

Frontend Toko Buku adalah aplikasi React yang dirancang untuk mengelola sistem toko buku secara menyeluruh. Aplikasi ini terhubung dengan backend Express.js yang menyediakan API untuk berbagai operasi data.

**Stack Teknologi:**
- React 18.2.0 (Framework UI)
- React Router DOM 6.20.0 (Routing)
- Axios (HTTP Client)
- Bootstrap 5.3.2 (CSS Framework)
- React Bootstrap (Komponen UI)

---

## Struktur Folder

```
FRONTEND/
├── public/
│   └── index.html              # File HTML utama
├── src/
│   ├── components/             # Komponen reusable
│   │   ├── Header.js           # Navigation bar & menu user
│   │   ├── Common.js           # Layout, Loading, Alert komponen
│   │   └── ProtectedRoute.js   # Middleware untuk halaman terlindungi
│   ├── pages/                  # Halaman-halaman utama
│   │   ├── LoginPage.js        # Halaman login
│   │   ├── DashboardPage.js    # Halaman dashboard utama
│   │   ├── BooksPage.js        # Manajemen buku
│   │   ├── CategoriesPage.js   # Manajemen kategori
│   │   ├── UsersPage.js        # Manajemen pengguna
│   │   ├── OrdersPage.js       # Manajemen pesanan
│   │   └── ProfilePage.js      # Profil pengguna
│   ├── context/                # State management
│   │   └── AuthContext.js      # Authentication context
│   ├── services/               # API & business logic
│   │   └── api.js              # Axios instance & interceptor
│   ├── utils/                  # Utility functions
│   ├── styles/                 # CSS custom
│   ├── App.js                  # Main app component & routing
│   └── index.js                # Entry point React
├── .env                        # Konfigurasi environment
└── package.json                # Dependencies & scripts
```

---

## Instalasi dan Setup

### 1. Instalasi Dependencies
```bash
cd FRONTEND
npm install
```

### 2. Konfigurasi Environment
Pastikan file `.env` sudah benar:
```
REACT_APP_API_URL=http://localhost:4000
```

Jika backend berjalan di port lain, sesuaikan URL-nya.

### 3. Jalankan Aplikasi
```bash
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

### 4. Build untuk Production
```bash
npm run build
```

---

## Penjelasan Fitur

### 1. **Autentikasi (Login)**
- Halaman login memerlukan username dan password
- Setelah login berhasil, token disimpan di localStorage
- Token digunakan untuk mengakses API yang dilindungi

**File:** `src/pages/LoginPage.js` & `src/context/AuthContext.js`

### 2. **Dashboard**
- Menampilkan statistik umum (total buku, pesanan, pendapatan)
- Menyediakan akses cepat ke menu-menu utama
- Berbeda untuk role manager dan kasir

**File:** `src/pages/DashboardPage.js`

### 3. **Manajemen Buku**
- Melihat daftar semua buku
- Manager dapat menambah, edit, dan hapus buku
- Menampilkan info: judul, pengarang, kategori, harga, stok

**File:** `src/pages/BooksPage.js`

### 4. **Manajemen Kategori** (Hanya Manager)
- Melihat daftar kategori
- Menambah kategori baru
- Edit dan hapus kategori

**File:** `src/pages/CategoriesPage.js`

### 5. **Manajemen Pengguna** (Hanya Manager)
- Melihat daftar semua pengguna
- Menambah pengguna baru dengan role: pelanggan, kasir, atau manager
- Mengaktifkan/menonaktifkan pengguna
- Menghapus pengguna

**File:** `src/pages/UsersPage.js`

### 6. **Manajemen Pesanan** (Hanya Kasir)
- Membuat pesanan baru dengan item buku
- Melihat daftar semua pesanan
- Melihat detail pesanan (item, total, status)
- Mengubah status pesanan (pending, completed, cancelled)

**File:** `src/pages/OrdersPage.js`

### 7. **Profil Pengguna**
- Melihat informasi profil login
- Menampilkan nama, username, email, role, dan status

**File:** `src/pages/ProfilePage.js`

---

## Alur Aplikasi

### Flow Login
```
User Input Username & Password
         ↓
    POST /auth/login
         ↓
    Server Return Token + User Data
         ↓
    Simpan ke localStorage
         ↓
    Redirect ke Dashboard
         ↓
    Header Component Load (Get User dari localStorage)
```

### Flow Akses Protected Route
```
User Akses /dashboard
         ↓
    Check localStorage (ada token & user?)
         ↓
    Tidak ada → Redirect ke /login
         ↓
    Ada → Load halaman dengan role check
         ↓
    Role sesuai? → Tampilkan halaman
         ↓
    Role tidak sesuai? → Tampilkan error message
```

### Flow API Request dengan Token
```
Component Request ke API
         ↓
    Axios Interceptor (attach token otomatis)
         ↓
    Request Header: Authorization: Bearer {token}
         ↓
    Server validate token
         ↓
    Response data / Error 401
         ↓
    Jika 401: Auto logout & redirect ke /login
```

---

## Komponen-Komponen

### 1. **Header.js**
Komponen navigasi top dengan:
- Logo dan branding
- Menu sesuai role user
- Dropdown profil & logout button

### 2. **Common.js**
Komponen reusable:
- `<Layout>` - Template halaman dengan title & subtitle
- `<LoadingSpinner>` - Loading indicator
- `<ErrorAlert>` - Alert error dengan dismissible
- `<SuccessAlert>` - Alert sukses dengan dismissible

### 3. **ProtectedRoute.js**
HOC untuk melindungi route:
- Cek apakah user login
- Cek apakah user punya role yang diperlukan
- Redirect ke login jika belum autentikasi

### 4. **AuthContext.js**
Manage state autentikasi:
- `user` - Data user login
- `token` - Access token
- `loading` - Loading state
- `login()` - Fungsi login
- `logout()` - Fungsi logout
- `refreshAccessToken()` - Refresh token jika expired

---

## Cara Menggunakan

### Login
1. Buka aplikasi di `http://localhost:3000/login`
2. Masukkan username & password
3. Klik tombol "Login"

**Demo Credentials:**
- Username: `user`
- Password: `12345`

### Manajemen Buku (Manager)
1. Klik menu "Buku" di navbar
2. Klik "+ Tambah Buku Baru"
3. Isi form:
   - Judul
   - Pengarang
   - Kategori (pilih dari dropdown)
   - Harga
   - Stok
4. Klik "Tambahkan"

Edit buku:
- Klik tombol "Edit" di tabel
- Ubah data yang diperlukan
- Klik "Perbarui"

Hapus buku:
- Klik tombol "Hapus"
- Konfirmasi penghapusan

### Membuat Pesanan (Kasir)
1. Klik menu "Pesanan" di navbar
2. Klik "+ Buat Pesanan Baru"
3. Pilih buku dari dropdown
4. Masukkan jumlah (quantity)
5. Jika ada item lain, klik "+ Tambah Item"
6. Klik "Buat Pesanan"

Ubah Status Pesanan:
1. Klik tombol "Detail" pada pesanan
2. Di bagian "Ubah Status", pilih status baru
3. Status otomatis tersimpan

### Manajemen Pengguna (Manager)
1. Klik menu "Pengguna" di navbar
2. Klik "+ Tambah Pengguna Baru"
3. Isi form:
   - Nama Lengkap
   - Username
   - Email
   - Password
   - Role (pelanggan/kasir/manager)
4. Check "Aktif" jika user langsung aktif
5. Klik "Tambahkan"

Nonaktifkan Pengguna:
- Klik tombol "Nonaktifkan" untuk pengguna aktif
- Klik tombol "Aktifkan" untuk pengguna nonaktif

---

## API Endpoints yang Digunakan

### Auth
```
POST /auth/login              - Login user
POST /auth/logout             - Logout user
POST /auth/token              - Refresh access token
```

### Books
```
GET /books                    - Daftar semua buku
GET /books/{id}               - Detail buku
POST /books                   - Tambah buku (manager)
PUT /books/{id}               - Edit buku (manager)
DELETE /books/{id}            - Hapus buku (manager)
```

### Categories
```
GET /categories               - Daftar kategori
GET /categories/{id}          - Detail kategori
POST /categories              - Tambah kategori (manager)
PUT /categories/{id}          - Edit kategori (manager)
DELETE /categories/{id}       - Hapus kategori (manager)
```

### Users
```
GET /users                    - Daftar pengguna (manager)
POST /users                   - Tambah pengguna (manager)
PUT /users/{id}               - Update status user (manager)
DELETE /users/{id}            - Hapus pengguna (manager)
GET /users/profile            - Profil user login
```

### Orders
```
GET /orders                   - Daftar order (kasir)
GET /orders/{id}              - Detail order
POST /orders                  - Buat order baru (kasir)
PUT /orders/{id}              - Update status order (kasir)
```

---

## Troubleshooting

### 1. "Tidak bisa connect ke backend"
- Pastikan backend berjalan di port 4000
- Cek konfigurasi `.env` di FRONTEND
- Cek CORS di backend express

### 2. "Token expired error"
- Token akan auto refresh melalui interceptor
- Jika masih error, user akan auto-logout ke login page
- Login ulang dan coba lagi

### 3. "Role tidak punya akses"
- Setiap role memiliki akses ke menu berbeda
- Manager: Akses semua menu
- Kasir: Akses Buku & Pesanan
- Pelanggan: Akses Buku & Profil

### 4. "Form validation error"
- Semua field harus diisi
- Check kembali data yang diinput
- Perhatikan format email dan angka

---

## Tips & Trik

1. **Refresh Token Otomatis**
   - Tidak perlu manual, sistem otomatis handle
   - Token di-refresh saat request jika sudah expired

2. **Data Tersimpan di localStorage**
   - User & token disimpan untuk session persistence
   - Hapus dengan logout atau clear browser storage

3. **Modal & Alert**
   - Semua form di-trigger via modal
   - Alert success/error auto-dismiss setelah 3 detik

4. **Responsive Design**
   - UI sudah responsive untuk mobile & tablet
   - Gunakan Bootstrap grid system untuk layout

---

## Kontak & Support

Jika ada pertanyaan atau issue, silakan hubungi tim developer.

**Terakhir diupdate:** 4 Februari 2026

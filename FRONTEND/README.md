# 📚 Aplikasi Frontend Toko Buku

Aplikasi React modern untuk manajemen toko buku dengan fitur lengkap untuk manager, kasir, dan pelanggan.

## ✨ Fitur Utama

- ✅ **Autentikasi Aman** - Login dengan JWT token
- ✅ **Dashboard Analytics** - Statistik penjualan dan inventori
- ✅ **Manajemen Buku** - CRUD lengkap untuk data buku
- ✅ **Manajemen Kategori** - Organisir buku per kategori
- ✅ **Manajemen Pengguna** - Kelola akun user dengan role-based
- ✅ **Manajemen Pesanan** - Buat & tracking pesanan
- ✅ **Role-Based Access** - Kontrol akses sesuai role
- ✅ **UI Responsive** - Kompatibel mobile & desktop

## 🚀 Quick Start

### Prasyarat
- Node.js >= 14
- npm atau yarn
- Backend sudah berjalan di `http://localhost:4000`

### Instalasi

```bash
# 1. Clone atau navigate ke folder
cd FRONTEND

# 2. Install dependencies
npm install

# 3. Jalankan aplikasi
npm start
```

Aplikasi akan buka di `http://localhost:3000`

## 📋 Demo Login

```
Username: user
Password: 12345
```

## 📁 Struktur Folder

```
src/
├── components/      # Komponen reusable
├── pages/          # Halaman-halaman utama
├── services/       # API client
├── context/        # State management
├── utils/          # Utility functions
└── styles/         # CSS custom
```

## 🔧 Konfigurasi

Edit file `.env` untuk mengubah API URL:

```env
REACT_APP_API_URL=http://localhost:4000
```

## 📖 Dokumentasi Lengkap

Baca file `DOKUMENTASI.md` untuk penjelasan detail tentang:
- Fitur-fitur aplikasi
- Cara penggunaan
- Alur aplikasi
- API endpoints

## 🛠️ Available Scripts

```bash
npm start      # Run development server
npm build      # Build untuk production
npm test       # Jalankan test
npm eject      # Eject (jangan lakukan!)
```

## 📚 Stack Teknologi

- **React 18** - UI Framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Bootstrap 5** - CSS Framework
- **JWT** - Token authentication

## 🔐 Security

- Token disimpan di localStorage
- Auto refresh token jika expired
- Auto logout jika token invalid
- Protected routes berdasarkan role

## 🎨 Tema & Styling

- Bootstrap 5 untuk styling
- React Bootstrap untuk komponen
- Responsive design mobile-first

## 💡 Tips Penggunaan

1. **Jangan share credentials** ke orang lain
2. **Logout** saat selesai menggunakan aplikasi
3. **Clear browser cache** jika ada masalah
4. **Hubungi admin** untuk reset password

## 🐛 Troubleshooting

### Port 3000 sudah terpakai
```bash
# Gunakan port lain
PORT=3001 npm start
```

### Tidak bisa connect ke backend
- Pastikan backend berjalan
- Check `.env` API_URL sudah benar
- Restart aplikasi

### Token expired
- Login ulang
- Atau tunggu auto refresh

## 📞 Kontak

Untuk pertanyaan atau issue, hubungi tim developer.

---

**Created on:** Februari 2026  
**Version:** 1.0.0

# 🚀 QUICK START GUIDE - FRONTEND TOKO BUKU

**Baca file ini dulu sebelum file lain!**

---

## ⚡ 5 Menit Setup

### Step 1: Buka Terminal/Command Prompt
```
Windows: Win + R → cmd
Mac: Command + Space → Terminal
Linux: Ctrl + Alt + T
```

### Step 2: Navigate ke Folder
```bash
cd "c:\TOKO BUKU 1\FRONTEND"
```

### Step 3: Install Dependencies (±2 menit)
```bash
npm install
```

### Step 4: Pastikan Backend Berjalan
Di terminal lain:
```bash
cd "c:\TOKO BUKU 1\UKTAPI"
npm start
# Harus ada: "Server berjalan di http://localhost:4000"
```

### Step 5: Jalankan Frontend
```bash
npm start
# Browser otomatis buka ke http://localhost:3000
```

### Step 6: Login
```
Username: user
Password: 12345
```

**Done!** 🎉

---

## 📚 Dokumentasi di Mana?

**Baca file sesuai kebutuhan:**

| Kebutuhan | File |
|-----------|------|
| "Gimana cara install?" | **SETUP.md** |
| "Gimana pakai aplikasi?" | **DOKUMENTASI.md** |
| "Ada error, apa ini?" | **DOKUMENTASI.md** (troubleshooting) |
| "Gimana development?" | **DEVELOPMENT.md** |
| "Folder gimana?" | **STRUKTUR.md** |
| "Penjelasan Bahasa Indonesia?" | **PENJELASAN_INDONESIA.md** |
| "Ringkasan singkat?" | **RINGKASAN.md** |

---

## ❓ FAQ Cepat

### Q: Gimana cara login?
A: Username: `user`, Password: `12345`

### Q: Error "port 3000 already in use"?
A: `PORT=3001 npm start`

### Q: Error "Cannot connect backend"?
A: Pastikan backend sudah berjalan di localhost:4000

### Q: Gimana cara buat fitur baru?
A: Baca `DEVELOPMENT.md`

### Q: File mana yang harus edit?
A: Edit file di folder `src/`

### Q: Bagaimana di-deploy?
A: `npm run build` lalu upload folder `/build`

---

## 🎯 Halaman yang Ada

Setelah login, Anda akan melihat menu:

- 📊 **Dashboard** - Statistik & overview
- 📚 **Buku** - Lihat/tambah/edit buku
- 📂 **Kategori** - Manajemen kategori (manager)
- 👥 **Pengguna** - Manajemen user (manager)
- 📦 **Pesanan** - Manajemen pesanan (kasir)
- 👤 **Profil** - Data profil Anda

---

## 🔐 & Akses

| | Akses |
|------|-------|
| Manager | Semua menu |
| Kasir | Buku + Pesanan |
| Pelanggan | Profil + Buku |

Demo user: **kasir**

---

## 📂 Struktur Folder Penting

```
src/
├── components/   ← UI parts
├── pages/       ← Halaman besar
├── services/    ← API
├── context/     ← Auth
├── App.js       ← Routing
└── index.js     ← Start point
```

---

## 💡 Useful Commands

```bash
# Development
npm start              # Jalankan aplikasi
npm test              # Run tests

# Production
npm run build         # Build untuk production

# Maintenance
npm install           # Install packages
npm update            # Update packages

# Cleanup
npm cache clean --force
rm -rf node_modules
npm install
```

---

## 🔍 Troubleshooting

| Error | Solusi |
|-------|--------|
| npm not found | Install Node.js |
| Port 3000 in use | `PORT=3001 npm start` |
| Cannot connect backend | Backend belum running |
| Login error | Cek username/password |
| Blank page | Buka DevTools (F12), cek console |
| CSS tidak loading | Clear browser cache |

---

## 📖 Dokumentasi Lengkap

Untuk penjelasan detail, baca:

1. **SETUP.md** (20 menit)
   - Instalasi step-by-step
   - Troubleshooting
   - Verifikasi

2. **DOKUMENTASI.md** (30 menit)
   - Fitur-fitur lengkap
   - Cara menggunakan
   - Screenshots

3. **DEVELOPMENT.md** (40 menit)
   - Architecture
   - Best practices
   - Menambah fitur

---

## ✅ Checklist Pertama Kali

- [ ] Install Node.js
- [ ] cd ke folder FRONTEND
- [ ] npm install
- [ ] npm start (backend sudah jalan)
- [ ] Login dengan user/12345
- [ ] Explore dashboard
- [ ] Baca DOKUMENTASI.md

---

## 🎓 Belajar

### React Documentation:
- https://react.dev

### Bootstrap:
- https://getbootstrap.com

### Axios:
- https://axios-http.com

---

## 📞 Need Help?

1. Baca dokumentasi yang sesuai
2. Cek troubleshooting section
3. Google error message
4. Hubungi tim developer

---

## 🎉 Ready?

```
npm install  →  npm start  →  Login  →  Enjoy!
```

---

**Versi:** 1.0.0  
**Created:** 4 Februari 2026  
**Status:** ✅ READY TO USE

Selamat menggunakan! 🚀

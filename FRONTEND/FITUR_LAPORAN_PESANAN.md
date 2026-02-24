# Fitur Laporan Pesanan untuk Manager

## Overview
Fitur ini memungkinkan role **manager** untuk melihat laporan pesanan lengkap dengan statistik, filter, dan opsi export/print.

## File yang Ditambahkan/Diubah

### 1. **OrdersReportPage.js** (Baru)
File: `src/pages/OrdersReportPage.js`

Halaman utama laporan pesanan yang menampilkan:
- **Statistik Dashboard:**
  - Total Pesanan
  - Pesanan Selesai
  - Pesanan Pending
  - Pesanan Dibatalkan
  - Total Pendapatan
  - Rata-rata per Pesanan

- **Filter Laporan:**
  - Filter berdasarkan Status (Pending, Processing, Selesai, Dibatalkan)
  - Filter berdasarkan Tanggal Mulai
  - Filter berdasarkan Tanggal Akhir
  - Tombol Reset Filter

- **Tabel Pesanan:**
  - Nomor urut
  - Nama Pelanggan
  - Status (dengan badge berwarna)
  - Total Harga
  - Tanggal
  - Tombol Detail

- **Fitur Lanjutan:**
  - 📥 Export CSV - Download laporan dalam format CSV
  - 🖨️ Print Laporan - Cetak laporan langsung
  - Detail Modal - Lihat detail lengkap pesanan termasuk item-item

### 2. **App.js** (Diubah)
File: `src/App.js`

Perubahan:
- Import `OrdersReportPage`
- Tambah route `/orders-report` dengan `requiredRole="manager"`

```javascript
<Route
  path="/orders-report"
  element={
    <ProtectedRoute requiredRole="manager">
      <OrdersReportPage />
    </ProtectedRoute>
  }
/>
```

### 3. **Header.js** (Diubah)
File: `src/components/Header.js`

Perubahan:
- Tambah menu "Laporan Pesanan" untuk role manager
- Navigation link ke `/orders-report`

```javascript
{user.role === 'manager' && (
  <>
    <Nav.Link href="/books">Buku</Nav.Link>
    <Nav.Link href="/categories">Kategori</Nav.Link>
    <Nav.Link href="/users">Pengguna</Nav.Link>
    <Nav.Link href="/orders-report">Laporan Pesanan</Nav.Link>
  </>
)}
```

### 4. **Common.js** (Diubah)
File: `src/components/Common.js`

Perubahan:
- Update `LoadingSpinner` untuk support custom message parameter

## Fitur Lengkap

### 📊 Statistik Real-time
- Menampilkan total pesanan, pendapatan, dan breakdown status
- Hitung rata-rata nilai pesanan

### 🔍 Filter Fleksibel
- Filter berdasarkan status pesanan
- Filter berdasarkan rentang tanggal
- Kombinasi filter untuk analisis detail

### 📥 Export CSV
- Download laporan dalam format CSV
- Includes: ID, Nama Pelanggan, Status, Total, Tanggal, Keterangan
- Nama file otomatis dengan tanggal: `laporan-pesanan-YYYY-MM-DD.csv`

### 🖨️ Print Laporan
- Cetak laporan langsung dari browser
- Format ramah untuk printing

### 📋 Detail Pesanan
- Modal untuk melihat detail lengkap pesanan
- Informasi pelanggan (nama, email)
- Daftar item pesanan dengan harga
- Status dan total pembayaran

## Access Control

### Role Manager
- ✅ Akses `/orders-report` (Laporan Pesanan)
- ✅ Lihat semua pesanan
- ✅ Filter dan analisis pesanan
- ✅ Export laporan
- ✅ Print laporan

### Role Kasir
- ❌ Tidak bisa akses `/orders-report`
- ✅ Akses `/orders` (Input/kelola pesanan)

### Role Admin
- ✅ Akses semua halaman
- ✅ Akses `/orders-report`

## Backend Requirements

Route yang digunakan:
- `GET /orders` - Ambil semua pesanan (support query params: status, startDate, endDate)
- Middleware: `verifyToken` dan `requireRoles('manager')` (opsional, karena frontend sudah check)

## Cara Penggunaan

1. **Login sebagai Manager**
   - Username: manager
   - Password: password

2. **Akses Laporan Pesanan**
   - Klik menu "Laporan Pesanan" di navbar
   - Atau buka `/orders-report` langsung

3. **Filter Data**
   - Pilih status dari dropdown
   - Pilih tanggal mulai dan akhir
   - Data otomatis ter-filter

4. **Export Laporan**
   - Klik tombol "📥 Export CSV"
   - File akan di-download

5. **Print Laporan**
   - Klik tombol "🖨️ Print Laporan"
   - Browser print dialog akan muncul
   - Atur setting print dan print

6. **Lihat Detail**
   - Klik tombol "Detail" pada baris pesanan
   - Modal akan menampilkan detail lengkap

## Styling

Menggunakan Bootstrap:
- Cards untuk statistik
- Table striped untuk data list
- Badge untuk status (Pending=warning, Completed=success, Cancelled=danger, Processing=info)
- Modal untuk detail view
- Responsive layout (md breakpoint untuk responsivitas)

## Catatan Teknis

- Menggunakan `apiClient` untuk HTTP requests
- State management dengan `useState` dan `useEffect`
- Integrasi dengan `AuthContext` untuk user info
- Filter real-time tanpa reload halaman
- CSV export menggunakan Blob API
- Print menggunakan `window.print()`

## Testing Checklist

- [ ] Manager bisa akses `/orders-report`
- [ ] Statistik menampilkan data yang benar
- [ ] Filter status berfungsi
- [ ] Filter tanggal berfungsi
- [ ] Reset filter mengembalikan ke default
- [ ] Export CSV berfungsi dan file ter-download
- [ ] Print laporan membuka browser print dialog
- [ ] Detail modal menampilkan info lengkap
- [ ] Kasir tidak bisa akses `/orders-report`
- [ ] Non-login tidak bisa akses halaman

## Future Enhancements

- 📊 Chart/graph untuk visualisasi trend pesanan
- 📧 Email laporan otomatis ke manager
- 💾 Save laporan sebagai PDF
- 🔔 Alert untuk pesanan tertentu (pending lama, dll)
- 📈 Analisis more detailed (best-selling books, etc)

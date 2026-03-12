# 🎨 Panduan Warna - Toko Buku Online

## Filosofi Desain
Tema ini menggunakan palet warna profesional modern yang dirancang untuk:
- ✅ **Accessibility**: Kontras warna yang baik untuk readability optimal
- ✅ **Consistency**: Warna yang konsisten di seluruh aplikasi
- ✅ **Psychology**: Warna yang mendukung user experience yang intuitif
- ✅ **Professionalism**: Tampilan modern yang bisa dipercaya

---

## 📌 PALET WARNA UTAMA

### 1. PRIMARY - Biru Modern (#2563eb)
**Digunakan untuk:** Brand identity utama, CTA buttons, headers
- **--primary**: `#2563eb` - Warna standar
- **--primary-light**: `#dbeafe` - Background highlight, hover backgrounds
- **--primary-dark**: `#1e40af` - Active states, darker borders

**Contoh penggunaan:**
```html
<!-- Navbar & Headers -->
<nav className="navbar bg-primary"></nav>

<!-- Tombol utama -->
<Button variant="primary">Buat Baru</Button>

<!-- Card headers -->
<Card.Header className="bg-primary">Daftar Buku</Card.Header>
```

---

### 2. SUCCESS - Hijau Segar (#059669)
**Digunakan untuk:** Positive actions, approval buttons, success messages
- **--success**: `#059669` - Warna standar
- **--success-light**: `#d1fae5` - Background success messages
- **--success-dark**: `#047857` - Border & text success messages

**Contoh penggunaan:**
```html
<!-- Tombol approve/simpan -->
<Button variant="success">✓ Simpan</Button>

<!-- Success alert -->
<Alert variant="success">Berhasil disimpan!</Alert>

<!-- Badge untuk status selesai -->
<Badge bg="success">Selesai</Badge>
```

---

### 3. WARNING - Amber Hangat (#d97706)
**Digunakan untuk:** Warnings, alerts, pending status, attention-needed
- **--warning**: `#d97706` - Warna standar
- **--warning-light**: `#fef3c7` - Background warning messages
- **--warning-dark**: `#b45309` - Border & text warning messages

**Contoh penggunaan:**
```html
<!-- Tombol warning/caution -->
<Button variant="warning">⚠ Gunakan dengan Hati-hati</Button>

<!-- Warning alert -->
<Alert variant="warning">Perhatian: Stok hampir habis</Alert>

<!-- Badge untuk status pending -->
<Badge bg="warning" text="dark">Pending</Badge>
```

---

### 4. INFO - Biru Cerah (#0284c7)
**Digunakan untuk:** Informational messages, info icons, secondary info
- **--info**: `#0284c7` - Warna standar
- **--info-light**: `#e0f2fe` - Background info messages
- **--info-dark**: `#0c4a6e` - Border & text info messages

**Contoh penggunaan:**
```html
<!-- Info alert -->
<Alert variant="info">ℹ Tips: Tekan Ctrl+S untuk menyimpan dengan cepat</Alert>

<!-- Badge untuk info -->
<Badge bg="info">New</Badge>
```

---

### 5. DANGER - Merah Cerah (#dc2626)
**Digunakan untuk:** Delete/dangerous actions, error messages, critical alerts
- **--danger**: `#dc2626` - Warna standar

⚠️ **GUNAKAN DENGAN HATI-HATI** - Hanya untuk destructive actions!

**Contoh penggunaan:**
```html
<!-- Tombol delete -->
<Button variant="danger">🗑 Hapus Permanen</Button>

<!-- Error alert -->
<Alert variant="danger">Error: Gagal menghubungi server</Alert>

<!-- Badge untuk status error -->
<Badge bg="danger">Error</Badge>
```

---

## ⚫⚪ WARNA NETRAL - Professional Grays

### Text Colors
- **--dark** `#1f2937` - Warna text utama (body, headers)
- **--muted** `#6b7280` - Secondary text, placeholders, muted content

### Background Colors
- **--bg-light** `#f3f4f6` - Page background (seluruh halaman)
- **--white** `#ffffff` - Card backgrounds, modals
- **--light** `#f9fafb` - Very light backgrounds, table headers

---

## 🎯 PANDUAN PENGGUNAAN PER KOMPONEN

### Tombol (Buttons)
| Situasi | Variant | Warna | Contoh |
|---------|---------|-------|--------|
| Aksi Utama | primary | Biru | "Simpan", "Lanjutkan", "Mulai" |
| Approval | success | Hijau | "Approve", "Setujui", "Terima" |
| Warning | warning | Amber | "Konfirmasi", "Perlu Perhatian" |
| Bahaya | danger | Merah | "Hapus", "Cancel", "Tolak" |
| Neutral | secondary | Abu-abu | "Kembali", "Close", "Batal" |

### Status Badges
| Status | Warna | Digunakan untuk |
|--------|-------|-----------------|
| Selesai/Berhasil | success (hijau) | Order selesai, verifikasi OK |
| Pending/Menunggu | warning (amber) | Pembayaran pending, waiting approval |
| Aktif/Baru | info (biru) | User aktif, produk baru |
| Proses/Loading | primary (biru) | Sedang diproses |
| Error/Gagal | danger (merah) | Processing error, failed transaction |

### Alert Messages
```html
<!-- Info - untuk tips & additional info -->
<Alert variant="info" dismissible>
  ℹ️ Gunakan format: DD/MM/YYYY
</Alert>

<!-- Success - untuk operasi berhasil -->
<Alert variant="success" dismissible>
  ✓ Buku berhasil ditambahkan!
</Alert>

<!-- Warning - untuk hal yang perlu diperhatian -->
<Alert variant="warning" dismissible>
  ⚠ Stok buku tersisa {count} unit
</Alert>

<!-- Danger - untuk error/gagal -->
<Alert variant="danger" dismissible>
  ✗ Error: Gagal menghubungi server
</Alert>
```

---

## 🎨 KOMBINASI WARNA YANG BAIK

### ✅ Kombinasi yang Recommended
- **Primary + White**: Navbar blue + white text ✓
- **Success + Light Green**: Green button + light green background ✓
- **Warning + Light Amber**: Amber alert icon + light amber background ✓
- **Dark + Light**: Dark text + light gray background ✓

### ❌ Kombinasi yang Harus Dihindari
- **Merah + Merah**: Error + danger menciptakan kebingungan
- **Terlalu banyak warna**: Lebih dari 3 warna utama dalam satu view
- **Low contrast**: Text warna muda di background warna muda
- **Blue on Blue**: Primary di atas primary-light

---

## 🔄 CSS Variables - Cara Menggunakannya

**Di seluruh file CSS, gunakan CSS variables:**

```css
/* ✓ BENAR - Gunakan variables */
button {
  background-color: var(--primary);
  color: var(--white);
  border: 1px solid var(--primary-dark);
}

/* ✗ SALAH - Jangan hardcode warna */
button {
  background-color: #2563eb;
  color: #ffffff;
  border: 1px solid #1e40af;
}
```

**Keuntungan menggunakan variables:**
- 🎨 Mudah untuk mengubah tema keseluruhan
- 🔄 Konsistensi warna terjamin
- 📱 Mudah untuk membuat dark mode di masa depan
- ✨ Maintenance yang lebih mudah

---

## 📋 CHECKLIST SEBELUM DEPLOY

- [ ] Semua tombol menggunakan warna yang sesuai dengan fungsinya
- [ ] Alert/notification messages menggunakan warna yang tepat
- [ ] Badges/labels memiliki kontras yang cukup
- [ ] Text berwarna gelap pada background terang
- [ ] Tidak ada hardcoded hex values, semua pakai variables
- [ ] Hover states memberikan feedback visual yang jelas
- [ ] Disabled buttons terlihat jelas berbeda

---

## 💡 Pro Tips

1. **Single-color rule**: Fokus pada 1 warna utama per section
2. **Progressive disclosure**: Gunakan warna netral untuk info sekunder
3. **Accessibility**: Jangan andalkan warna saja - tambahkan icons/labels
4. **Consistency**: Jika success = hijau di satu tempat, jangan merah di tempat lain
5. **Testing**: Test aplikasi dengan color blindness simulator

---

## 📞 Pertanyaan & Troubleshooting

**Q: Bagaimana jika saya ingin mengubah warna primary?**
A: Ubah `:root { --primary: #... }` di bagian atas custom.css, semua komponen akan berubah otomatis.

**Q: Warna text tidak terlihat jelas di background ini?**
A: Check contrast ratio di https://webaim.org/resources/contrastchecker/. Target minimal 4.5:1.

**Q: Bagaimana membuat gradient?**
A: Lihat `.navbar` di custom.css:
```css
background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
```

---

**Last Updated:** March 2026
**Design System Version:** 1.0

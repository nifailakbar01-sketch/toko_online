# PANDUAN DEVELOPMENT - FRONTEND TOKO BUKU

## 🎯 Tujuan Dokumentasi Ini

Dokumentasi ini membantu developer untuk memahami dan mengembangkan frontend Toko Buku.

---

## 📚 Pengenalan Struktur Kode

### 1. **Context API (Authentication)**
**File:** `src/context/AuthContext.js`

Context ini mengelola state autentikasi aplikasi:
```javascript
// Menggunakan hook AuthContext
const { user, token, login, logout, isAuthenticated } = useAuth();

// Login
const handleLogin = async (username, password) => {
  await login(username, password);
  // User & token otomatis tersimpan
}

// Logout
const handleLogout = async () => {
  await logout();
  // User & token otomatis dihapus
}
```

### 2. **API Service (Axios)**
**File:** `src/services/api.js`

Service ini handle semua request ke backend:
```javascript
import apiClient from '../services/api';

// GET Request
const response = await apiClient.get('/books');

// POST Request
const response = await apiClient.post('/books', { title: 'Buku Baru' });

// PUT Request
const response = await apiClient.put(`/books/${id}`, { title: 'Updated' });

// DELETE Request
const response = await apiClient.delete(`/books/${id}`);
```

**Auto-attach token di header:**
```javascript
// Header otomatis ditambahkan:
// Authorization: Bearer {token}
```

**Auto-handle error 401 (token expired):**
```javascript
// Jika response 401, user otomatis logout & redirect ke /login
```

### 3. **Routing**
**File:** `src/App.js`

React Router mengatur navigasi aplikasi:
```javascript
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } />
  <Route path="/books" element={
    <ProtectedRoute>
      <BooksPage />
    </ProtectedRoute>
  } />
</Routes>
```

### 4. **Protected Route Component**
**File:** `src/components/ProtectedRoute.js`

Komponen ini melindungi halaman yang memerlukan login:
```javascript
// Tanpa role requirement
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Dengan role requirement (hanya manager)
<ProtectedRoute requiredRole="manager">
  <UsersPage />
</ProtectedRoute>
```

---

## 🔄 Data Flow (Alur Data Aplikasi)

### Login Flow
```
User Form Input
    ↓
handleSubmit → login(username, password)
    ↓
AuthContext.login()
    ↓
POST /auth/login
    ↓
✅ Response: { accessToken, refreshToken, user }
    ↓
localStorage.setItem('accessToken', token)
localStorage.setItem('user', JSON.stringify(user))
    ↓
setUser(userData)
setToken(token)
    ↓
useAuth() hook update
    ↓
Header component re-render dengan user data
    ↓
Navigate to /dashboard
```

### API Request Flow
```
Component request: apiClient.get('/books')
    ↓
Axios interceptor (request)
    ↓
Attach token ke header: Authorization: Bearer {token}
    ↓
Send request ke backend
    ↓
Backend validate token
    ↓
✅ Response data
    ↓
Axios interceptor (response)
    ↓
Return data ke component
    ↓
Component update state & re-render
```

### Error Handling Flow
```
API Error terjadi
    ↓
Try-catch di component
    ↓
Catch error
    ↓
Set error state
    ↓
Show ErrorAlert component
    ↓
User dismiss atau auto-dismiss setelah 3s
```

---

## 💡 Best Practices

### 1. **Error Handling**
```javascript
// ✅ BENAR: Comprehensive error handling
try {
  const response = await apiClient.get('/books');
  setBooks(response.data);
} catch (err) {
  const errorMessage = err.response?.data?.message || 'Gagal memuat data';
  setError(errorMessage);
}

// ❌ SALAH: Tidak ada error handling
const response = await apiClient.get('/books');
setBooks(response.data);
```

### 2. **Loading State**
```javascript
// ✅ BENAR: Show loading indicator
const [loading, setLoading] = useState(true);

useEffect(() => {
  const load = async () => {
    setLoading(true);
    try {
      // fetch data
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);

if (loading) return <LoadingSpinner />;
```

### 3. **Form Handling**
```javascript
// ✅ BENAR: Controlled input
const [formData, setFormData] = useState({ name: '', email: '' });

<Form.Control
  value={formData.name}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/>

// ❌ SALAH: Uncontrolled input
<Form.Control defaultValue="..." />
```

### 4. **Component Reusability**
```javascript
// ✅ BENAR: Generic component
const StatCard = ({ title, value, icon, color }) => (
  <Card className={`bg-${color}`}>
    <Card.Body>
      <p>{title}</p>
      <h3>{value}</h3>
    </Card.Body>
  </Card>
);

// Usage
<StatCard title="Total Buku" value={100} icon="📚" color="primary" />

// ❌ SALAH: Hard-coded component
const TotalBukuCard = () => <Card>Total Buku: 100</Card>;
```

### 5. **Conditional Rendering**
```javascript
// ✅ BENAR: Check role sebelum render
{user?.role === 'manager' && (
  <Button>Admin Menu</Button>
)}

// ❌ SALAH: Render tanpa check
<Button>{user.role === 'manager' ? 'Admin Menu' : ''}</Button>
```

---

## 🔧 Menambah Fitur Baru

### Langkah-langkah Menambah Halaman Baru

1. **Buat file page di `src/pages/`**
```javascript
// src/pages/NewPage.js
import React from 'react';
import { Layout } from '../components/Common';

export const NewPage = () => {
  return (
    <Layout title="Halaman Baru" subtitle="Deskripsi">
      <h1>Content disini</h1>
    </Layout>
  );
};
```

2. **Import di `App.js`**
```javascript
import { NewPage } from './pages/NewPage';
```

3. **Tambah route di `App.js`**
```javascript
<Route
  path="/new-page"
  element={
    <ProtectedRoute requiredRole="manager"> {/* atau tanpa requiredRole */}
      <NewPage />
    </ProtectedRoute>
  }
/>
```

4. **Tambah menu link di `Header.js`**
```javascript
<Nav.Link href="/new-page">Menu Baru</Nav.Link>
```

### Langkah-langkah Menambah API Call

1. **Import apiClient di component**
```javascript
import apiClient from '../services/api';
```

2. **Buat function untuk API call**
```javascript
const loadData = async () => {
  try {
    const response = await apiClient.get('/new-endpoint');
    setData(response.data);
  } catch (err) {
    setError('Gagal memuat data');
  }
};
```

3. **Call di useEffect**
```javascript
useEffect(() => {
  loadData();
}, []);
```

---

## 🧪 Testing

### Cek apakah component berjalan dengan baik:

1. **Manual Testing**
   - Buka halaman di browser
   - Test semua button dan form
   - Check console untuk error

2. **Network Tab**
   - Buka DevTools → Network tab
   - Cek apakah request berhasil
   - Cek response data correct

3. **Local Storage**
   - DevTools → Application → Local Storage
   - Check token & user data tersimpan

---

## 🐛 Debugging Tips

### 1. Log State dan Props
```javascript
console.log('user:', user);
console.log('formData:', formData);
```

### 2. Check Network Request
```javascript
// DevTools → Network tab
// Filter XHR untuk AJAX requests
```

### 3. Check Local Storage
```javascript
console.log(localStorage.getItem('user'));
console.log(localStorage.getItem('accessToken'));
```

### 4. Check Redux DevTools (jika pakai Redux)
```javascript
// Browser extension untuk debug state
```

---

## 📦 Menambah Dependency

```bash
# Install package
npm install package-name

# Uninstall package
npm uninstall package-name

# Update package
npm update package-name
```

---

## 🚀 Build & Deploy

### Development Build
```bash
npm start
# Berjalan di http://localhost:3000 dengan hot reload
```

### Production Build
```bash
npm run build
# Generate folder /build dengan optimized code
```

### Deploy ke Server
```bash
# 1. Build aplikasi
npm run build

# 2. Upload folder /build ke server (e.g., Vercel, Netlify, AWS)

# 3. Set environment variable di server
REACT_APP_API_URL=https://your-api.com
```

---

## 📝 Conventions & Standards

### File Naming
- Component: PascalCase → `BooksPage.js`
- Utils/Services: camelCase → `api.js`
- Folder: lowercase → `src/pages/`

### Code Style
- Use arrow functions
- Use ES6 destructuring
- Use meaningful variable names
- Comment untuk logika kompleks

### Commit Messages
```
✨ Feature: Tambah fitur X
🐛 Fix: Perbaiki bug X
📚 Docs: Update dokumentasi
🔧 Config: Ubah konfigurasi
♻️ Refactor: Refactor code X
```

---

## 📞 Getting Help

Jika ada yang tidak jelas:
1. Cek dokumentasi React: https://react.dev
2. Cek dokumentasi Bootstrap: https://getbootstrap.com
3. Cek dokumentasi React Router: https://reactrouter.com
4. Hubungi tim developer

---

**Last Updated:** 4 Februari 2026  
**Version:** 1.0.0

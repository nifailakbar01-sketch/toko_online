require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { verifyToken } = require('./src/middleware/authorization');
const { swaggerUi, swaggerSpec } = require('./src/swagger'); // ← Import Swagger
const app = express();

// ============================
// 🔧 Middleware Global
// ============================
app.use(express.json()); // Supaya bisa baca JSON dari request body
app.use(cors());         // Mengizinkan akses dari frontend (React, Vue, dsb.)

// ============================
// 📘 Swagger API Documentation
// ============================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================
// 🚏 ROUTES
// ============================
app.use('/auth', require('./src/routes/auth'));       // login, refresh, logout
app.use('/users', require('./src/routes/users'));     // CRUD user
app.use('/books', verifyToken, require('./src/routes/books')); // CRUD buku (protected)
app.use('/orders', verifyToken, require('./src/routes/orders')); // Transaksi (protected)
app.use('/categories', verifyToken, require('./src/routes/categories')); // Kategori (protected)

// ============================
// 🚀 Jalankan Server
// ============================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di: http://localhost:${PORT}`);
  console.log(`📘 Swagger dokumentasi di: http://localhost:${PORT}/api-docs`);
});

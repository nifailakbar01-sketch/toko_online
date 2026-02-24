/**
 * @swagger
 * tags:
 *   name: AUTH
 *   description: Endpoint untuk login, refresh token, dan logout
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [AUTH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: user
 *               password:
 *                 type: string
 *                 example: 12345
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Username atau password salah
 *       403:
 *         description: Akun dinonaktifkan oleh manager
 */

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Membuat access token baru dari refresh token
 *     tags: [AUTH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1...
 *     responses:
 *       200:
 *         description: Token baru berhasil dibuat
 *       403:
 *         description: Refresh token tidak valid
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout pengguna dan hapus refresh token
 *     tags: [AUTH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1...
 *     responses:
 *       200:
 *         description: Logout berhasil
 */


const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const bcrypt = require('bcrypt');

const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });


// =========================
// REGISTER
// =========================
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Daftarkan pengguna baru
 *     tags: [AUTH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - fullname
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: user123
 *               password:
 *                 type: string
 *                 example: password123
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Username sudah terdaftar atau input tidak valid
 */
router.post('/register', async (req, res) => {
  const { username, password, fullname, email } = req.body;

  // Validasi input
  if (!username || !password || !fullname || !email) {
    return res.status(400).json({ message: 'Semua field harus diisi.' });
  }

  if (password.length < 5) {
    return res.status(400).json({ message: 'Password minimal 5 karakter.' });
  }

  try {
    // Cek apakah username sudah ada
    const userCheck = await pool.query('SELECT id FROM users WHERE username=$1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Username sudah terdaftar.' });
    }

    // Cek apakah email sudah ada
    const emailCheck = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru dengan role 'pelanggan'
    const result = await pool.query(
      `INSERT INTO users (username, password, fullname, email, role, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, username, fullname, email, role`,
      [username, hashedPassword, fullname, email, 'pelanggan']
    );

    res.status(201).json({
      message: 'Registrasi berhasil. Silahkan login.',
      user: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Kesalahan server saat registrasi.' });
  }
});


// =========================
// LOGIN
// =========================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
    const user = result.rows[0];

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    // Cek password bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    // Cek apakah akun di-nonaktifkan
    if (user.is_active === false) {
      return res.status(403).json({
        message: 'Akun Anda telah dinonaktifkan oleh manager. Silahkan hubungi manager.'
      });
    }

    // Generate token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Simpan refresh token ke database
    await pool.query(
      `INSERT INTO tokens (id_user, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [user.id, refreshToken]
    );

    res.json({
      message: 'Login berhasil',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Kesalahan server.' });
  }
});


// =========================
// REFRESH TOKEN
// =========================
router.post('/token', async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: 'Refresh token tidak ditemukan.' });

  try {
    const result = await pool.query(
      'SELECT * FROM tokens WHERE token=$1 AND expires_at > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Refresh token tidak valid.' });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Refresh token tidak valid.' });

      const newAccessToken = generateAccessToken(decoded);
      res.json({ accessToken: newAccessToken });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Kesalahan server.' });
  }
});


// =========================
// LOGOUT
// =========================
router.post('/logout', async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ message: 'Token harus disertakan.' });

  await pool.query('DELETE FROM tokens WHERE token=$1', [token]);

  res.json({ message: 'Logout berhasil.' });
});

module.exports = router;

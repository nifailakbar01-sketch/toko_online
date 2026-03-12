/**
 * @swagger
 * tags:
 *   name: USERS
 *   description: Manajemen data pengguna
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Mendapatkan semua pengguna (khusus manager)
 *     security:
 *       - bearerAuth: []
 *     tags: [USERS]
 *     responses:
 *       200:
 *         description: Daftar pengguna berhasil diambil
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Menambahkan pengguna baru (khusus manager)
 *     security:
 *       - bearerAuth: []
 *     tags: [USERS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Budi Santoso
 *               username:
 *                 type: string
 *                 example: budi123
 *               email:
 *                 type: string
 *                 example: budi@gmail.com
 *               password:
 *                 type: string
 *                 example: rahasia123
 *               role:
 *                 type: string
 *                 example: pelanggan
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: User berhasil ditambahkan
 *       400:
 *         description: Data tidak lengkap
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mengubah status aktif/nonaktif pengguna (khusus manager)
 *     security:
 *       - bearerAuth: []
 *     tags: [USERS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_active:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Status pengguna berhasil diperbarui
 *       404:
 *         description: Pengguna tidak ditemukan
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Menghapus pengguna berdasarkan ID (khusus manager)
 *     security:
 *       - bearerAuth: []
 *     tags: [USERS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pengguna berhasil dihapus
 *       404:
 *         description: Pengguna tidak ditemukan
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Melihat profil user yang sedang login (khusus manager)
 *     security:
 *       - bearerAuth: []
 *     tags: [USERS]
 *     responses:
 *       200:
 *         description: Profil pengguna berhasil diambil
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       403:
 *         description: Tidak memiliki akses
 */

const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const { verifyToken, requireRoles } = require('../middleware/authorization');

// ==================================================
// GET semua user (khusus manager)
// ==================================================
router.get('/', verifyToken, requireRoles('manager'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, fullname, username, email, role, is_active FROM users ORDER BY id ASC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data user.' });
  }
});

// ==================================================
// POST tambah user baru (khusus manager)
// ==================================================
router.post('/', verifyToken, requireRoles('manager'), async (req, res) => {
  try {
    const { fullname, username, email, password, role, is_active } = req.body;

    if (!fullname || !username || !email || !password || !role) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (fullname, username, email, password, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, fullname, username, email, role, is_active`,
      [fullname, username, email, hashedPassword, role, is_active ?? true]
    );

    res.status(201).json({
      message: 'User berhasil ditambahkan.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan user.' });
  }
});

// ==================================================
// ✅ PUT ubah status aktif/nonaktif user (khusus manager)
// ==================================================
router.put('/:id', verifyToken, requireRoles('manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body; // ambil dari body, bukan params

    const result = await pool.query(
      `UPDATE users SET is_active=$1 WHERE id=$2
       RETURNING id, fullname, username, email, role, is_active`,
      [is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    res.json({
      message: `User berhasil ${is_active ? 'diaktifkan' : 'dinonaktifkan'}.`,
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui status user.' });
  }
});

// ==================================================
// ✅ DELETE user (khusus manager)
// ==================================================
router.delete('/:id', verifyToken, requireRoles('manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    res.json({ message: 'User berhasil dihapus.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus user.' });
  }
});

// ==================================================
// GET profil user yang sedang login (khusus manager)
// ==================================================
router.get('/profile', verifyToken, requireRoles('manager'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, fullname, username, email, role, is_active 
       FROM users 
       WHERE id=$1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil profil user.' });
  }
});


module.exports = router;

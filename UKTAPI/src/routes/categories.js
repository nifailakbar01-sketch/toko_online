/**
 * @swagger
 * tags:
 *   name: CATEGORIES
 *   description: Manajemen kategori buku (Hanya manager)
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Mendapatkan semua kategori
 *     security:
 *       - bearerAuth: []
 *     tags: [CATEGORIES]
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Mendapatkan kategori berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     tags: [CATEGORIES]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Detail kategori ditemukan
 *       404:
 *         description: Kategori tidak ditemukan
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Menambahkan kategori baru
 *     security:
 *       - bearerAuth: []
 *     tags: [CATEGORIES]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Novel
 *     responses:
 *       201:
 *         description: Kategori berhasil ditambahkan
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Mengubah kategori berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     tags: [CATEGORIES]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *       404:
 *         description: Kategori tidak ditemukan
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Menghapus kategori berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     tags: [CATEGORIES]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 *       404:
 *         description: Kategori tidak ditemukan
 */


const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { verifyToken, requireRoles } = require('../middleware/authorization');

// =======================================================
// GET semua kategori
// =======================================================
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data kategori.' });
  }
});

// =======================================================
// GET kategori berdasarkan ID
// =======================================================
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data kategori.' });
  }
});

// =======================================================
// POST tambah kategori (Admin / Manager)
// =======================================================
router.post('/', verifyToken, requireRoles('manager'), async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json({
      message: 'Kategori berhasil ditambahkan.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan kategori.' });
  }
});

// =======================================================
// PUT ubah kategori (Admin / Manager)
// =======================================================
router.put('/:id', verifyToken, requireRoles('manager'), async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    res.status(200).json({
      message: 'Kategori berhasil diperbarui.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui kategori.' });
  }
});

// =======================================================
// DELETE hapus kategori (Admin / Manager)
// =======================================================
router.delete('/:id', verifyToken, requireRoles('manager'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    res.status(200).json({
      message: 'Kategori berhasil dihapus.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus kategori.' });
  }
});

module.exports = router;

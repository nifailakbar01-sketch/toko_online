/**
 * @swagger
 * tags:
 *   name: BOOKS
 *   description: Manajemen data buku (Hanya manager)
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Mendapatkan semua buku
 *     security:
 *       - bearerAuth: []
 *     tags: [BOOKS]
 *     responses:
 *       200:
 *         description: Daftar buku berhasil diambil
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Mendapatkan detail buku berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     tags: [BOOKS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID buku
 *     responses:
 *       200:
 *         description: Detail buku ditemukan
 *       404:
 *         description: Buku tidak ditemukan
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Menambahkan buku baru
 *     security:
 *       - bearerAuth: []
 *     tags: [BOOKS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Buku berhasil ditambahkan
 */

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Mengubah data buku berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     tags: [BOOKS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Buku berhasil diperbarui
 *       404:
 *         description: Buku tidak ditemukan
 */

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Menghapus buku berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     tags: [BOOKS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Buku berhasil dihapus
 *       404:
 *         description: Buku tidak ditemukan
 */


const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { verifyToken, requireRoles } = require('../middleware/authorization');

// =======================================================
// GET semua buku (siapa pun yang login bisa lihat)
// =======================================================
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.title,
        b.author,
        b.category_id,
        c.name AS category_name,
        b.price,
        b.stock,
        b.is_available,
        b.last_modified_by
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      ORDER BY b.id ASC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data buku.' });
  }
});

// =======================================================
// GET buku berdasarkan ID
// =======================================================
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.title,
        b.author,
        b.category_id,
        c.name AS category_name,
        b.price,
        b.stock,
        b.is_available,
        b.last_modified_by
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data buku.' });
  }
});

// =======================================================
// POST tambah buku (hanya manager/admin)
// =======================================================
router.post('/', verifyToken, requireRoles('manager'), async (req, res) => {
  const { title, author, category_id, price, stock, is_available } = req.body;

  try {
    // Masukkan ke tabel books
    const insertResult = await pool.query(
      `INSERT INTO books 
        (title, author, category_id, price, stock, is_available, last_modified_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, author, category_id, price, stock, is_available, req.user.id]
    );

    // Ambil data dengan JOIN kategori
    const result = await pool.query(`
      SELECT 
        b.id,
        b.title,
        b.author,
        b.category_id,
        c.name AS category_name,
        b.price,
        b.stock,
        b.is_available,
        b.last_modified_by
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = $1
    `, [insertResult.rows[0].id]);

    res.status(201).json({
      message: 'Buku berhasil ditambahkan.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan buku.' });
  }
});

// =======================================================
// PUT ubah data buku (manager/admin)
// =======================================================
router.put('/:id', verifyToken, requireRoles('manager'), async (req, res) => {
  const { id } = req.params;
  const { title, author, category_id, price, stock, is_available } = req.body;

  try {
    const result = await pool.query(
      `UPDATE books 
       SET title = $1, author = $2, category_id = $3, price = $4, stock = $5, 
           is_available = $6, last_modified_by = $7
       WHERE id = $8
       RETURNING *`,
      [title, author, category_id, price, stock, is_available, req.user.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan.' });
    }

    res.status(200).json({
      message: 'Buku berhasil diperbarui.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui buku.' });
  }
});

// =======================================================
// DELETE hapus buku (manager/admin)
// =======================================================
router.delete('/:id', verifyToken, requireRoles('manager'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan.' });
    }

    res.status(200).json({
      message: 'Buku berhasil dihapus.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus buku.' });
  }
});

module.exports = router;

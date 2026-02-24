/**
 * @swagger
 * tags:
 *   name: ORDERS
 *   description: Transaksi pemesanan buku (Hanya kasir)
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Mendapatkan semua order
 *     security:
 *       - bearerAuth: []
 *     tags: [ORDERS]
 *     responses:
 *       200:
 *         description: Daftar order berhasil diambil
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Mendapatkan detail order berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     tags: [ORDERS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID order
 *     responses:
 *       200:
 *         description: Detail order ditemukan
 *       404:
 *         description: Order tidak ditemukan
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Membuat order baru
 *     security:
 *       - bearerAuth: []
 *     tags: [ORDERS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     book_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order berhasil dibuat
 */

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Memperbarui status order berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     tags: [ORDERS]
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
 *               status:
 *                 type: string
 *                 example: cancelled
 *     responses:
 *       200:
 *         description: Status order berhasil diperbarui
 *       404:
 *         description: Order tidak ditemukan
 */
/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Menghapus order berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     tags: [ORDERS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID order yang akan dihapus
 *     responses:
 *       200:
 *         description: Order berhasil dihapus
 *       404:
 *         description: Order tidak ditemukan
 *       500:
 *         description: Gagal menghapus order
 */


const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { verifyToken, requireRoles } = require('../middleware/authorization');

// =======================================================
// GET semua order (hanya kasir)
// =======================================================
router.get('/', verifyToken, requireRoles('kasir','manager'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, u.fullname AS customer_name
      FROM orders o
      LEFT JOIN users u ON o.id_user = u.id
      ORDER BY o.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data order.' });
  }
});

// =======================================================
// GET order milik user sendiri (hanya kasir)
// =======================================================
router.get('/my', verifyToken, requireRoles('kasir'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE id_user=$1 ORDER BY id DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil order milik user.' });
  }
});

// =======================================================
// POST buat order baru (hanya kasir)
// =======================================================
router.post('/', verifyToken, requireRoles('kasir'), async (req, res) => {
  const { items } = req.body;

  try {
    let total = 0;

    // Hitung total harga
    for (const item of items) {
      const priceRes = await pool.query('SELECT price FROM books WHERE id=$1', [item.book_id]);
      if (priceRes.rows.length === 0)
        return res.status(400).json({ message: `Buku dengan ID ${item.book_id} tidak ditemukan.` });

      total += priceRes.rows[0].price * item.quantity;
    }

    // Buat order
    const orderRes = await pool.query(
      'INSERT INTO orders (id_user, total_price, status, created_at) VALUES ($1,$2,$3,CURRENT_TIMESTAMP) RETURNING *',
      [req.user.id, total, 'paid']
    );

    const orderId = orderRes.rows[0].id;

    // Isi order_items
    for (const item of items) {
      const priceRes = await pool.query('SELECT price FROM books WHERE id=$1', [item.book_id]);
      await pool.query(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES ($1,$2,$3,$4)',
        [orderId, item.book_id, item.quantity, priceRes.rows[0].price]
      );
    }

    res.json({ message: 'Order berhasil dibuat.', order_id: orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal membuat order.' });
  }
});

// =======================================================
// GET detail order by ID (hanya kasir)
// =======================================================
router.get('/:id', verifyToken, requireRoles('kasir'), async (req, res) => {
  const { id } = req.params;

  try {
    const order = await pool.query('SELECT * FROM orders WHERE id=$1', [id]);
    if (order.rows.length === 0) {
      return res.status(404).json({ message: 'Order tidak ditemukan.' });
    }

    const items = await pool.query(
      `SELECT oi.*, b.title 
       FROM order_items oi
       LEFT JOIN books b ON oi.book_id = b.id
       WHERE oi.order_id=$1`,
      [id]
    );

    res.json({ order: order.rows[0], items: items.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil detail order.' });
  }
});

// =======================================================
// PUT ubah status order (hanya kasir)
// =======================================================
router.put('/:id', verifyToken, requireRoles('kasir'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ['pending', 'paid', 'cancelled'];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid. Gunakan: pending, paid, atau cancelled." });
  }

  try {
    const result = await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order tidak ditemukan." });
    }

    res.status(200).json({
      message: "Status order berhasil diperbarui.",
      order: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui status order." });
  }
});

// =======================================================
// DELETE hapus order (hanya kasir)
// =======================================================
router.delete('/:id', verifyToken, requireRoles('kasir'), async (req, res) => {
  const { id } = req.params;

  try {
    // Hapus order_items terlebih dahulu (foreign key constraint)
    await pool.query('DELETE FROM order_items WHERE order_id=$1', [id]);
    
    // Hapus order
    const result = await pool.query(
      'DELETE FROM orders WHERE id=$1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order tidak ditemukan." });
    }

    res.status(200).json({
      message: "Order berhasil dihapus.",
      order: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus order." });
  }
});

module.exports = router;

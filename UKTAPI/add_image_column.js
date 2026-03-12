const pool = require('./src/db/pool');

async function addImageColumn() {
  try {
    // Cek apakah kolom sudah ada
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'books' AND column_name = 'image_url'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✅ Kolom image_url sudah ada di tabel books');
      process.exit(0);
    }

    // Tambah kolom image_url
    await pool.query(`
      ALTER TABLE books 
      ADD COLUMN image_url TEXT DEFAULT NULL
    `);

    console.log('✅ Kolom image_url berhasil ditambahkan ke tabel books');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

addImageColumn();

const pool = require('./src/db/pool');

async function addDescriptionColumn() {
  try {
    // Cek apakah kolom sudah ada
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'books' AND column_name = 'description'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✅ Kolom description sudah ada di tabel books');
      process.exit(0);
    }

    // Tambah kolom description
    await pool.query(`
      ALTER TABLE books 
      ADD COLUMN description TEXT DEFAULT NULL
    `);

    console.log('✅ Kolom description berhasil ditambahkan ke tabel books');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

addDescriptionColumn();

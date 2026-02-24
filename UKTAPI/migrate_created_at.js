const pool = require('./src/db/pool');

async function migrate() {
  try {
    console.log('🔄 Memulai migrasi database...');
    
    // 1. Tambahkan kolom created_at jika belum ada
    console.log('📝 Menambahkan kolom created_at (jika belum ada)...');
    await pool.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
    console.log('✅ Kolom created_at siap');
    
    // 2. Update data lama yang memiliki created_at NULL
    console.log('🔄 Mengupdate data pesanan lama dengan tanggal...');
    const updateRes = await pool.query(`
      UPDATE orders 
      SET created_at = NOW() 
      WHERE created_at IS NULL;
    `);
    console.log(`✅ Updated ${updateRes.rowCount} baris`);
    
    // 3. Verifikasi data
    console.log('🔍 Verifikasi data...');
    const checkRes = await pool.query(`
      SELECT id, id_user, total_price, status, created_at 
      FROM orders 
      ORDER BY id DESC LIMIT 5;
    `);
    console.log('📊 Sample orders:');
    console.table(checkRes.rows);
    
    // 4. Cek NULL values
    const nullRes = await pool.query(`
      SELECT COUNT(*) as null_count FROM orders WHERE created_at IS NULL;
    `);
    console.log(`📈 Baris dengan created_at NULL: ${nullRes.rows[0].null_count}`);
    
    console.log('✅ Migrasi selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error migrasi:', error.message);
    process.exit(1);
  }
}

migrate();

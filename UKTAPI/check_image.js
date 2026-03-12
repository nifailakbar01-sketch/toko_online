const pool = require('./src/db/pool');

async function checkImage() {
  try {
    const result = await pool.query('SELECT id, title, image_url FROM books ORDER BY id DESC LIMIT 5');
    console.log('\n📚 Data Buku (5 terbaru):\n');
    console.log(JSON.stringify(result.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkImage();

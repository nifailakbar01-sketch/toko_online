import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Layout, LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/Common';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

/**
 * ========================================
 * BOOKS PAGE - Manajemen & Pembelian Buku
 * ========================================
 * 
 * FUNGSI UTAMA:
 * - Manager: CRUD (Create, Read, Update, Delete) buku dengan gambar, harga, stok, deskripsi
 * - Pelanggan/Kasir: Lihat daftar buku, filter kategori, lihat detail, tambah ke keranjang, checkout
 * 
 * FITUR UTAMA:
 * ✅ Tampilan Grid Responsive - Kartu buku dengan gambar dan info singkat
 * ✅ Filter Kategori - Tombol kategori untuk filter buku per kategori
 * ✅ Modal Detail - Melihat informasi lengkap buku (gambar besar, deskripsi full)
 * ✅ Shopping Cart - Tambah multiple buku dengan quantity management
 * ✅ Floating Cart Button - Tombol cart di sudut kanan bawah untuk checkout
 * ✅ CRUD Buku (Manager Only) - Edit gambar, deskripsi, harga, stok; Hapus buku
 * 
 * STRUKTUR STATE:
 * - books: Array semua buku dari API
 * - categories: Array semua kategori untuk filter
 * - cartItems: Array item yang ditambahkan ke keranjang
 * - selectedCategoryId: ID kategori yang dipilih (null = semua buku)
 * - showDetailModal: Kontrol modal detail buku
 * - showCartModal: Kontrol modal keranjang belanja
 * - formData: State untuk form edit/tambah buku
 * 
 * ALUR PEMESANAN (Pelanggan):
 * 1. Pilih kategori → Filter buku
 * 2. Klik "Detail" → Lihat informasi lengkap
 * 3. Klik "Pesan" di detail → Tambah ke keranjang
 * 4. Button 🛒 muncul → Klik untuk view keranjang
 * 5. Ubah quantity, lihat total → Klik "Checkout & Buat Pesanan"
 * 
 * ALUR MANAJEMEN BUKU (Manager):
 * 1. Klik "Edit" → Modal form muncul
 * 2. Ubah data (title, author, kategori, harga, stok, gambar, deskripsi)
 * 3. Klik "Perbarui" → Data tersimpan ke database
 * 4. Klik "Hapus" → Konfirmasi → Buku dihapus
 * 
 * ======================================== */

export const BooksPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  // Data dari API
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal Controls
  const [showModal, setShowModal] = useState(false);        // Form Edit/Tambah Buku
  const [showCartModal, setShowCartModal] = useState(false); // Keranjang Belanja
  const [showDetailModal, setShowDetailModal] = useState(false); // Detail Buku
  
  // Data for Modal
  const [editingId, setEditingId] = useState(null);       // ID buku yang sedang diedit (null = menambah baru)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Filter kategori (null = semua buku)
  const [selectedBook, setSelectedBook] = useState(null); // Buku yang dipilih untuk detail
  
  // Shopping Cart
  const [cartItems, setCartItems] = useState([]); // Array of { book_id, title, author, price, image_url, quantity, stock }
  
  // Form Data untuk Edit/Tambah
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: '',
    description: '',
  });

  // ========================================
  // LOAD DATA BUKU DAN KATEGORI
  // ========================================
  useEffect(() => {
    loadBooks();
    loadCategories();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/books');
      setBooks(response.data);
    } catch (err) {
      setError('Gagal memuat data buku');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Gagal memuat kategori:', err);
    }
  };

  // ========================================
  // Tambah/Edit buku
  // ========================================
  // CRUD HANDLERS - MANAGER FUNCTIONS
  // ========================================
  // Membuka modal form untuk tambah buku baru atau edit buku existing
  // @param book - null untuk tambah baru, atau object buku untuk edit
  const handleShowModal = (book = null) => {
    if (book) {
      // EDIT MODE: Load data buku yang sudah ada ke form
      setEditingId(book.id);
      setFormData({
        title: book.title,
        author: book.author,
        price: book.price,
        stock: book.stock,
        category_id: book.category_id,
        image_url: book.image_url || '',
        description: book.description || '',
      });
    } else {
      // ADD MODE: Reset form ke state kosong
      setEditingId(null);
      setFormData({ title: '', author: '', price: '', stock: '', category_id: '', image_url: '', description: '' });
    }
    setShowModal(true);
  };

  // ========================================
  // COMPRESS IMAGE - KURANGI UKURAN FILE
  // ========================================
  // Kompres gambar dengan menurunkan resolusi dan quality
  // Gunakan Canvas untuk resize dan convert ke JPEG dengan kualitas 70%
  // @param file - File gambar yang dipilih
  // @returns Promise dengan dataUrl hasil kompresi
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Tentukan max width untuk gambar (misal 1200px)
          const MAX_WIDTH = 1200;
          let width = img.width;
          let height = img.height;
          
          // Jika gambar lebih besar dari MAX_WIDTH, resize proportional
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          // Buat canvas dan draw gambar yang sudah di-resize
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert ke JPEG dengan quality 70% (lebih kecil dari PNG tapi tetap bagus)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        
        img.onerror = () => {
          reject(new Error('Gagal memuat gambar'));
        };
        
        img.src = e.target.result;
      };
      
      reader.onerror = () => {
        reject(new Error('Gagal membaca file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  // ========================================
  // HANDLE IMAGE UPLOAD - KONVERSI FILE KE BASE64
  // ========================================
  // Mengonversi file gambar yang dipilih menjadi base64 data URL dengan kompresi otomatis
  // - Validasi format dan ukuran file
  // - Compress image untuk mengurangi ukuran
  // - Convert ke base64 untuk menyimpan di database
  // @param e - File input event
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Validasi ukuran file (max 10MB sebelum kompresi, untuk keperluan)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_SIZE) {
      setError('Ukuran file terlalu besar. Maksimal 10MB');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Kompresi gambar sebelum convert ke base64
    setSuccess('Memproses gambar...');
    compressImage(file)
      .then((compressedDataUrl) => {
        // Estimate ukuran base64 (base64 ~33% lebih besar dari binary)
        const estimatedSize = Math.round((compressedDataUrl.length * 3) / 4 / 1024); // KB
        
        setFormData({ ...formData, image_url: compressedDataUrl });
        setSuccess(`✓ Gambar berhasil dimuat (${estimatedSize}KB)`);
        setTimeout(() => setSuccess(''), 2000);
      })
      .catch((err) => {
        setError(err.message || 'Gagal memproses gambar');
        setTimeout(() => setError(''), 3000);
      });
  };

  // Submit form untuk TAMBAH atau EDIT buku
  // Jika editingId ada: gunakan PUT (update), jika tidak: gunakan POST (create)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE existing buku
        await apiClient.put(`/books/${editingId}`, formData);
        setSuccess('Buku berhasil diperbarui');
      } else {
        // CREATE buku baru
        await apiClient.post('/books', formData);
        setSuccess('Buku berhasil ditambahkan');
      }
      setShowModal(false);
      loadBooks(); // Refresh data dari API
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan buku');
    }
  };

  // ========================================
  // HAPUS BUKU - MANAGER FUNCTION
  // ========================================
  // Menghapus buku dari database dengan konfirmasi
  // @param id - ID buku yang akan dihapus
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) return;
    try {
      await apiClient.delete(`/books/${id}`);
      setSuccess('Buku berhasil dihapus');
      loadBooks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Gagal menghapus buku');
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || '-';
  };

  // ========================================
  // DETAIL BUKU HANDLER
  // ========================================
  // Menampilkan modal dengan informasi lengkap buku
  // Modal ini menampilkan gambar besar, deskripsi full, dan tombol pesan
  const handleShowDetail = (book) => {
    setSelectedBook(book);
    setShowDetailModal(true);
  };

  // ========================================
  // SHOPPING CART HANDLERS - PELANGGAN/KASIR
  // ========================================
  // Menambahkan buku ke keranjang belanja
  // - Jika buku sudah ada di cart: increment quantity (max = stok tersedia)
  // - Jika buku baru: tambahkan ke array cartItems
  const handleAddToCart = (book) => {
    const existingItem = cartItems.find(item => item.book_id === book.id);
    
    if (existingItem) {
      // Jika buku sudah ada di cart, tambah quantity (tidak melebihi stok)
      if (existingItem.quantity < book.stock) {
        setCartItems(cartItems.map(item =>
          item.book_id === book.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        setSuccess(`Jumlah ${book.title} ditambah menjadi ${existingItem.quantity + 1}`);
      } else {
        setError(`Stok ${book.title} hanya tersedia ${book.stock} unit`);
      }
    } else {
      // Tambahkan buku baru ke cart dengan quantity = 1
      setCartItems([...cartItems, {
        book_id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        image_url: book.image_url || '',
        quantity: 1,
        stock: book.stock
      }]);
      setSuccess(`${book.title} ditambahkan ke keranjang`);
    }
    setTimeout(() => setSuccess(''), 2000);
  };

  // Menghapus item dari keranjang belanja
  const handleRemoveFromCart = (book_id) => {
    setCartItems(cartItems.filter(item => item.book_id !== book_id));
  };

  // Mengubah quantity item di keranjang
  // Validasi: quantity tidak boleh 0, tidak boleh melebihi stok
  const handleUpdateQuantity = (book_id, newQuantity) => {
    const item = cartItems.find(item => item.book_id === book_id);
    if (item && newQuantity > 0 && newQuantity <= item.stock) {
      setCartItems(cartItems.map(item =>
        item.book_id === book_id
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  // SUBMIT ORDER - Membuat pesanan ke API
  // Mengubah cartItems menjadi format order dan mengirim ke backend
  // Setelah sukses: tutup modal, kosongkan cart, tampilkan order ID
  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      setError('Keranjang masih kosong');
      return;
    }

    try {
      // Format data untuk API: hanya kirm book_id dan quantity
      const orderData = {
        items: cartItems.map(item => ({
          book_id: item.book_id,
          quantity: item.quantity
        }))
      };

      // Kirim pesanan ke API
      const response = await apiClient.post('/orders', orderData);
      setSuccess(`Pesanan berhasil dibuat! Order ID: ${response.data.id}`);
      setShowCartModal(false);
      setCartItems([]); // Kosongkan keranjang setelah checkout
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pesanan');
    }
  };

  // Menghitung total harga keranjang = SUM(harga * quantity)
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Filter buku berdasarkan kategori yang dipilih (null = tampilkan semua)
  const displayedBooks = selectedCategoryId 
    ? books.filter((book) => book.category_id === selectedCategoryId)
    : books;

  if (loading) return <LoadingSpinner />;

  // ========================================
  // RENDER UI
  // ========================================
  // Struktur Halaman:
  // 1. Header - Title dan back button
  // 2. Manager Button - "Tambah Buku Baru" (hanya manager)
  // 3. Category Filter - Tombol kategori untuk filter (Row responsive)
  // 4. Books Grid - Kartu buku dalam grid responsive (4 kolom desktop, 3 tablet, 2 mobile, 1 hp)
  // 5. 4x Modal - Detail, Cart, Form, Detail Modal
  // 6. Floating Button - Cart button di sudut kanan bawah (jika ada item)

  return (
    <Layout title="📚 Daftar Buku" subtitle="Kelola data buku toko Anda">
      {/* Alert Messages - Error dan Success */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}

      {/* Header dengan Back Button */}
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={() => navigate(-1)}>← Kembali</Button>
        </Col>
      </Row>

      {/* Manager Button - Tambah Buku Baru */}
      {user?.role === 'manager' && (
        <div className="mb-4">
          <Button variant="success" onClick={() => handleShowModal()}>
            + Tambah Buku Baru
          </Button>
        </div>
      )}

      {/* Categories Filter Frame */}
      <Card className="mb-4 shadow-sm border border-primary" style={{ borderWidth: '2px' }}>
        <Card.Header className="bg-light border-bottom border-primary" style={{ borderWidth: '2px' }}>
          <h6 className="mb-0 text-dark">📂 Kategori Buku</h6>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-2">
            {/* All Books Button */}
            <Button
              variant={selectedCategoryId === null ? 'primary' : 'outline-secondary'}
              size="sm"
              onClick={() => setSelectedCategoryId(null)}
              className="rounded-pill"
            >
              📋 Semua Buku <span className="badge bg-secondary ms-2">{books.length}</span>
            </Button>

            {/* Category Buttons */}
            {categories.map((category) => {
              const bookCount = books.filter((b) => b.category_id === category.id).length;
              const isSelected = selectedCategoryId === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? 'primary' : 'outline-secondary'}
                  size="sm"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className="rounded-pill"
                  disabled={bookCount === 0}
                >
                  {category.name} <span className="badge bg-secondary ms-2">{bookCount}</span>
                </Button>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      {/* Books Display */}
      <div>
        <div className="mb-3">
          <h6>
            {selectedCategoryId === null 
              ? `📋 Semua Buku (${displayedBooks.length})` 
              : `📚 ${getCategoryName(selectedCategoryId)} (${displayedBooks.length} buku)`}
          </h6>
        </div>

        {displayedBooks.length === 0 ? (
          <Alert variant="info">Tidak ada buku di kategori ini</Alert>
        ) : (
          <Row>
            {displayedBooks.map((book) => (
              <Col key={book.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm border-0 hover-card" style={{ cursor: 'pointer' }}>
                  {/* Book Image */}
                  <div style={{
                    width: '100%',
                    height: '250px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px 8px 0 0',
                    overflow: 'hidden'
                  }}>
                    {book.image_url ? (
                      <img 
                        src={book.image_url} 
                        alt={book.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: '60px' }}>📖</div>
                    )}
                  </div>

                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-truncate" title={book.title}>
                      {book.title}
                    </Card.Title>
                    <Card.Subtitle className="text-muted small mb-2 text-truncate">
                      {book.author}
                    </Card.Subtitle>
                    <Card.Text className="text-muted small mb-2">
                      {getCategoryName(book.category_id)}
                    </Card.Text>

                    {book.description && (
                      <Card.Text className="small text-secondary mb-2" style={{
                        maxHeight: '60px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {book.description}
                      </Card.Text>
                    )}

                    <div className="mb-2">
                      <h6 className="text-success fw-bold">
                        Rp {book.price?.toLocaleString('id-ID')}
                      </h6>
                    </div>

                    <div className="mb-3">
                      <span className={`badge ${book.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {book.stock} unit
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto d-grid gap-2">
                      <Button 
                        variant="info" 
                        size="sm"
                        onClick={() => handleShowDetail(book)}
                      >
                        👁️ Detail
                      </Button>
                      {user?.role === 'manager' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="warning" 
                            onClick={() => handleShowModal(book)}
                          >
                            ✏️ Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger" 
                            onClick={() => handleDelete(book.id)}
                          >
                            🗑️ Hapus
                          </Button>
                        </>
                      )}
                      {user?.role !== 'manager' && (
                        <Button 
                          variant="primary" 
                          onClick={() => handleAddToCart(book)}
                          disabled={book.stock <= 0}
                          title={book.stock <= 0 ? 'Stok habis' : 'Tambah ke keranjang'}
                        >
                          🛒 Pesan
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Modal Keranjang Belanja */}
      <Modal show={showCartModal} onHide={() => setShowCartModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🛒 Keranjang Belanja ({cartItems.length})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartItems.length === 0 ? (
            <Alert variant="info">Keranjang masih kosong. Tambahkan buku untuk melanjutkan.</Alert>
          ) : (
            <div>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Buku</th>
                    <th>Harga</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.book_id}>
                      <td>
                        <div>
                          <strong>{item.title}</strong>
                          <br />
                          <small className="text-muted">{item.author}</small>
                        </div>
                      </td>
                      <td>Rp {item.price?.toLocaleString('id-ID')}</td>
                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          max={item.stock}
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.book_id, parseInt(e.target.value))}
                          style={{ width: '70px' }}
                        />
                      </td>
                      <td>Rp {(item.price * item.quantity)?.toLocaleString('id-ID')}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleRemoveFromCart(item.book_id)}
                        >
                          ✕
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="mt-3 p-3 bg-light rounded border">
                <Row>
                  <Col>
                    <h6>Total Pesanan:</h6>
                  </Col>
                  <Col className="text-end">
                    <h6 className="text-success fw-bold">
                      Rp {calculateTotal()?.toLocaleString('id-ID')}
                    </h6>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>
            Lanjut Belanja
          </Button>
          <Button 
            variant="success" 
            onClick={handleSubmitOrder}
            disabled={cartItems.length === 0}
          >
            ✓ Checkout & Buat Pesanan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Shopping Cart Button - Floating */}
      {user?.role !== 'manager' && cartItems.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1000
        }}>
          <Button
            size="lg"
            variant="success"
            onClick={() => setShowCartModal(true)}
            className="rounded-circle"
            style={{
              width: '70px',
              height: '70px',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            🛒 {cartItems.length}
          </Button>
        </div>
      )}

      {/* Modal Detail Buku */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📖 Detail Buku</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook && (
            <div>
              <Row>
                <Col md={4}>
                  <div style={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '15px'
                  }}>
                    {selectedBook.image_url ? (
                      <img 
                        src={selectedBook.image_url} 
                        alt={selectedBook.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: '80px' }}>📖</div>
                    )}
                  </div>
                </Col>
                <Col md={8}>
                  <h4 className="fw-bold mb-2">{selectedBook.title}</h4>
                  
                  <div className="mb-3">
                    <strong>Pengarang:</strong> {selectedBook.author}
                  </div>

                  <div className="mb-3">
                    <strong>Kategori:</strong> {getCategoryName(selectedBook.category_id)}
                  </div>

                  <div className="mb-3">
                    <strong>Harga:</strong>
                    <h5 className="text-success fw-bold">Rp {selectedBook.price?.toLocaleString('id-ID')}</h5>
                  </div>

                  <div className="mb-3">
                    <strong>Stok:&nbsp;</strong>
                    <span className={`badge ${selectedBook.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {selectedBook.stock} unit
                    </span>
                  </div>
                </Col>
              </Row>

              {selectedBook.description && (
                <div className="mt-4">
                  <h6 className="fw-bold mb-2">Deskripsi:</h6>
                  <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedBook.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {user?.role !== 'manager' && selectedBook?.stock > 0 && (
            <Button 
              variant="primary" 
              onClick={() => {
                handleAddToCart(selectedBook);
                setShowDetailModal(false);
              }}
            >
              🛒 Tambah ke Keranjang
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Form Tambah/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Buku' : 'Tambah Buku Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Judul Buku</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pengarang</Form.Label>
              <Form.Control
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Harga</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stok</Form.Label>
              <Form.Control
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gambar Buku</Form.Label>
              
              {/* File Upload */}
              <Form.Group className="mb-3">
                <Form.Label className="text-muted" style={{ fontSize: '0.9rem' }}>Pilih Foto dari File</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                />
                <small className="text-muted d-block mt-2">
                  Format: JPG, PNG, WebP, GIF (Max 10MB) • Gambar otomatis di-kompresi untuk performa lebih baik
                </small>
              </Form.Group>

              {/* URL Input */}
              <Form.Group className="mb-3">
                <Form.Label className="text-muted" style={{ fontSize: '0.9rem' }}>atau Paste URL Gambar</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://contoh.com/gambar-buku.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </Form.Group>

              {/* Preview */}
              {formData.image_url && (
                <div className="mt-3 p-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <small className="text-muted d-block mb-2">✓ Preview Gambar:</small>
                  <div style={{
                    width: '100%',
                    height: '150px',
                    overflow: 'hidden',
                    borderRadius: '4px',
                    backgroundColor: '#e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span style="color: #6c757d; font-size: 0.9rem;">Gagal memuat gambar</span>';
                      }}
                    />
                  </div>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Deskripsi Buku</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Masukkan deskripsi atau sinopsis buku..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {editingId ? 'Perbarui' : 'Tambahkan'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

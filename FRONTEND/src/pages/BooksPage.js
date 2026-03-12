import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Layout, LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/Common';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

export const BooksPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // null = semua buku
  const [showCartModal, setShowCartModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [cartItems, setCartItems] = useState([]); // Array of { book_id, title, author, price, quantity, stock }
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
  // Load data buku dan kategori
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
  const handleShowModal = (book = null) => {
    if (book) {
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
      setEditingId(null);
      setFormData({ title: '', author: '', price: '', stock: '', category_id: '', image_url: '', description: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/books/${editingId}`, formData);
        setSuccess('Buku berhasil diperbarui');
      } else {
        await apiClient.post('/books', formData);
        setSuccess('Buku berhasil ditambahkan');
      }
      setShowModal(false);
      loadBooks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan buku');
    }
  };

  // ========================================
  // Hapus buku
  // ========================================
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
  // Handler untuk detail buku
  // ========================================
  const handleShowDetail = (book) => {
    setSelectedBook(book);
    setShowDetailModal(true);
  };

  // ========================================
  // Handler untuk shopping cart
  // ========================================
  const handleAddToCart = (book) => {
    const existingItem = cartItems.find(item => item.book_id === book.id);
    
    if (existingItem) {
      // Jika buku sudah ada di cart, tambah quantity
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
      // Tambahkan buku baru ke cart
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

  const handleRemoveFromCart = (book_id) => {
    setCartItems(cartItems.filter(item => item.book_id !== book_id));
  };

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

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      setError('Keranjang masih kosong');
      return;
    }

    try {
      const orderData = {
        items: cartItems.map(item => ({
          book_id: item.book_id,
          quantity: item.quantity
        }))
      };

      const response = await apiClient.post('/orders', orderData);
      setSuccess(`Pesanan berhasil dibuat! Order ID: ${response.data.id}`);
      setShowCartModal(false);
      setCartItems([]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pesanan');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Filter buku berdasarkan kategori yang dipilih
  const displayedBooks = selectedCategoryId 
    ? books.filter((book) => book.category_id === selectedCategoryId)
    : books;

  if (loading) return <LoadingSpinner />;

  return (
    <Layout title="📚 Daftar Buku" subtitle="Kelola data buku toko Anda">
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}

      {/* Header dengan Back Button */}
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={() => navigate(-1)}>← Kembali</Button>
        </Col>
      </Row>

      {/* Manager Add Button */}
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
              <Form.Label>URL Gambar Buku</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://contoh.com/gambar-buku.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
              {formData.image_url && (
                <div className="mt-2">
                  <small className="text-muted">Preview:</small>
                  <div style={{
                    marginTop: '10px',
                    width: '100%',
                    height: '150px',
                    overflow: 'hidden',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0',
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
                      onError={(e) => e.target.style.display = 'none'}
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

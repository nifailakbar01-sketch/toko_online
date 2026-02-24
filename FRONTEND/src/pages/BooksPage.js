import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { Layout, LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/Common';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

export const BooksPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    stock: '',
    category_id: '',
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
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', author: '', price: '', stock: '', category_id: '' });
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

  // Filter buku berdasarkan kategori yang dipilih
  const displayedBooks = selectedCategoryId 
    ? books.filter((book) => book.category_id === selectedCategoryId)
    : books;

  if (loading) return <LoadingSpinner />;

  return (
    <Layout title="📚 Daftar Buku" subtitle="Kelola data buku toko Anda">
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}

      {/* Jika belum ada kategori yang dipilih, tampilkan daftar kategori */}
      {selectedCategoryId === null ? (
        <>
          {user?.role === 'manager' && (
            <div className="mb-4">
              <Button variant="success" onClick={() => handleShowModal()}>
                + Tambah Buku Baru
              </Button>
            </div>
          )}

          <h5 className="mb-3">📂 Pilih Kategori</h5>
          <Row className="mb-5">
            {categories.map((category) => {
              const bookCount = books.filter((b) => b.category_id === category.id).length;
              return (
                <Col md={4} lg={3} key={category.id} className="mb-3">
                  <Card 
                    className="h-100 cursor-pointer"
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    <Card.Body className="text-center">
                      <Card.Title>{category.name}</Card.Title>
                      <p className="text-muted small">
                        {bookCount} buku
                      </p>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => setSelectedCategoryId(category.id)}
                      >
                        Lihat Buku
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      ) : (
        <>
          {/* Saat kategori sudah dipilih, tampilkan daftar buku dari kategori tersebut */}
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              📚 {getCategoryName(selectedCategoryId)} ({displayedBooks.length} buku)
            </h5>
            <div>
              {user?.role === 'manager' && (
                <Button variant="success" onClick={() => handleShowModal()} className="me-2">
                  + Tambah Buku
                </Button>
              )}
              <Button 
                variant="secondary" 
                onClick={() => setSelectedCategoryId(null)}
              >
                ← Kembali ke Kategori
              </Button>
            </div>
          </div>

          {displayedBooks.length === 0 ? (
            <Alert variant="info">Tidak ada buku di kategori ini</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Judul</th>
                  <th>Pengarang</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  {user?.role === 'manager' && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {displayedBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>Rp {book.price?.toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`badge ${book.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {book.stock} unit
                      </span>
                    </td>
                    {user?.role === 'manager' && (
                      <td>
                        <Button size="sm" variant="warning" onClick={() => handleShowModal(book)} className="me-2">
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(book.id)}>
                          Hapus
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}

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

            <Button variant="primary" type="submit" className="w-100">
              {editingId ? 'Perbarui' : 'Tambahkan'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

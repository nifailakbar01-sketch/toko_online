import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Layout, LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/Common';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');

  // ========================================
  // Load data kategori
  // ========================================
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Gagal memuat data kategori');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Tambah/Edit kategori
  // ========================================
  const handleShowModal = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setName(category.name);
    } else {
      setEditingId(null);
      setName('');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/categories/${editingId}`, { name });
        setSuccess('Kategori berhasil diperbarui');
      } else {
        await apiClient.post('/categories', { name });
        setSuccess('Kategori berhasil ditambahkan');
      }
      setShowModal(false);
      loadCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan kategori');
    }
  };

  // ========================================
  // Hapus kategori
  // ========================================
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
    try {
      await apiClient.delete(`/categories/${id}`);
      setSuccess('Kategori berhasil dihapus');
      loadCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Gagal menghapus kategori');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout title="📂 Manajemen Kategori" subtitle="Kelola kategori buku">
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}

      <Row className="mb-3">
        <Col>
          <Button variant="secondary" onClick={() => navigate(-1)}>← Kembali</Button>
        </Col>
      </Row>

      <div className="mb-4">
        <Button variant="success" onClick={() => handleShowModal()}>
          + Tambah Kategori Baru
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Kategori</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleShowModal(cat)} className="me-2">
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(cat.id)}>
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Kategori' : 'Tambah Kategori'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Kategori</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Novel, Pelajaran, Komik"
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

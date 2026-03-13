import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Layout, LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/Common';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

export const UsersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    role: 'pelanggan',
    is_active: true,
  });

  // ========================================
  // Load data pengguna
  // ========================================
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Tambah pengguna
  // ========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/users', formData);
      setSuccess('Pengguna berhasil ditambahkan');
      setShowModal(false);
      setFormData({
        fullname: '',
        username: '',
        email: '',
        password: '',
        role: 'pelanggan',
        is_active: true,
      });
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambah pengguna');
    }
  };

  // ========================================
  // Update status pengguna
  // ========================================
  const handleToggleActive = async (id, currentStatus) => {
    try {
      await apiClient.put(`/users/${id}`, { is_active: !currentStatus });
      setSuccess('Status pengguna berhasil diperbarui');
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Gagal memperbarui status pengguna');
    }
  };

  // ========================================
  // Hapus pengguna
  // ========================================
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
    try {
      await apiClient.delete(`/users/${id}`);
      setSuccess('Pengguna berhasil dihapus');
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Gagal menghapus pengguna');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout title="👥 Manajemen Pengguna" subtitle="Kelola semua pengguna sistem">
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}

      <Row className="mb-3">
        <Col>
          <Button variant="secondary" onClick={() => navigate(-1)}>← Kembali</Button>
        </Col>
      </Row>

      {user?.role === 'manager' && (
        <div className="mb-4">
          <Button variant="success" onClick={() => setShowModal(true)}>
            + Tambah Pengguna Baru
          </Button>
        </div>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Lengkap</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullname}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <span className="badge bg-info">{u.role}</span>
              </td>
              <td>
                <span className={`badge ${u.is_active ? 'bg-success' : 'bg-danger'}`}>
                  {u.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </td>
              <td>
                {user?.role === 'manager' && (
                  <>
                    <Button
                      size="sm"
                      variant={u.is_active ? 'warning' : 'success'}
                      onClick={() => handleToggleActive(u.id, u.is_active)}
                      className="me-2"
                    >
                      {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)}>
                      Hapus
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Tambah Pengguna */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tambah Pengguna Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control
                type="text"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="pelanggan">Pelanggan</option>
                <option value="kasir">Kasir</option>
                <option value="manager">Manager</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Aktif"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Tambahkan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

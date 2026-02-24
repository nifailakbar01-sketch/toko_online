import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // ========================================
  // Load statistics
  // ========================================
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Mengambil data untuk stats
      const booksRes = await apiClient.get('/books').catch(() => ({ data: [] }));
      const ordersRes = await apiClient.get('/orders').catch(() => ({ data: [] }));

      const totalRevenue = ordersRes.data.reduce((acc, order) => {
        return acc + (parseFloat(order.total_price) || 0);
      }, 0);

      setStats({
        totalBooks: booksRes.data.length,
        totalOrders: ordersRes.data.length,
        totalRevenue,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card className={`text-white bg-${color} mb-3`}>
      <Card.Body>
        <Row>
          <Col xs={8}>
            <p className="mb-0 small">{title}</p>
            <h3 className="mb-0">{value}</h3>
          </Col>
          <Col xs={4} className="text-end">
            <h2>{icon}</h2>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3">Memuat dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">
        Selamat datang, <strong>{user?.fullname}</strong>! 👋
      </h1>
      <p className="text-muted mb-4">Role: <strong>{user?.role}</strong></p>

      <Row className="mb-4">
        <Col md={3}>
          <StatCard title="Total Buku" value={stats.totalBooks} icon="📚" color="primary" />
        </Col>
        <Col md={3}>
          <StatCard title="Total Pesanan" value={stats.totalOrders} icon="📦" color="success" />
        </Col>
        <Col md={3}>
          <StatCard
            title="Total Pendapatan"
            value={`Rp ${stats.totalRevenue?.toLocaleString('id-ID')}`}
            icon="💰"
            color="warning"
          />
        </Col>
        {user?.role === 'manager' && (
          <Col md={3}>
            <StatCard title="Menu Manager" value="Aktif" icon="⚙️" color="info" />
          </Col>
        )}
      </Row>

      <Card>
        <Card.Body>
          <h5>Akses Cepat</h5>
          <hr />
          <Row>
            {user?.role === 'manager' ? (
              <>
                <Col md={6} className="mb-3">
                  <h6>📚 <a href="/books">Manajemen Buku</a></h6>
                  <p className="text-muted small">Tambah, edit, atau hapus data buku</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>📂 <a href="/categories">Manajemen Kategori</a></h6>
                  <p className="text-muted small">Kelola kategori buku</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>👥 <a href="/users">Manajemen Pengguna</a></h6>
                  <p className="text-muted small">Kelola akun pengguna sistem</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>📊 <a href="/orders">Laporan Pesanan</a></h6>
                  <p className="text-muted small">Lihat semua pesanan pelanggan</p>
                </Col>
              </>
            ) : (
              <>
                <Col md={6} className="mb-3">
                  <h6>📚 <a href="/books">Daftar Buku</a></h6>
                  <p className="text-muted small">Lihat semua koleksi buku</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>📦 <a href="/orders">Pesanan Saya</a></h6>
                  <p className="text-muted small">Buat dan lihat pesanan Anda</p>
                </Col>
              </>
            )}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

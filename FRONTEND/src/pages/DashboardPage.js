import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Table, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Common';
import apiClient from '../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [books, setBooks] = useState([]);
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
    <Card className={`text-white bg-${color} mb-3 h-100 shadow-sm`}>
      <Card.Body>
        <Row>
          <Col xs={8}>
            <p className="mb-0 small text-white-50">{title}</p>
            <h3 className="mb-0 fw-bold">{value}</h3>
          </Col>
          <Col xs={4} className="text-end">
            <h2 className="mb-0">{icon}</h2>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Layout title="DASHBOARD" subtitle="Selamat datang di Dashboard">
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Memuat dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="📊 DASHBOARD" subtitle={`Selamat datang, ${user?.fullname}!`}>
      {/* Info User */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body>
          <Row>
            <Col md={8}>
              <h5 className="mb-0">Halo, <strong>{user?.fullname}</strong> 👋</h5>
              <p className="text-muted small mb-0 mt-2">
                Role: <span className="badge bg-success">{user?.role}</span>
                <span className="ms-2">Status: <span className="badge bg-info">Aktif</span></span>
              </p>
            </Col>
            <Col md={4} className="text-end">
              <p className="text-muted small">Tanggal: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Main Content */}
      {user?.role === 'manager' && (
        <>
          {/* Manager Dashboard - Stats Cards */}
          <Row className="mb-4 g-3">
            {/* Manajemen Buku */}
            <Col md={6} lg={4} xl={2.4} className="d-flex">
              <Card className="shadow-sm border-0 w-100">
                <Card.Body>
                  <a href="/books" className="text-decoration-none">
                    <h6 className="mb-2 text-primary">📚 Manajemen Buku</h6>
                    <div className="h4 fw-bold text-primary">{stats.totalBooks}</div>
                    <p className="text-muted small mb-0">Total Buku Tersedia</p>
                  </a>
                </Card.Body>
              </Card>
            </Col>

            {/* Manajemen Kategori */}
            <Col md={6} lg={4} xl={2.4} className="d-flex">
              <Card className="shadow-sm border-0 w-100">
                <Card.Body>
                  <a href="/categories" className="text-decoration-none">
                    <h6 className="mb-2 text-warning">📂 Manajemen Kategori</h6>
                    <p className="text-muted small mb-0">Kelola kategori buku</p>
                  </a>
                </Card.Body>
              </Card>
            </Col>

            {/* Manajemen Pengguna */}
            <Col md={6} lg={4} xl={2.4} className="d-flex">
              <Card className="shadow-sm border-0 w-100">
                <Card.Body>
                  <a href="/users" className="text-decoration-none">
                    <h6 className="mb-2 text-info">👥 Manajemen Pengguna</h6>
                    <p className="text-muted small mb-0">Kelola akun pengguna sistem</p>
                  </a>
                </Card.Body>
              </Card>
            </Col>

            {/* Laporan Pesanan */}
            <Col md={6} lg={4} xl={2.4} className="d-flex">
              <Card className="shadow-sm border-0 w-100">
                <Card.Body>
                  <a href="/orders" className="text-decoration-none">
                    <h6 className="mb-2 text-success">📊 Laporan Pesanan</h6>
                    <div className="h4 fw-bold text-success">{stats.totalOrders}</div>
                    <p className="text-muted small mb-0">Total Pesanan Masuk</p>
                  </a>
                </Card.Body>
              </Card>
            </Col>

            {/* Total Pendapatan */}
            <Col md={6} lg={4} xl={2.4} className="d-flex">
              <Card className="shadow-sm border-0 w-100">
                <Card.Body>
                  <div>
                    <h6 className="mb-2 text-warning">💰 Total Pendapatan</h6>
                    <div className="h4 fw-bold text-warning">Rp {stats.totalRevenue?.toLocaleString('id-ID')}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Kasir Dashboard */}
      {user?.role === 'kasir' && (
        <>
          <Row className="mb-4 g-3">
            {/* Daftar Buku */}
            <Col md={6} lg={4} xl={3} className="d-flex">
              <Card className="shadow-sm border-0 w-100">
                <Card.Body>
                  <a href="/books" className="text-decoration-none">
                    <h6 className="mb-2 text-primary">📚 Daftar Buku</h6>
                    <p className="text-muted small mb-0">Lihat semua koleksi buku</p>
                  </a>
                </Card.Body>
              </Card>
            </Col>

            {/* Kelola Pesanan */}
            <Col md={6} lg={4} xl={3} className="d-flex">
              <Card className="shadow-sm border-0 w-100">
                <Card.Body>
                  <a href="/orders" className="text-decoration-none">
                    <h6 className="mb-2 text-success">📦 Kelola Pesanan</h6>
                    <p className="text-muted small mb-0">Buat dan kelola pesanan pelanggan</p>
                  </a>
                </Card.Body>
              </Card>
            </Col>

            {/* Total Pendapatan */}
            <Col md={6} lg={4} xl={3} className="d-flex">
              <Card className="shadow-sm border-0 w-100">
                <Card.Body>
                  <div>
                    <h6 className="mb-2 text-warning">💰 Total Pendapatan</h6>
                    <div className="h4 fw-bold text-warning">Rp {stats.totalRevenue?.toLocaleString('id-ID')}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Pelanggan Dashboard */}
      {user?.role === 'pelanggan' && (
        <>
          <Row className="mb-4 g-3">
            {/* Daftar Buku */}
            <Col md={6} lg={4} xl={6} className="d-flex">
              <Card className="shadow-sm border-0 w-100">
                <Card.Body>
                  <a href="/books" className="text-decoration-none">
                    <h6 className="mb-2 text-primary">📚 Daftar Buku</h6>
                    <p className="text-muted small mb-0">Lihat semua koleksi buku</p>
                  </a>
                </Card.Body>
              </Card>
            </Col>

            {/* Pesanan Saya */}
            <Col md={6} lg={4} xl={6} className="d-flex">
              <Card className="shadow-sm border-0 w-100">
                <Card.Body>
                  <a href="/orders" className="text-decoration-none">
                    <h6 className="mb-2 text-success">📦 Pesanan Saya</h6>
                    <p className="text-muted small mb-0">Buat dan lihat pesanan Anda</p>
                  </a>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Layout>
  );
};

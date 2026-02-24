import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card, Badge, Modal } from 'react-bootstrap';
import { Layout, LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/Common';
import apiClient from '../services/api';

export const OrdersReportPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // ========================================
  // Load data order
  // ========================================
  useEffect(() => {
    loadOrders();
  }, [filterStatus, startDate, endDate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let url = '/orders';
      const params = new URLSearchParams();
      
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await apiClient.get(url);
      setOrders(response.data);
    } catch (err) {
      setError('Gagal memuat data laporan pesanan');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Hitung statistik
  // ========================================
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('id-ID');
    } catch {
      return '-';
    }
  };

  const calculateStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + (parseFloat(order.total_price) || 0), 0);
    const completedOrders = orders.filter((o) => o.status === 'paid').length;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

    return {
      totalOrders,
      totalRevenue,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      averageOrder: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  };

  // ========================================
  // Export ke CSV
  // ========================================
  const handleExportCSV = () => {
    if (orders.length === 0) {
      setError('Tidak ada data untuk diekspor');
      return;
    }

    const headers = ['ID Order', 'User', 'Status', 'Total', 'Tanggal'];
    const rows = orders.map((order) => [
      order.id,
      order.customer_name || 'Unknown',
      order.status,
      order.total_price,
      formatDate(order.created_at),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-pesanan-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    setSuccess('Laporan berhasil diekspor');
    setTimeout(() => setSuccess(''), 3000);
  };

  // ========================================
  // Print laporan
  // ========================================
  const handlePrint = () => {
    window.print();
  };

  const stats = calculateStats();

  // ========================================
  // Status badge helper
  // ========================================
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'warning',
      paid: 'success',
      cancelled: 'danger',
    };
    const statusLabel = {
      pending: 'Pending',
      paid: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return <Badge bg={statusMap[status] || 'secondary'}>{statusLabel[status] || status}</Badge>;
  };

  if (loading) {
    return <LoadingSpinner message="Memuat laporan pesanan..." />;
  }

  return (
    <Layout>
      <div className="py-4">
        <h1 className="mb-4">📊 Laporan Pesanan</h1>

        {error && <ErrorAlert message={error} onClose={() => setError('')} />}
        {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}

        {/* ========================================
        // STATISTIK CARDS
        ======================================== */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-white bg-primary mb-3">
              <Card.Body>
                <p className="mb-0 small">Total Pesanan</p>
                <h3 className="mb-0">{stats.totalOrders}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-success mb-3">
              <Card.Body>
                <p className="mb-0 small">Pesanan Selesai</p>
                <h3 className="mb-0">{stats.completedOrders}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-warning mb-3">
              <Card.Body>
                <p className="mb-0 small">Pesanan Pending</p>
                <h3 className="mb-0">{stats.pendingOrders}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-danger mb-3">
              <Card.Body>
                <p className="mb-0 small">Pesanan Dibatalkan</p>
                <h3 className="mb-0">{stats.cancelledOrders}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ========================================
        // REVENUE CARDS
        ======================================== */}
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <p className="text-muted mb-2 small">Total Pendapatan</p>
                <h2 className="mb-0 text-success">
                  Rp {stats.totalRevenue?.toLocaleString('id-ID')}
                </h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <p className="text-muted mb-2 small">Rata-rata per Pesanan</p>
                <h2 className="mb-0 text-info">
                  Rp {Math.round(stats.averageOrder)?.toLocaleString('id-ID')}
                </h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ========================================
        // FILTER SECTION
        ======================================== */}
        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">🔍 Filter Laporan</h5>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Status Pesanan</Form.Label>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Tanggal Mulai</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Tanggal Akhir</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>&nbsp;</Form.Label>
                  <div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setFilterStatus('all');
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="w-100"
                    >
                      Reset Filter
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* ========================================
        // ACTION BUTTONS
        ======================================== */}
        <Row className="mb-4">
          <Col>
            <Button variant="success" onClick={handleExportCSV} className="me-2">
              📥 Export CSV
            </Button>
            <Button variant="primary" onClick={handlePrint}>
              🖨️ Print Laporan
            </Button>
          </Col>
        </Row>

        {/* ========================================
        // ORDERS TABLE
        ======================================== */}
        <Card>
          <Card.Body>
            <h5 className="mb-3">📋 Daftar Pesanan</h5>
            {orders.length === 0 ? (
              <p className="text-muted text-center py-4">Tidak ada data pesanan</p>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Nama Pelanggan</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order.id}>
                        <td>{index + 1}</td>
                        <td>{order.customer_name || 'Unknown'}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td className="text-end">
                          <strong>Rp {order.total_price?.toLocaleString('id-ID')}</strong>
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDetailModal(true);
                            }}
                          >
                            Detail
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* ========================================
        // DETAIL MODAL
        ======================================== */}
        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Detail Pesanan #{selectedOrder?.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <>
                <Row className="mb-3">
                  <Col md={6}>
                    <p>
                      <strong>Nama Pelanggan:</strong> {selectedOrder.customer_name || 'Unknown'}
                    </p>
                    <p>
                      <strong>Status:</strong> {getStatusBadge(selectedOrder.status)}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Total:</strong> Rp{' '}
                      {selectedOrder.total_price?.toLocaleString('id-ID')}
                    </p>
                    <p>
                      <strong>Tanggal:</strong>{' '}
                      {formatDate(selectedOrder.created_at)}
                    </p>
                  </Col>
                </Row>
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <>
                    <h6 className="mb-3">Item Pesanan</h6>
                    <Table striped size="sm">
                      <thead>
                        <tr>
                          <th>Buku</th>
                          <th className="text-center">Qty</th>
                          <th className="text-end">Harga</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.book?.title || 'Unknown'}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">
                              Rp {item.price?.toLocaleString('id-ID')}
                            </td>
                            <td className="text-end">
                              Rp{' '}
                              {(item.quantity * item.price)?.toLocaleString(
                                'id-ID'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
              Tutup
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

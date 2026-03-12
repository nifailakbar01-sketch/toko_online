import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Layout, LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/Common';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [orderItems, setOrderItems] = useState([{ book_id: '', quantity: 1 }]);

  // ========================================
  // Load data order dan buku
  // ========================================
  useEffect(() => {
    loadOrders();
    loadBooks();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/orders');
      console.log('[DEBUG] Orders loaded:', response.data);
      if (response.data.length > 0) {
        console.log('[DEBUG] First order structure:', response.data[0]);
      }
      setOrders(response.data);
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      if (status === 403) {
        setError('❌ Akses ditolak. Silakan login kembali');
      } else if (status === 401) {
        setError('⚠️ Sesi Anda telah berakhir. Silakan login kembali');
      } else {
        setError(message || 'Gagal memuat data order');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadBooks = async () => {
    try {
      const response = await apiClient.get('/books');
      setBooks(response.data);
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      if (status === 403) {
        console.error('❌ Books API Forbidden:', message);
      } else if (status === 401) {
        console.error('⚠️ Unauthorized:', message);
      } else {
        console.error('Gagal memuat buku:', err);
      }
    }
  };

  const loadOrderDetail = async (orderId) => {
    try {
      setLoadingDetail(true);
      const response = await apiClient.get(`/orders/${orderId}`);
      console.log('Order detail loaded:', response.data);
      setSelectedOrderDetail(response.data);
    } catch (err) {
      console.error('Gagal memuat detail order:', err);
      setError('Gagal memuat detail order');
    } finally {
      setLoadingDetail(false);
    }
  };

  // ========================================
  // Tambah item order
  // ========================================
  const handleAddItem = () => {
    setOrderItems([...orderItems, { book_id: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  // ========================================
  // Submit order
  // ========================================
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    try {
      const items = orderItems.filter((item) => item.book_id && item.quantity > 0);
      if (items.length === 0) {
        setError('Minimal harus ada satu item order');
        return;
      }

      await apiClient.post('/orders', { items });
      setSuccess('Order berhasil dibuat');
      setShowModal(false);
      setOrderItems([{ book_id: '', quantity: 1 }]);
      loadOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat order');
    }
  };

  // ========================================
  // Update status order
  // ========================================
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/orders/${orderId}`, { status: newStatus });
      setSuccess('Status order berhasil diperbarui');
      loadOrders();
      setShowDetailModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Gagal memperbarui status order');
    }
  };

  // ========================================
  // Delete order
  // ========================================
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        await apiClient.delete(`/orders/${orderId}`);
        setSuccess('Order berhasil dihapus');
        loadOrders();
        setShowDetailModal(false);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus order');
      }
    }
  };

  const getBookName = (bookId) => {
    const book = books.find((b) => b.id === parseInt(bookId));
    return book?.title || '-';
  };

  const getBookPrice = (bookId) => {
    const book = books.find((b) => b.id === parseInt(bookId));
    return book?.price || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      console.warn('[FORMAT_DATE] Received empty/null date');
      return '-';
    }
    try {
      // Log untuk debugging
      console.log('[FORMAT_DATE] Input:', dateString, 'Type:', typeof dateString);
      
      // Handle PostgreSQL format: YYYY-MM-DDTHH:MM:SS.sssZ atau YYYY-MM-DD HH:MM:SS
      let dateObj;
      
      // Coba parse langsung
      dateObj = new Date(dateString);
      
      // Jika invalid, coba format ISO
      if (isNaN(dateObj.getTime())) {
        // Coba handle format "2026-02-05 14:30:00"
        const sqlMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/);
        if (sqlMatch) {
          dateObj = new Date(`${sqlMatch[1]}-${sqlMatch[2]}-${sqlMatch[3]}T${sqlMatch[4]}:${sqlMatch[5]}:${sqlMatch[6]}Z`);
        }
      }
      
      // Jika masih invalid, coba ISO match
      if (isNaN(dateObj.getTime())) {
        const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) {
          dateObj = new Date(`${isoMatch[0]}T00:00:00Z`);
        }
      }
      
      if (isNaN(dateObj.getTime())) {
        console.warn('[FORMAT_DATE] Invalid date:', dateString);
        return dateString || '-';
      }
      
      const formatted = dateObj.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      console.log('[FORMAT_DATE] Output:', formatted);
      return formatted;
    } catch (e) {
      console.error('Error parsing date:', dateString, e);
      return dateString || '-';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout 
      title={user?.role === 'pelanggan' ? '📦 Pesanan Saya' : '📦 Manajemen Pesanan'} 
      subtitle={user?.role === 'pelanggan' ? 'Lihat dan kelola pesanan Anda' : 'Kelola semua pesanan buku'}
    >
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}

      <Row className="mb-3">
        <Col>
          <Button variant="secondary" onClick={() => navigate(-1)}>← Kembali</Button>
        </Col>
      </Row>

      <div className="mb-4">
        <Button variant="success" onClick={() => setShowModal(true)}>
          + Buat Pesanan Baru
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            {user?.role !== 'pelanggan' && <th>Pelanggan</th>}
            <th>Tanggal</th>
            <th>Total</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              {user?.role !== 'pelanggan' && <td>{order.customer_name || 'Unknown'}</td>}
              <td>{formatDate(order.created_at)}</td>
              <td className="text-end">Rp {order.total_price?.toLocaleString('id-ID')}</td>
              <td>
                <span
                  className={`badge ${
                    order.status === 'paid'
                      ? 'bg-success'
                      : order.status === 'cancelled'
                      ? 'bg-danger'
                      : 'bg-warning'
                  }`}
                >
                  {order.status === 'paid' ? 'Selesai' : order.status === 'cancelled' ? 'Dibatalkan' : 'Pending'}
                </span>
              </td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDetailModal(true);
                    loadOrderDetail(order.id);
                  }}
                >
                  Detail
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Buat Order Baru */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Buat Pesanan Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitOrder}>
            {orderItems.map((item, index) => (
              <Row key={index} className="mb-3">
                <Col md={8}>
                  <Form.Label>Buku</Form.Label>
                  <Form.Select
                    value={item.book_id}
                    onChange={(e) => handleItemChange(index, 'book_id', e.target.value)}
                    required
                  >
                    <option value="">-- Pilih Buku --</option>
                    {books.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title} (Rp {book.price?.toLocaleString('id-ID')})
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label>Qty</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    required
                  />
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-100"
                    onClick={() => handleRemoveItem(index)}
                    disabled={orderItems.length === 1}
                  >
                    ✕
                  </Button>
                </Col>
              </Row>
            ))}

            <Button variant="secondary" onClick={handleAddItem} className="mb-3">
              + Tambah Item
            </Button>

            <hr />

            <Button variant="primary" type="submit" className="w-100">
              Buat Pesanan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Detail Order */}
      {selectedOrder && (
        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Detail Pesanan #{selectedOrder.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingDetail ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <Card className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p>
                          <strong>Pelanggan:</strong> {selectedOrder.customer_name || 'Unknown'}
                        </p>
                        <p>
                          <strong>Total:</strong> Rp {selectedOrder.total_price?.toLocaleString('id-ID')}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p>
                          <strong>Tanggal:</strong> {formatDate(selectedOrderDetail?.order?.created_at || selectedOrder.created_at)}
                        </p>
                        <p>
                          <strong>Status:</strong>{' '}
                          <span
                            className={`badge ${
                              selectedOrder.status === 'paid'
                                ? 'bg-success'
                                : selectedOrder.status === 'cancelled'
                                ? 'bg-danger'
                                : 'bg-warning'
                            }`}
                          >
                            {selectedOrder.status === 'paid' ? 'Selesai' : selectedOrder.status === 'cancelled' ? 'Dibatalkan' : 'Pending'}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <h6>Daftar Item</h6>
                <Table striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>Buku</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Harga</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
              <tbody>
                {selectedOrderDetail?.items && selectedOrderDetail.items.length > 0 ? (
                  selectedOrderDetail.items.map((item, idx) => {
                    console.log('[DEBUG] Item data:', item);
                    return (
                      <tr key={idx}>
                        <td>{item.title || getBookName(item.book_id)}</td>
                        <td className="text-center">{item.quantity || 0}</td>
                        <td className="text-end">Rp {item.price?.toLocaleString('id-ID')}</td>
                        <td className="text-end">Rp {(item.quantity * item.price)?.toLocaleString('id-ID')}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      Tidak ada item
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            <hr />

            {user?.role !== 'pelanggan' && (
              <>
                <div>
                  <h6>Ubah Status</h6>
                  <Form.Select
                    defaultValue={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </Form.Select>
                </div>

                <hr />

                <div>
                  <Button
                    variant="danger"
                    className="w-100"
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                  >
                    🗑️ Hapus Pesanan
                  </Button>
                </div>
              </>
            )}
              </>
            )}
          </Modal.Body>
        </Modal>
      )}
    </Layout>
  );
};

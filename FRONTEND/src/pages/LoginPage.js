import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

export const LoginPage = () => {
  // State untuk Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State untuk Register
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFullname, setRegFullname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setRegLoading(true);

    try {
      const response = await apiClient.post('/auth/register', {
        username: regUsername,
        password: regPassword,
        fullname: regFullname,
        email: regEmail
      });

      setRegSuccess(response.data.message);
      
      // Reset form
      setRegUsername('');
      setRegPassword('');
      setRegFullname('');
      setRegEmail('');

      // Switch ke login tab setelah 2 detik
      setTimeout(() => {
        setActiveTab('login');
        setRegSuccess('');
      }, 2000);

    } catch (err) {
      setRegError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '450px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">📚 Toko Buku</h2>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            {/* TAB LOGIN */}
            <Tab eventKey="login" title="Login">
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? 'Memproses...' : 'Login'}
                </Button>
              </Form>

              <hr />
              <p className="text-center text-muted small">

              </p>
            </Tab>

            {/* TAB REGISTER */}
            <Tab eventKey="register" title="Daftar Akun">
              {regError && <Alert variant="danger">{regError}</Alert>}
              {regSuccess && <Alert variant="success">{regSuccess}</Alert>}

              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Lengkap</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nama lengkap Anda"
                    value={regFullname}
                    onChange={(e) => setRegFullname(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email Anda"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Pilih username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                  <small className="text-muted">Min. 3 karakter</small>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Minimal 5 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                  <small className="text-muted">Min. 5 karakter</small>
                </Form.Group>

                <Button variant="success" type="submit" className="w-100" disabled={regLoading}>
                  {regLoading ? 'Memproses...' : 'Daftar Sekarang'}
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

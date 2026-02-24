import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" expand="lg" className="mb-4" sticky="top">
      <Container>
        <Navbar.Brand href="/" className="fw-bold">
          📚 Toko Buku
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                {user.role === 'manager' && (
                  <>
                    <Nav.Link href="/books">Buku</Nav.Link>
                    <Nav.Link href="/categories">Kategori</Nav.Link>
                    <Nav.Link href="/users">Pengguna</Nav.Link>
                    <Nav.Link href="/orders">Pesanan</Nav.Link>
                    <Nav.Link href="/orders-report">Laporan Pesanan</Nav.Link>
                  </>
                )}
                {user.role === 'kasir' && (
                  <>
                    <Nav.Link href="/books">Buku</Nav.Link>
                    <Nav.Link href="/orders">Pesanan</Nav.Link>
                  </>
                )}
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {user.fullname}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/profile">Profil</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

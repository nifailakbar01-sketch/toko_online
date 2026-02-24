import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">👤 Profil Saya</h1>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-4">Informasi Profil</h5>

              <div className="mb-3">
                <label className="text-muted small">Nama Lengkap</label>
                <p className="h6">{user.fullname}</p>
              </div>

              <div className="mb-3">
                <label className="text-muted small">Username</label>
                <p className="h6">{user.username}</p>
              </div>

              <div className="mb-3">
                <label className="text-muted small">Email</label>
                <p className="h6">{user.email}</p>
              </div>

              <div className="mb-3">
                <label className="text-muted small">Role</label>
                <p className="h6">
                  <span className="badge bg-info">{user.role}</span>
                </p>
              </div>

              <div className="mb-3">
                <label className="text-muted small">Status</label>
                <p className="h6">
                  <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-4">Informasi Sistem</h5>

              <div className="mb-3">
                <label className="text-muted small">ID Pengguna</label>
                <p className="h6">{user.id}</p>
              </div>

              <div className="mb-3">
                <label className="text-muted small">Daftar Sejak</label>
                <p className="h6">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}
                </p>
              </div>

              <div className="alert alert-info mt-4">
                <strong>💡 Tips:</strong> Hubungi administrator untuk mengubah password atau informasi profil Anda.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

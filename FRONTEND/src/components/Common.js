import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

export const Layout = ({ children, title, subtitle }) => {
  return (
    <Container className="py-4">
      {title && (
        <div className="mb-4">
          <h1 className="mb-2">{title}</h1>
          {subtitle && <p className="text-muted">{subtitle}</p>}
          <hr />
        </div>
      )}
      {children}
    </Container>
  );
};

export const LoadingSpinner = ({ message = 'Memuat data...' }) => {
  return (
    <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">{message}</p>
    </div>
  );
};

export const ErrorAlert = ({ message, onClose }) => {
  return (
    <Alert variant="danger" onClose={onClose} dismissible>
      <Alert.Heading>Terjadi Kesalahan</Alert.Heading>
      <p>{message}</p>
    </Alert>
  );
};

export const SuccessAlert = ({ message, onClose }) => {
  return (
    <Alert variant="success" onClose={onClose} dismissible>
      <Alert.Heading>Sukses</Alert.Heading>
      <p>{message}</p>
    </Alert>
  );
};

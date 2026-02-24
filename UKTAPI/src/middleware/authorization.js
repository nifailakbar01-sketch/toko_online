const jwt = require('jsonwebtoken');

// Middleware verifikasi JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan.' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid atau kedaluwarsa.' });
    req.user = user;
    next();
  });
}

// Middleware pembatasan berdasarkan role
function requireRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak: role tidak diizinkan.' });
    }
    next();
  };
}

module.exports = { verifyToken, requireRoles };

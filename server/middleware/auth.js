const JWT = require('jsonwebtoken');

const Auth = (req, res, next) => {
  let token = req.cookies && req.cookies.jwt;

  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization not allowed' });
  }

  JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ msg: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = Auth;

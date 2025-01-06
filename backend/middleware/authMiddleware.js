import jwt from 'jsonwebtoken';

 const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(req.headers);

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;  // Add userId to the request object for later use
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

};


export default authMiddleware;
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token from Authorization header
  
  if (!token) {
    return res.status(403).json({ message: 'Access Denied: No token provided' });
  }

  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded payload to the request object (e.g., user data)
    req.user = decoded;  // This would contain user info, like the user id
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    // Token expired or invalid
    return res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
};

module.exports = authenticateJWT;

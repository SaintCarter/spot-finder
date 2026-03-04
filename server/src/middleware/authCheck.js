import jwt from 'jsonwebtoken';

export const requireAuth = async (req, res, next) => {
  const token = req.cookies.spotfinder_access_token;
  if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
  }
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
  } catch (err) {
      if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: "Session expired. Please log in again." });
      }
      // Handles tampering, malformed tokens, etc.
      return res.status(401).json({ message: "Invalid session." });
  }
};
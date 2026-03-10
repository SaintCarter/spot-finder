import jwt from 'jsonwebtoken';


export const requireAuth = async (req, res, next) => {
  const token = req.cookies.spotfinder_access_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = decoded;

    req.user = user; 
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? "Session expired" : "Invalid session";
    return res.status(401).json({ message });
  }
};
import jwt from 'jsonwebtoken';


export const requireAuth = async (req, res, next) => {
  const errorMessage = "Unauthorized - requireAuth";
  const token = req.cookies.spotfinder_access_token;
  if (!token) return res.status(401).json({ error: errorMessage });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(user); returns:
    //{ userId: '', username: '', iat: 1773390547, exp: 1773394147}
    req.user = user; 
    next();
  } catch (err) {
    //jwtmalformed
    return res.status(401).json({ error: errorMessage });
  }
};
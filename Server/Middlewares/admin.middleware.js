export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.accountType === "admin") {
    return next(); 
  }
  return res.status(403).json({ message: "Access denied: Admins only 🚫" });
};

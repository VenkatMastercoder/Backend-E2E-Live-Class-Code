const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const roleBasedMiddleware = (requireRole) => {
  return async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    
    if (!authorizationHeader) {
      return res.status(401).json({ message: "Unauthorized: No Authorization Header" });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No Token Provided" });
    }

    try {
      var decoded = jwt.verify(token, "key");

      var user_role = decoded.role;
      var user_id = decoded.user_id

      console.log(user_role,user_id)
      console.log(requireRole)
    
      if (requireRole.includes(user_role)) {
        req.user_data = {
          cms_user_role: user_role,
          cms_user_id: user_id,
          data: "Sample data from RBAC Middleware"
        }; 

        return next();
      } else {
        return res.status(403).json({ message: "Forbidden: Insufficient Role" });
      }
    } catch (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }
  };
};

module.exports = roleBasedMiddleware;
var jwt = require("jsonwebtoken");

const roleBasedMiddleware = (requireRole) => {
  return (req, res, next) => {
    const customReq = req;
    const token = customReq.headers.authorization.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized : No Token" });
    }

    try {
      var decoded = jwt.verify(token, "key");
      var user_role = decoded.role;
      if (requireRole.includes(user_role)) {
        return next();
      } else {
        res.status(401).json({ message: "Unauthorized : Invalid token" });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

module.exports = roleBasedMiddleware;

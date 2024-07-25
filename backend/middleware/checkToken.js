const jwt = require("jsonwebtoken");

async function checkToken(req, res, next) {
  const fullToken = req.headers.authorization;

  if (!fullToken) {
    return res.status(401).json({ error: "Token is required" });
  } else {
    const [typeToken, token] = fullToken.split(" ");
    if (token !== "Bearer") {
      return res.status(401).json({ error: "Invalid token type" });
    } else {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
      }
    }
  }
}

module.exports = { checkToken };

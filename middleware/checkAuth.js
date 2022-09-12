import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware
const checkAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // jwt.verify() takes as 1st param the token by itself
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // from now on we can use req.user to identify the authentified user (we dont care bout pass, token, etc)
      req.user = await User.findById(decoded.id).select(
        "-password -token -confirmed -createdAt -updatedAt -__v"
      );
      return next();
    } catch (error) {
      return res.status(404).json({ msg: "Hubo un error" });
    }
  }
  if (!token) {
    const error = new Error("Token No Válido");
    return res.status(401).json({ msg: error.message });
  }
  next();
};
export default checkAuth;

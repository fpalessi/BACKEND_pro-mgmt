import jwt from "jsonwebtoken";

const jwtGenerator = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
export default jwtGenerator;

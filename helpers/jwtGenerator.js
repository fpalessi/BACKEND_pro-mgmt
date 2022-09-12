import jwt from "jsonwebtoken";

const jwtGenerator = (id) => {
  // .sign() toma 1º: lo que va a colocar en el JWT_SECRET. NO INFORMACION SENSIBLE, PASSW, CREDIT CARD,ETC.
  //2º: la palabra secreta 3º objeto con opciones
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // Tiempo que va a estar vigente
    expiresIn: "30d",
  });
};
export default jwtGenerator;

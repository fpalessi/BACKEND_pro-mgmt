// Lo que hace este codigo es ir a "node_modules",
// busca el paquete de "express" y
// lo asigna en la variable const express
// const express = require("express");
// Si en package.json añadimos "type": "module" podremos empezar a
// utilizar las sintaxis de ESM de imports en lugar de CommonJS
import express from "express";
// Dependencia para ocultar informacion en variables de entorno
// El link de la base de datos hay que ocultarlo porque podría liarse una buena
// Dependencia ligera para estas cosas npm i -dotenv
import dotenv from "dotenv";
import cors from "cors";
import DBconnect from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
const app = express();

app.use(express.json());
// Con esta configuracion va a buscar por un archivo que es el .env
dotenv.config();
DBconnect();

// Allowed domains
// const whitelist = [process.env.FRONTEND_URL];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Error de CORS"));
//     }
//   },
// };
// app.use(cors(corsOptions));

app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Variable de entorno para el puerto
// En caso de que no existe PORQUE ESTAMOS EN LOCAL, asignale el puerto 4000
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el porchi ${PORT}`);
});

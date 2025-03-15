// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// Rutas
import authRoutes from "./routes/authRoutes.js";
import asociacionRoutes from "./routes/asociacionRoutes.js";
import calendarioRoutes from "./routes/calendarioRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import comprasRoutes from "./routes/comprasRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import contabilidadRoutes from "./routes/contabilidadRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import medicionRoutes from "./routes/medicionRoutes.js";
import obraRoutes from "./routes/obraRoutes.js";
import panolRoutes from "./routes/panolRoutes.js";
import perfilRoutes from "./routes/perfilRoutes.js";
import presupuestoRoutes from "./routes/presupuestoRoutes.js";
import proveedorRoutes from "./routes/proveedorRoutes.js";
import tipologiaRoutes from "./routes/tipologiaRoutes.js";
import ubicacionRoutes from "./routes/ubicacionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Configurar CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-auth-frontendemigreif.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(cookieParser());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/asociacion", asociacionRoutes);
app.use("/api/calendario", calendarioRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/configuracion", configRoutes);
app.use("/api/contabilidad", contabilidadRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/mediciones", medicionRoutes);
app.use("/api/obras", obraRoutes);
app.use("/api/panol", panolRoutes);
app.use("/api/perfiles", perfilRoutes);
app.use("/api/presupuestos", presupuestoRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/tipologias", tipologiaRoutes);
app.use("/api/ubicaciones", ubicacionRoutes);
app.use("/api/user", userRoutes);

// Endpoint no definido => 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint no encontrado" });
});

// Manejo global de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

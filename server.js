import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

// ✅ Importamos las rutas
import authRoutes from "./routes/authRoutes.js";
import asociacionRoutes from "./routes/asociacionRoutes.js";
import calendarioRoutes from "./routes/calendarioRoutes.js";
import clienteRoutes from "./routes/ClienteRoutes.js";
import comprasRoutes from "./routes/comprasRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import contabilidadRoutes from "./routes/contabilidadRoutes.js";
import medicionRoutes from "./routes/medicionRoutes.js";
import obraRoutes from "./routes/obraRoutes.js";
import panolRoutes from "./routes/panolRoutes.js";
import presupuestoRoutes from "./routes/presupuestoRoutes.js";
import proveedorRoutes from "./routes/proveedorRoutes.js";
import tipologiaRoutes from "./routes/tipologiaRoutes.js";
import ubicacionRoutes from "./routes/ubicacionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["https://mern-auth-frontendemigreif.vercel.app"],
  credentials: true
}));
app.use(cookieParser());

// ✅ Middleware de LOG para ver las solicitudes
app.use((req, res, next) => {
  console.log(`📌 [${req.method}] ${req.url}`);
  console.log("🔍 Headers:", req.headers);
  next();
});

// ✅ Definir las rutas
app.use("/api/auth", authRoutes);
app.use("/api/asociacion", asociacionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/calendario", calendarioRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/configuracion", configRoutes);
app.use("/api/contabilidad", contabilidadRoutes);
app.use("/api/obras", obraRoutes);
app.use("/api/panol", panolRoutes);
app.use("/api/mediciones", medicionRoutes);
app.use("/api/tipologias", tipologiaRoutes);
app.use("/api/ubicaciones", ubicacionRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/presupuestos", presupuestoRoutes);

// ✅ Puerto y arranque del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

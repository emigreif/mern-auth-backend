import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();

// Middleware para analizar JSON
app.use(express.json());

// Habilitar CORS correctamente
app.use(cors({
  origin: ["https://mern-auth-frontendemigreif.vercel.app"],  /// Asegura que es la URL correcta
  credentials: true
}));

// Habilitar Cookie Parser
app.use(cookieParser());

// Middleware de depuración (imprime todas las solicitudes entrantes)
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

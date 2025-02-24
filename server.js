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

app.use(express.json());
import cors from 'cors';

app.use(cors({
  origin: ["https://mern-auth-frontendemigreif.vercel.app"], // Agrega la URL de tu frontend en Vercel
  credentials: true
}));


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

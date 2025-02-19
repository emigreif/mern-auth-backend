import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'https://your-frontend-url.vercel.app', credentials: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));

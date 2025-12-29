import express from 'express';
import cors from 'cors';
import reportRoutes from './routes/report.routes';
import authRoutes from './routes/auth.routes';
import { connectDB } from './config/db';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API Fonctionnelle'));

export default app;

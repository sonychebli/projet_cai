import express from 'express';
import cors from 'cors';
import reportRoutes from './routes/report.routes';
import authRoutes from './routes/auth.routes';
import { connectDB } from './config/db';

// Connecter la base de données MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // ton frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // utile si auth avec cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

// Test API
app.get('/', (req, res) => res.send('API Fonctionnelle'));

export default app;

import express from 'express';
import cors from 'cors';
import reportRoutes from './routes/report.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import { connectDB } from './config/db';
import statsRoutes from './routes/stats.routes';
// Connecter la base de données MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // ton frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Ajout de PATCH
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/stats', statsRoutes);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes); // 👈 Route admin ajoutée

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Route de test
app.get('/', (_req, res) => res.send('API Fonctionnelle'));

// Gestion des routes non trouvées
app.use((_req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    message: 'Erreur serveur interne',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
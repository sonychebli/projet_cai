import { Request, Response } from 'express';
import Report from '../models/Report';

/**
 * 📊 Statistiques globales
 * GET /api/stats/global
 */
export const getGlobalStats = async (_req: Request, res: Response) => {
  try {
    const total = await Report.countDocuments();
    const resolved = await Report.countDocuments({ status: 'resolved' });
    const inReview = await Report.countDocuments({ status: 'in_review' });
    const submitted = await Report.countDocuments({ status: 'submitted' });
    
    // Utilisateurs actifs (qui ont créé au moins un signalement)
    const activeUsers = await Report.distinct('createdBy').then(users => 
      users.filter(id => id !== null && id !== undefined).length
    );

    res.json({
      total,
      resolved,
      pending: submitted,
      inReview,
      activeUsers,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
    });
  } catch (error) {
    console.error('Erreur getGlobalStats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * 📈 Statistiques par catégorie (type de crime)
 * GET /api/stats/by-category
 */
export const getByCategory = async (_req: Request, res: Response) => {
  try {
    const data = await Report.aggregate([
      {
        $group: {
          _id: '$crimeType',
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1
        }
      },
      { $sort: { value: -1 } }
    ]);

    // Mapping des couleurs par catégorie
    const colorMap: { [key: string]: string } = {
      'Agression': '#FF6B6B',
      'Vol': '#4ECDC4',
      'Trafic': '#FFD166',
      'Cyber': '#06D6A0',
      'Autres': '#118AB2'
    };

    const result = data.map(item => ({
      ...item,
      color: colorMap[item.name] || '#999999'
    }));

    res.json(result);
  } catch (error) {
    console.error('Erreur getByCategory:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * 📊 Statistiques par statut
 * GET /api/stats/by-status
 */
export const getByStatus = async (_req: Request, res: Response) => {
  try {
    const data = await Report.aggregate([
      {
        $group: {
          _id: '$status',
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'resolved'] }, then: 'Traité' },
                { case: { $eq: ['$_id', 'in_review'] }, then: 'En cours' },
                { case: { $eq: ['$_id', 'submitted'] }, then: 'En attente' }
              ],
              default: '$_id'
            }
          },
          value: 1
        }
      }
    ]);

    // Ajout des couleurs
    const colorMap: { [key: string]: string } = {
      'Traité': '#10B981',
      'En cours': '#F59E0B',
      'En attente': '#EF4444'
    };

    const result = data.map(item => ({
      ...item,
      color: colorMap[item.name] || '#999999'
    }));

    res.json(result);
  } catch (error) {
    console.error('Erreur getByStatus:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * 📅 Statistiques mensuelles
 * GET /api/stats/monthly?range=6mois
 */
export const getMonthlyStats = async (req: Request, res: Response) => {
  try {
    const range = req.query.range || '6mois';
    let monthsBack = 6;

    switch (range) {
      case '1mois':
        monthsBack = 1;
        break;
      case '3mois':
        monthsBack = 3;
        break;
      case '6mois':
        monthsBack = 6;
        break;
      case '1an':
        monthsBack = 12;
        break;
    }

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    const data = await Report.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          signalements: { $sum: 1 },
          résolus: {
            $sum: {
              $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          mois: {
            $let: {
              vars: {
                monthsInFrench: ['', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
              },
              in: { $arrayElemAt: ['$$monthsInFrench', '$_id.month'] }
            }
          },
          signalements: 1,
          résolus: 1
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    console.error('Erreur getMonthlyStats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * 🗺️ Statistiques par zone géographique
 * GET /api/stats/by-zone
 */
export const getByZone = async (_req: Request, res: Response) => {
  try {
    const data = await Report.aggregate([
      {
        $group: {
          _id: '$location',
          signalements: { $sum: 1 },
          résolus: {
            $sum: {
              $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          zone: '$_id',
          signalements: 1,
          résolus: 1,
          taux: {
            $cond: [
              { $eq: ['$signalements', 0] },
              0,
              { $multiply: [{ $divide: ['$résolus', '$signalements'] }, 100] }
            ]
          }
        }
      },
      { $sort: { signalements: -1 } },
      { $limit: 10 } // Top 10 zones
    ]);

    // Calcul de tendance (simplifié - à améliorer avec historique)
    const result = data.map(item => ({
      ...item,
      taux: Math.round(item.taux),
      tendance: item.taux > 70 ? 'up' : item.taux < 50 ? 'down' : 'stable'
    }));

    res.json(result);
  } catch (error) {
    console.error('Erreur getByZone:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * 📊 Tendance hebdomadaire
 * GET /api/stats/weekly
 */
export const getWeeklyTrend = async (_req: Request, res: Response) => {
  try {
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42); // 6 semaines

    const data = await Report.aggregate([
      {
        $match: {
          createdAt: { $gte: sixWeeksAgo }
        }
      },
      {
        $group: {
          _id: { $week: '$createdAt' },
          signalements: { $sum: 1 },
          résolus: {
            $sum: {
              $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id': 1 } },
      {
        $project: {
          _id: 0,
          semaine: { $concat: ['S', { $toString: '$_id' }] },
          signalements: 1,
          résolus: 1
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    console.error('Erreur getWeeklyTrend:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
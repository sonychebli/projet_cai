import { Request, Response } from 'express';
import Report from '../models/Report';
import Comment from '../models/Comment';

// Créer un signalement avec géolocalisation
export const createReport = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const report = await Report.create({
      ...req.body,
      createdBy: user ? user._id : null,
      trackingNumber: generateTrackingNumber()
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création du signalement',
      error
    });
  }
};

// Récupérer tous les signalements
export const getReports = async (_req: Request, res: Response) => {
  try {
    const reports = await Report.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des signalements',
      error
    });
  }
};

// Récupérer un signalement par ID
export const getReportById = async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!report) {
      return res.status(404).json({ message: 'Signalement non trouvé' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération du signalement',
      error
    });
  }
};

// 🗺️ Récupérer les signalements dans une zone géographique
export const getReportsByLocation = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radius en mètres (défaut 5km)

    if (!lat || !lng) {
      return res.status(400).json({ 
        message: 'Les coordonnées (lat, lng) sont requises' 
      });
    }

    const reports = await Report.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)]
          },
          $maxDistance: parseInt(radius as string)
        }
      }
    })
    .populate('createdBy', 'name email')
    .limit(100);

    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des signalements par localisation',
      error
    });
  }
};

// 🗺️ Statistiques géographiques (heatmap data)
export const getGeographicStats = async (_req: Request, res: Response) => {
  try {
    const reports = await Report.find({ 
      coordinates: { $exists: true, $ne: null } 
    }).select('coordinates crimeType urgency status');

    // Grouper par zone (grid de 0.01 degrés ~1km)
    const heatmapData = reports.reduce((acc: any, report: any) => {
      if (!report.coordinates) return acc;
      
      const gridLat = Math.floor(report.coordinates.lat / 0.01) * 0.01;
      const gridLng = Math.floor(report.coordinates.lng / 0.01) * 0.01;
      const key = `${gridLat},${gridLng}`;
      
      if (!acc[key]) {
        acc[key] = {
          lat: gridLat,
          lng: gridLng,
          count: 0,
          urgencyHigh: 0,
          crimeTypes: {}
        };
      }
      
      acc[key].count++;
      if (report.urgency === 'high') acc[key].urgencyHigh++;
      
      acc[key].crimeTypes[report.crimeType] = 
        (acc[key].crimeTypes[report.crimeType] || 0) + 1;
      
      return acc;
    }, {});

    res.json({
      totalReportsWithLocation: reports.length,
      heatmapData: Object.values(heatmapData)
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques géographiques',
      error
    });
  }
};

// Mettre à jour le statut d'un signalement (Admin uniquement)
export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Signalement non trouvé' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du statut',
      error
    });
  }
};

// Supprimer un signalement (Admin uniquement)
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Signalement non trouvé' });
    }

    // Supprimer les commentaires associés
    await Comment.deleteMany({ reportId: req.params.id });

    res.json({ message: 'Signalement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression du signalement',
      error
    });
  }
};

// Ajouter un commentaire
export const addComment = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { content } = req.body;

    const comment = await Comment.create({
      reportId: req.params.id,
      userId: user._id,
      content
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'name email');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de l\'ajout du commentaire',
      error
    });
  }
};

// Récupérer les commentaires d'un signalement
export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ reportId: req.params.id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des commentaires',
      error
    });
  }
};

// Statistiques pour le dashboard
export const getStatistics = async (_req: Request, res: Response) => {
  try {
    const totalReports = await Report.countDocuments();
    const submittedReports = await Report.countDocuments({ status: 'submitted' });
    const inReviewReports = await Report.countDocuments({ status: 'in_review' });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });

    // Statistiques par type de crime
    const crimeTypes = await Report.aggregate([
      { $group: { _id: '$crimeType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Statistiques par urgence
    const urgencyStats = await Report.aggregate([
      { $group: { _id: '$urgency', count: { $sum: 1 } } }
    ]);

    // Signalements récents (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReports = await Report.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // 🗺️ Statistiques géolocalisation
    const reportsWithLocation = await Report.countDocuments({
      coordinates: { $exists: true, $ne: null }
    });

    res.json({
      total: totalReports,
      submitted: submittedReports,
      inReview: inReviewReports,
      resolved: resolvedReports,
      crimeTypes,
      urgencyStats,
      recentReports,
      reportsWithLocation // Nouveau champ
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques',
      error
    });
  }
};

// Générer un numéro de suivi unique
function generateTrackingNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RPT-${timestamp}-${random}`;
}
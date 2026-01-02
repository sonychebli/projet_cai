// backend/src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import User from '../models/User';
import Report from '../models/Report';
import Comment from '../models/Comment';
import Notification from '../models/Notifications';

class AdminController {
  // ==================== DASHBOARD ====================
  async getDashboardStats(req: Request, res: Response) {
    try {
      const totalUsers = await User.countDocuments();
      const totalReports = await Report.countDocuments();
      const pendingReports = await Report.countDocuments({ status: 'submitted' });
      const inProgressReports = await Report.countDocuments({ status: 'in_review' });
      const resolvedReports = await Report.countDocuments({ status: 'resolved' });
      const rejectedReports = await Report.countDocuments({ status: 'rejected' });
      const activeUsersCount = await Report.distinct('createdBy').then(users => users.length);

      const reportsByType = await Report.aggregate([
        { $group: { _id: '$crimeType', count: { $sum: 1 } } }
      ]);

      res.json({
        success: true,
        data: {
          totalUsers,
          totalReports,
          activeUsers: activeUsersCount,
          pendingReports,
          inProgressReports,
          resolvedReports,
          rejectedReports,
          reportsByType
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Erreur lors de la récupération du dashboard' });
    }
  }

  // ==================== USERS ====================
  async getAllUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const query: any = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(query).skip(skip).limit(Number(limit));
      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: { users, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Erreur lors de la récupération des utilisateurs' });
    }
  }

  async updateUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

      user.role = role;
      await user.save();

      res.json({ success: true, message: 'Rôle mis à jour', data: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du rôle' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

      const reports = await Report.find({ createdBy: user._id });
      if (reports.length > 0) {
        return res.status(400).json({ success: false, message: 'Impossible de supprimer un utilisateur avec des signalements' });
      }

      await User.deleteOne({ _id: user._id });
      res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Erreur lors de la suppression de l\'utilisateur' });
    }
  }

  // ==================== REPORTS ====================
  async getAllReports(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status = '', type = '' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const query: any = {};
      if (status) query.status = status;
      if (type) query.crimeType = type;

      const reports = await Report.find(query).populate('createdBy').skip(skip).limit(Number(limit));
      const total = await Report.countDocuments(query);

      res.json({ success: true, data: { reports, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Erreur lors de la récupération des signalements' });
    }
  }


async updateReportStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await Report.findById(id).populate('createdBy');
    if (!report) return res.status(404).json({ success: false, message: 'Signalement non trouvé' });

    report.status = status;
    await report.save();

    // Create notification
    if (report.createdBy) {
      const notification = new Notification({
        user: report.createdBy._id,
        title: 'Mise à jour de votre signalement',
        message: `Le statut de votre signalement "${report.crimeType}" a été mis à jour : ${status}`
      });
      await notification.save();
    }

    res.json({ success: true, message: 'Statut mis à jour et notification envoyée', data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du statut' });
  }
}


  async deleteReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const report = await Report.findById(id);
      if (!report) return res.status(404).json({ success: false, message: 'Signalement non trouvé' });

      await Report.deleteOne({ _id: report._id });
      res.json({ success: true, message: 'Signalement supprimé' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Erreur lors de la suppression du signalement' });
    }
  }

  // ==================== MESSAGES ====================
  async getMessages(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const messages = await Comment.find().populate('user report').skip(skip).limit(Number(limit));
      const total = await Comment.countDocuments();

      res.json({ success: true, data: { messages, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Erreur lors de la récupération des messages' });
    }
  }

  async sendResponse(req: Request, res: Response) {
  try {
    const { reportId, content } = req.body;
    const adminId = (req as any).user._id;

    const comment = new Comment({ content, user: adminId, report: reportId, isAdminResponse: true });
    await comment.save();

    const report = await Report.findById(reportId).populate('createdBy');
    if (report?.createdBy) {
      const notification = new Notification({
        user: report.createdBy._id,
        title: 'Nouvelle réponse de l\'administration',
        message: `Vous avez reçu une réponse à votre signalement "${report.crimeType}"`
      });
      await notification.save();
    }

    res.json({ success: true, message: 'Réponse envoyée et notification créée', data: comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de la réponse' });
  }
}

  
}

export default new AdminController();

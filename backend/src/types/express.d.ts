import { UserDocument } from '../models/User'; // adapte selon ton modèle

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

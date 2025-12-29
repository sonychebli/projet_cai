import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

// Inscription
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Tous les champs sont requis' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Utilisateur déjà existant' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Utilisateur créé', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Connexion
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const updateAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  
  const user = await User.findOne({ email: 'admin@securicite.fr' });
  if (user) {
    user.role = 'admin';
    await user.save();
    console.log('✅ Rôle mis à jour:', user.role);
  }
  
  await mongoose.disconnect();
  process.exit(0);
};

updateAdmin();
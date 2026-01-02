import 'dotenv/config';

import mongoose from 'mongoose';
import Report from './models/Report';
import User from './models/User';
import { MONGO_URI } from './config/env';


/**
 * 🌱 Script de seed pour remplir la base de données avec des données de démonstration
 * 
 * Exécution : npx ts-node src/seed.ts
 */

const crimeTypes = ['Agression', 'Vol', 'Trafic', 'Cyber', 'Autres'];
const locations = ['Centre-ville', 'Quartier Nord', 'Quartier Sud', 'Périphérie', 'Zone Industrielle'];
const statuses = ['submitted', 'in_review', 'resolved'];
const urgencies = ['low', 'medium', 'high'];

// Fonction pour générer une date aléatoire dans les 6 derniers mois
const getRandomDate = (monthsBack: number = 6) => {
  const now = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - monthsBack);
  const timestamp = start.getTime() + Math.random() * (now.getTime() - start.getTime());
  return new Date(timestamp);
};

// Fonction pour générer des coordonnées aléatoires (Paris environ)
const getRandomCoordinates = () => ({
  lat: 48.8566 + (Math.random() - 0.5) * 0.1, // Paris ± 0.05°
  lng: 2.3522 + (Math.random() - 0.5) * 0.1
});

const seedDatabase = async () => {
  try {
    console.log('🔌 Connexion à MongoDB...');
   await mongoose.connect(MONGO_URI);

    console.log('✅ Connecté à MongoDB');

    // Nettoyer les données existantes (optionnel - à commenter si tu veux garder les données)
    console.log('🧹 Nettoyage des anciennes données...');
    await Report.deleteMany({});
    console.log('✅ Anciennes données supprimées');

    // Récupérer des utilisateurs existants
    const users = await User.find().limit(5);
    console.log(`👥 ${users.length} utilisateur(s) trouvé(s)`);

    // Générer 50 signalements aléatoires
    const reports = [];
    const numberOfReports = 50;

    console.log(`📊 Génération de ${numberOfReports} signalements...`);

    for (let i = 0; i < numberOfReports; i++) {
      const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];
      const isAnonymous = Math.random() > 0.7; // 30% anonymes
      
      // Associer à un utilisateur si pas anonyme et s'il y a des utilisateurs
      const createdBy = !isAnonymous && users.length > 0 
        ? users[Math.floor(Math.random() * users.length)]._id 
        : undefined;

      const report = {
        crimeType,
        title: `${crimeType} - ${location}`,
        description: `Signalement de ${crimeType.toLowerCase()} dans le secteur ${location}. Incident survenu récemment nécessitant une attention des autorités compétentes.`,
        location,
        coordinates: getRandomCoordinates(),
        date: getRandomDate(),
        time: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        urgency,
        isAnonymous,
        images: [],
        status,
        createdBy,
        createdAt: getRandomDate(),
        updatedAt: new Date()
      };

      reports.push(report);
    }

    // Insérer tous les signalements
    await Report.insertMany(reports);
    console.log(`✅ ${numberOfReports} signalements insérés avec succès !`);

    // Afficher un résumé
    const summary = {
      total: await Report.countDocuments(),
      byStatus: {
        submitted: await Report.countDocuments({ status: 'submitted' }),
        inReview: await Report.countDocuments({ status: 'in_review' }),
        resolved: await Report.countDocuments({ status: 'resolved' })
      },
      byType: {}
    };

    for (const type of crimeTypes) {
      (summary.byType as any)[type] = await Report.countDocuments({ crimeType: type });
    }

    console.log('\n📈 RÉSUMÉ DES DONNÉES:');
    console.log('=====================');
    console.log(`Total: ${summary.total}`);
    console.log('\nPar statut:');
    console.log(`  - En attente: ${summary.byStatus.submitted}`);
    console.log(`  - En cours: ${summary.byStatus.inReview}`);
    console.log(`  - Résolus: ${summary.byStatus.resolved}`);
    console.log('\nPar type:');
    Object.entries(summary.byType).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });

    console.log('\n✨ Seed terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
};

// Exécuter le seed
seedDatabase();
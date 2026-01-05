import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  crimeType: string;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude] - format GeoJSON
  };
  date: Date;
  time?: string;
  urgency: 'low' | 'medium' | 'high';
  isAnonymous: boolean;
  images: string[];
  status: 'submitted' | 'in_review' | 'resolved';
  trackingNumber?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema: Schema<IReport> = new Schema({
  crimeType: { 
    type: String, 
    required: true,
    enum: ['theft', 'assault', 'vandalism', 'fraud', 'drug', 'violence', 'cybercrime', 'other']
  },
  title: { 
    type: String, 
    required: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  location: { 
    type: String, 
    required: true 
  },
  // 🗺️ Géolocalisation au format GeoJSON pour MongoDB
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere' // Index géospatial pour les requêtes de proximité
    }
  },
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String 
  },
  urgency: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  isAnonymous: { 
    type: Boolean, 
    default: false 
  },
  images: [{ 
    type: String 
  }],
  status: { 
    type: String, 
    enum: ['submitted', 'in_review', 'resolved'], 
    default: 'submitted' 
  },
  trackingNumber: {
    type: String,
    unique: true,
    sparse: true // Permet les valeurs null sans conflit d'unicité
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true // Crée automatiquement createdAt et updatedAt
});

// Index géospatial pour les recherches par proximité
reportSchema.index({ 'coordinates': '2dsphere' });

// Index pour améliorer les performances des requêtes fréquentes
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ crimeType: 1 });
reportSchema.index({ urgency: 1 });
reportSchema.index({ trackingNumber: 1 });

// Middleware pour convertir les coordonnées du format frontend au format GeoJSON
reportSchema.pre<IReport>('save', function () {
  if (this.coordinates && typeof (this.coordinates as any).lat === 'number') {
    const coords = this.coordinates as any;
    this.coordinates = {
      type: 'Point',
      coordinates: [coords.lng, coords.lat],
    };
  }
});


// Méthode pour obtenir les coordonnées au format {lat, lng}
reportSchema.methods.getLatLng = function() {
  if (this.coordinates && this.coordinates.coordinates) {
    return {
      lng: this.coordinates.coordinates[0],
      lat: this.coordinates.coordinates[1]
    };
  }
  return null;
};

// Méthode statique pour rechercher par proximité
reportSchema.statics.findNearby = function(
  longitude: number, 
  latitude: number, 
  maxDistance: number = 5000
) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  });
};

export default mongoose.model<IReport>('Report', reportSchema);
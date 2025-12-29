'use client';
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  Camera,
  Send,
  CheckCircle
} from 'lucide-react';

interface ReportFormData {
  crimeType: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  urgency: string;
  isAnonymous: boolean;
  images: File[];
}

interface ReportFormProps {
  isAnonymousMode?: boolean;
}

export default function ReportForm({ isAnonymousMode = false }: ReportFormProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    crimeType: '',
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    urgency: 'medium',
    isAnonymous: isAnonymousMode, // Force l'anonymat si mode anonyme
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);

  const crimeTypes = [
    { value: 'theft', label: 'Vol' },
    { value: 'assault', label: 'Agression' },
    { value: 'vandalism', label: 'Vandalisme' },
    { value: 'fraud', label: 'Fraude' },
    { value: 'drug', label: 'Trafic de drogue' },
    { value: 'violence', label: 'Violence domestique' },
    { value: 'cybercrime', label: 'Cybercriminalité' },
    { value: 'other', label: 'Autre' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Faible', color: '#4ade80' },
    { value: 'medium', label: 'Moyen', color: '#fbbf24' },
    { value: 'high', label: 'Urgent', color: '#f87171' }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + formData.images.length > 5) {
      alert('Vous pouvez télécharger maximum 5 images');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Créer des aperçus
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const generateTrackingNumber = () => {
    const prefix = 'REPORT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.crimeType || !formData.description || !formData.location) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      // Ici, votre binôme ajoutera l'appel API
      console.log('Données du signalement:', formData);
      console.log('Mode anonyme:', isAnonymousMode);
      
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Générer un numéro de suivi
      const tracking = generateTrackingNumber();
      setTrackingNumber(tracking);
      
      // Réinitialiser le formulaire
      setFormData({
        crimeType: '',
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        urgency: 'medium',
        isAnonymous: isAnonymousMode,
        images: []
      });
      setImagePreviews([]);
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage du message de succès avec numéro de suivi
  if (trackingNumber) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          background: '#4ade80',
          borderRadius: '50%',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <CheckCircle size={60} color="white" />
        </div>
        
        <h2 style={{ fontSize: '32px', marginBottom: '10px', color: '#333' }}>
          Signalement soumis avec succès !
        </h2>
        
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px', maxWidth: '600px' }}>
          {isAnonymousMode 
            ? "Votre signalement anonyme a été enregistré. Conservez précieusement ce numéro de suivi :"
            : "Votre signalement a été enregistré. Voici votre numéro de suivi :"}
        </p>
        
        <div style={{
          background: '#f3f4f6',
          border: '2px dashed #667eea',
          borderRadius: '12px',
          padding: '20px 40px',
          marginBottom: '30px'
        }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
            Numéro de suivi
          </p>
          <p style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#667eea',
            letterSpacing: '2px',
            margin: 0
          }}>
            {trackingNumber}
          </p>
        </div>
        
        <button
          onClick={() => {
            setTrackingNumber(null);
            if (isAnonymousMode) {
              window.location.href = '/login';
            }
          }}
          style={{
            background: '#667eea',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          {isAnonymousMode ? 'Retour à l\'accueil' : 'Faire un autre signalement'}
        </button>
      </div>
    );
  }

  return (
    <div className="report-section">
      <form onSubmit={handleSubmit} className="report-form-inline">
        {/* Type d'infraction */}
        <div className="form-section">
          <h2>
            <AlertTriangle size={24} />
            Type d'infraction *
          </h2>
          <select
            name="crimeType"
            value={formData.crimeType}
            onChange={handleInputChange}
            required
            className="form-select"
          >
            <option value="">Sélectionnez un type</option>
            {crimeTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Titre */}
        <div className="form-section">
          <h2>
            <FileText size={24} />
            Titre du signalement *
          </h2>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Ex: Vol de véhicule sur parking"
            required
            className="form-input"
            maxLength={100}
          />
          <span className="char-count">{formData.title.length}/100</span>
        </div>

        {/* Description */}
        <div className="form-section">
          <h2>
            <FileText size={24} />
            Description détaillée *
          </h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Décrivez l'incident en détail : que s'est-il passé, qui était impliqué, etc."
            required
            className="form-textarea"
            rows={6}
            maxLength={1000}
          />
          <span className="char-count">{formData.description.length}/1000</span>
        </div>

        {/* Localisation */}
        <div className="form-section">
          <h2>
            <MapPin size={24} />
            Lieu de l'incident *
          </h2>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Adresse complète ou description du lieu"
            required
            className="form-input"
          />
          <button type="button" className="location-button">
            <MapPin size={16} />
            Utiliser ma position actuelle
          </button>
        </div>

        {/* Date et Heure */}
        <div className="form-row">
          <div className="form-section">
            <h2>
              <Calendar size={24} />
              Date *
            </h2>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="form-input"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-section">
            <h2>
              <Clock size={24} />
              Heure
            </h2>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Niveau d'urgence */}
        <div className="form-section">
          <h2>Niveau d'urgence</h2>
          <div className="urgency-buttons">
            {urgencyLevels.map(level => (
              <button
                key={level.value}
                type="button"
                className={`urgency-button ${formData.urgency === level.value ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, urgency: level.value }))}
                style={{
                  '--urgency-color': level.color
                } as React.CSSProperties}
              >
                <span>{level.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload d'images */}
        <div className="form-section">
          <h2>
            <Camera size={24} />
            Photos (optionnel)
          </h2>
          <p className="form-hint">Ajoutez jusqu'à 5 photos pour illustrer votre signalement</p>
          
          <div className="image-upload-container">
            {imagePreviews.length < 5 && (
              <label className="image-upload-label">
                <Camera size={32} />
                <span>Ajouter une photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}

            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img src={preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Anonymat - Caché si mode anonyme forcé */}
        {!isAnonymousMode && (
          <div className="form-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
              />
              <span>Soumettre ce signalement de manière anonyme</span>
            </label>
            {formData.isAnonymous && (
              <p className="info-message">
                Votre identité ne sera pas divulguée. Vous recevrez un numéro de suivi pour consulter l'avancement.
              </p>
            )}
          </div>
        )}

        {/* Bouton de soumission */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Envoi en cours...</>
            ) : (
              <>
                <Send size={20} />
                Soumettre le signalement
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
'use client';
import React, { useState } from 'react';
import '@/styles/repport.css';
import dynamic from 'next/dynamic';
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  Camera,
  Send,
  CheckCircle,
  Loader
} from 'lucide-react';

// Import dynamique de la carte (pour éviter les erreurs SSR)
const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div>Chargement de la carte...</div>
});

interface ReportFormData {
  crimeType: string;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
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
    coordinates: undefined,
    date: '',
    time: '',
    urgency: 'medium',
    isAnonymous: isAnonymousMode,
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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

  // Géolocalisation automatique
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setFormData(prev => ({
          ...prev,
          coordinates: coords
        }));

        // Géocodage inversé pour obtenir l'adresse
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          
          if (data.results && data.results[0]) {
            setFormData(prev => ({
              ...prev,
              location: data.results[0].formatted_address,
              coordinates: coords
            }));
          }
        } catch (error) {
          console.error('Erreur de géocodage inversé:', error);
        }

        setIsLoadingLocation(false);
        setShowMap(true);
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        alert('Impossible d\'obtenir votre position. Veuillez vérifier vos paramètres.');
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Sélection sur la carte
  const handleLocationSelect = async (location: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      coordinates: location
    }));

    // Géocodage inversé
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        setFormData(prev => ({
          ...prev,
          location: data.results[0].formatted_address
        }));
      }
    } catch (error) {
      console.error('Erreur de géocodage inversé:', error);
    }
  };

  // Recherche d'adresse
  const handleAddressSearch = async () => {
    if (!formData.location) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(formData.location)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const location = data.results[0].geometry.location;
        setFormData(prev => ({
          ...prev,
          coordinates: {
            lat: location.lat,
            lng: location.lng
          }
        }));
        setShowMap(true);
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
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
    
    if (!formData.crimeType || !formData.description || !formData.location) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (!isAnonymousMode) {
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const reportPayload = {
        crimeType: formData.crimeType,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        coordinates: formData.coordinates, // 🗺️ Coordonnées ajoutées
        date: formData.date,
        time: formData.time,
        urgency: formData.urgency,
        isAnonymous: formData.isAnonymous,
      };

      console.log('Envoi du signalement avec géolocalisation:', reportPayload);

      const res = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers,
        body: JSON.stringify(reportPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi du signalement');
      }

      const data = await res.json();
      console.log('Réponse du serveur:', data);

      const tracking = data.trackingNumber || data._id || generateTrackingNumber();
      setTrackingNumber(tracking);
      
      setFormData({
        crimeType: '',
        title: '',
        description: '',
        location: '',
        coordinates: undefined,
        date: '',
        time: '',
        urgency: 'medium',
        isAnonymous: isAnonymousMode,
        images: []
      });
      setImagePreviews([]);
      setShowMap(false);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {/* Localisation avec carte 🗺️ */}
        <div className="form-section">
          <h2>
            <MapPin size={24} />
            Lieu de l'incident *
          </h2>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Adresse complète ou description du lieu"
              required
              className="form-input"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              style={{
                background: '#667eea',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Rechercher
            </button>
          </div>

          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLoadingLocation}
            className="location-button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '15px'
            }}
          >
            {isLoadingLocation ? (
              <>
                <Loader size={16} className="animate-spin" />
                Localisation en cours...
              </>
            ) : (
              <>
                <MapPin size={16} />
                Utiliser ma position actuelle
              </>
            )}
          </button>

          {/* Carte interactive */}
          {showMap && (
            <div style={{ marginTop: '15px' }}>
              <MapComponent
                center={formData.coordinates}
                zoom={15}
                onLocationSelect={handleLocationSelect}
                height="400px"
                interactive={true}
              />
              <p style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginTop: '8px',
                fontStyle: 'italic' 
              }}>
                💡 Cliquez sur la carte pour ajuster la position exacte
              </p>
            </div>
          )}

          {!showMap && (
            <button
              type="button"
              onClick={() => setShowMap(true)}
              style={{
                background: '#f3f4f6',
                color: '#667eea',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '2px solid #667eea',
                cursor: 'pointer',
                width: '100%',
                fontWeight: '600'
              }}
            >
              📍 Afficher la carte
            </button>
          )}
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

        {/* Anonymat */}
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
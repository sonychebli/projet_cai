import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { Shield, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import '@/styles/auth.css';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <AuthBackground />

      <div className="auth-container">
        <div className="auth-content">
          <AuthForm mode="login" />

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link
              href="/report"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600'
              }}
            >
              Signaler une infraction
            </Link>
          </div>
        </div>

        <div className="auth-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h2>Plateforme de Signalement des Infractions</h2>
              <p>
                Signalez des crimes, suivez vos déclarations et contribuez à la sécurité
                de votre communauté en toute confidentialité.
              </p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <Shield size={24} />
                </div>
                <div className="feature-text">
                  <h3>100% Sécurisé</h3>
                  <p>
                    Chiffrement de bout en bout. Vos données personnelles sont protégées
                    par des protocoles de sécurité de niveau bancaire.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <AlertCircle size={24} />
                </div>
                <div className="feature-text">
                  <h3>Signalement Rapide</h3>
                  <p>
                    Déclarez une infraction en moins de 3 minutes. Interface intuitive
                    et processus simplifié.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="feature-text">
                  <h3>Suivi en Temps Réel</h3>
                  <p>
                    Recevez des notifications sur l'avancement de votre dossier.
                    Transparence totale sur le traitement.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <MapPin size={24} />
                </div>
                <div className="feature-text">
                  <h3>Géolocalisation</h3>
                  <p>
                    Identifiez précisément le lieu de l'infraction avec notre système
                    de cartographie intégré.
                  </p>
                </div>
              </div>
            </div>

            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">15,000+</span>
                <span className="stat-label">Signalements traités</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Taux de satisfaction</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Disponibilité</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

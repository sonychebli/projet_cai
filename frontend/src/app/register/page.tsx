'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { Shield, CheckCircle, Users, Lock, Bell } from 'lucide-react';
import '@/styles/auth.css';

export default function RegisterPage() {
  const router = useRouter();

  // Cette fonction sera appelée après une inscription réussie
  const handleRegisterSuccess = () => {
    // Rediriger vers le dashboard
    router.push('/dashboard');
  };

  return (
    <div className="auth-page">
      <AuthBackground />
      <div className="auth-container">
        <div className="auth-content">
          <AuthForm mode="register" onSuccess={handleRegisterSuccess} />
        </div>
        <div className="auth-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h2>Pourquoi créer un compte ?</h2>
              <p>
                Rejoignez des milliers de citoyens engagés dans la sécurité de leur
                communauté.
              </p>
            </div>
            <div className="benefits-list">
              <div className="benefit-item">
                <CheckCircle size={20} />
                <p>Signalez des infractions en toute sécurité et anonymat</p>
              </div>
              <div className="benefit-item">
                <CheckCircle size={20} />
                <p>Suivez l'avancement de vos signalements en temps réel</p>
              </div>
              <div className="benefit-item">
                <CheckCircle size={20} />
                <p>Recevez des notifications instantanées sur vos dossiers</p>
              </div>
              <div className="benefit-item">
                <CheckCircle size={20} />
                <p>Accédez à l'historique complet de vos déclarations</p>
              </div>
              <div className="benefit-item">
                <CheckCircle size={20} />
                <p>Communiquez directement avec les autorités compétentes</p>
              </div>
              <div className="benefit-item">
                <CheckCircle size={20} />
                <p>Consultez les statistiques de criminalité de votre secteur</p>
              </div>
            </div>
            <div className="security-features">
              <h3>
                <Shield size={22} />
                Vos données sont protégées
              </h3>
              <div className="security-grid">
                <div className="security-item">
                  <Lock size={18} />
                  <span>Chiffrement SSL/TLS</span>
                </div>
                <div className="security-item">
                  <Users size={18} />
                  <span>Anonymat garanti</span>
                </div>
                <div className="security-item">
                  <Shield size={18} />
                  <span>Conformité RGPD</span>
                </div>
                <div className="security-item">
                  <Bell size={18} />
                  <span>Alertes sécurisées</span>
                </div>
              </div>
            </div>
            <div className="trust-badge">
              <Shield size={32} />
              <div>
                <strong>Plateforme Certifiée</strong>
                <p>En partenariat avec les autorités locales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';
import { Lock, Shield, Users, BarChart, Settings, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import '@/styles/admin-login.css';

export default function AdminLoginPage() {
  const router = useRouter();
  
  const { setUser } = useUserContext();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulation de vérification d'identifiants admin
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ici, votre binôme ajoutera la vérification réelle avec l'API
      const adminCredentials = [
        { username: 'admin', password: 'admin123' },
        { username: 'securite', password: 'securite2024' },
        { username: 'police', password: 'police123' }
      ];

      const isValid = adminCredentials.some(
        cred => cred.username === credentials.username && 
                cred.password === credentials.password
      );

      if (isValid) {
        // Simuler la connexion admin réussie
        setUser({
          id: 'admin-' + Date.now(),
          name: credentials.username,
          email: `${credentials.username}@securicite.fr`,
          role: 'admin',
          token: 'admin-token-' + Math.random().toString(36).substr(2)
        });

        // Rediriger vers le dashboard admin
        router.push('/admin-dashboard');
      } else {
        setError('Identifiants administrateur incorrects');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToUserLogin = () => {
    router.push('/login');
  };

  return (
    <div className="admin-login-page">
      {/* Background avec overlay */}
      <div className="admin-background">
        <div className="admin-background-overlay"></div>
      </div>

      <div className="admin-login-container">
        {/* Sidebar gauche - Présentation admin */}
        <div className="admin-login-sidebar">
          <div className="admin-logo">
            <Shield size={48} />
            <h1>SecuriCité <span className="admin-badge">ADMIN</span></h1>
          </div>

          <div className="admin-features">
            <h2>Panneau d'Administration</h2>
            <p className="admin-subtitle">
              Gestion complète de la plateforme de signalement
            </p>

            <div className="admin-feature-list">
              <div className="admin-feature-item">
                <div className="admin-feature-icon">
                  <Users size={24} />
                </div>
                <div>
                  <h4>Gestion des Utilisateurs</h4>
                  <p>Gérez les comptes et permissions des utilisateurs</p>
                </div>
              </div>

              <div className="admin-feature-item">
                <div className="admin-feature-icon">
                  <BarChart size={24} />
                </div>
                <div>
                  <h4>Analyses Avancées</h4>
                  <p>Tableaux de bord et statistiques détaillées</p>
                </div>
              </div>

              <div className="admin-feature-item">
                <div className="admin-feature-icon">
                  <Settings size={24} />
                </div>
                <div>
                  <h4>Configuration</h4>
                  <p>Paramètres système et configurations avancées</p>
                </div>
              </div>
            </div>

            <div className="admin-security-notice">
              <Lock size={20} />
              <p>
                <strong>Accès Restreint :</strong> Cette zone est réservée au personnel autorisé.
                Toute tentative d'accès non autorisé sera journalisée.
              </p>
            </div>
          </div>

          <div className="admin-footer">
            <p>© 2024 SecuriCité - Plateforme de Signalement</p>
            <p>Version Admin 2.1.0</p>
          </div>
        </div>

        {/* Formulaire de connexion admin */}
        <div className="admin-login-form-container">
          <div className="admin-login-form-wrapper">
            <div className="form-header">
              <h2>Connexion Administrateur</h2>
              <p>Accédez au panneau d'administration sécurisé</p>
            </div>

            <form onSubmit={handleSubmit} className="admin-login-form">
              <div className="input-group">
                <label htmlFor="username">
                  <Lock size={16} />
                  Identifiant Administrateur
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  placeholder="admin"
                  required
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">
                  <Lock size={16} />
                  Mot de passe
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="admin-login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Se connecter en tant qu'admin
                  </>
                )}
              </button>

              <div className="form-footer">
                <button
                  type="button"
                  className="back-to-user-login"
                  onClick={handleBackToUserLogin}
                >
                  ← Retour à la connexion utilisateur
                </button>
                
                <div className="admin-hint">
                  <Lock size={14} />
                  <span>Identifiants de test : admin / admin123</span>
                </div>
              </div>
            </form>

            <div className="security-info">
              <div className="security-item">
                <div className="security-icon">🔒</div>
                <div>
                  <h4>Connexion Sécurisée</h4>
                  <p>Toutes les communications sont chiffrées avec TLS 1.3</p>
                </div>
              </div>
              <div className="security-item">
                <div className="security-icon">📋</div>
                <div>
                  <h4>Journal d'Activité</h4>
                  <p>Toutes les actions sont enregistrées et traçables</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
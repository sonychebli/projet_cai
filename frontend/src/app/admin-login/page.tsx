'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';
import { Lock, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import '@/styles/admin-login.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setUser } = useUserContext();

  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const adminCredentials = [
        { username: 'admin', password: 'admin123' },
        { username: 'securite', password: 'securite2024' },
        { username: 'police', password: 'police123' }
      ];

      const isValid = adminCredentials.some(
        cred => cred.username === credentials.username && cred.password === credentials.password
      );

      if (isValid) {
        setUser({
          id: 'admin-' + Date.now(),
          name: credentials.username,
          email: `${credentials.username}@securicite.fr`,
          role: 'admin',
          token: 'admin-token-' + Math.random().toString(36).substr(2)
        });

        router.push('/admin/dashboard');
      } else {
        setError('Identifiants administrateur incorrects');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-background">
        <div className="admin-background-overlay"></div>
      </div>

      <div className="admin-login-container">
        {/* Formulaire de connexion admin uniquement */}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import { Lock, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import '@/styles/admin-login.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
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
      const response = await authService.login(credentials.email, credentials.password);

      if (response.token && response.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (response.token && response.role !== 'admin') {
        setError('Accès refusé. Vous devez être administrateur.');
        authService.logout();
      } else {
        setError(response.message || 'Identifiants incorrects');
      }
    } catch (err: any) {
      setError('Erreur de connexion. Vérifiez vos identifiants.');
      console.error('Login error:', err);
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
        <div className="admin-login-form-container">
          <div className="admin-login-form-wrapper">
            <div className="form-header">
              <h2>Connexion Administrateur</h2>
              <p>Accédez au panneau d'administration sécurisé</p>
            </div>

            <form onSubmit={handleSubmit} className="admin-login-form">
              <div className="input-group">
                <label htmlFor="email">
                  <Lock size={16} />
                  Email Administrateur
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="admin@securicite.fr"
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
                    Se connecter
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
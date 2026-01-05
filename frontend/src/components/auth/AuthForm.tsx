"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { SocialLogin } from './SocialLogin';
import { ApiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  first_name: z.string().min(2, 'Prénom requis'),
  last_name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
}

const LoginFormContent: React.FC<{
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}> = ({ onSubmit, isLoading, showPassword, setShowPassword }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <>
      <Input
        {...register('email')}
        id="email"
        type="email"
        label="Adresse email"
        icon={Mail}
        placeholder="votre.email@exemple.com"
        error={errors.email?.message}
      />

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          <Lock size={18} />
          Mot de passe
        </label>
        <div className="input-wrapper password-wrapper">
          <input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <span className="error-message">{errors.password.message}</span>
        )}
      </div>

      <div className="form-options">
        <label className="checkbox-label">
          <input type="checkbox" {...register('rememberMe')} />
          <span>Se souvenir de moi</span>
        </label>
        <a href="/forgot-password" className="link">
          Mot de passe oublié ?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        Se connecter
      </Button>
    </>
  );
};

const RegisterFormContent: React.FC<{
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}> = ({ onSubmit, isLoading, showPassword, setShowPassword }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <>
      <div className="form-row">
        <Input
          {...register('first_name')}
          id="first_name"
          label="Prénom"
          icon={User}
          placeholder="Jean"
          error={errors.first_name?.message}
        />
        <Input
          {...register('last_name')}
          id="last_name"
          label="Nom"
          icon={User}
          placeholder="Dupont"
          error={errors.last_name?.message}
        />
      </div>

      <Input
        {...register('email')}
        id="email"
        type="email"
        label="Adresse email"
        icon={Mail}
        placeholder="votre.email@exemple.com"
        error={errors.email?.message}
      />

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          <Lock size={18} />
          Mot de passe
        </label>
        <div className="input-wrapper password-wrapper">
          <input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <span className="error-message">{errors.password.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">
          <Lock size={18} />
          Confirmer le mot de passe
        </label>
        <div className="input-wrapper">
          <input
            {...register('confirmPassword')}
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="••••••••"
          />
        </div>
        {errors.confirmPassword && (
          <span className="error-message">{errors.confirmPassword.message}</span>
        )}
      </div>

      <div className="form-terms">
        <label className="checkbox-label">
          <input type="checkbox" {...register('acceptTerms')} />
          <span>
            J'accepte les{' '}
            <a href="/terms" className="link">
              conditions d'utilisation
            </a>{' '}
            et la{' '}
            <a href="/privacy" className="link">
              politique de confidentialité
            </a>
          </span>
        </label>
        {errors.acceptTerms && (
          <span className="error-message">{errors.acceptTerms.message}</span>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        Créer mon compte
      </Button>
    </>
  );
};

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError('');

    try {
      const response = await authService.login(data.email, data.password);

      if (!response.token) {
        setApiError('Email ou mot de passe incorrect');
        return;
      }

      // Redirection selon rôle (si tu as stocké un rôle)
      if (response.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/welcom');
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setApiError('');

    try {
      const response = await authService.register(
        `${data.first_name} ${data.last_name}`,
        data.email,
        data.password
      );

      if (!response.userId) {
        setApiError('Impossible de créer le compte');
        return;
      }

      // Redirection vers login après inscription
      router.push('/login');

      if (onSuccess) onSuccess();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-header">
        <div className="auth-logo">
          <Shield size={48} strokeWidth={1.5} />
        </div>
        <h1>{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h1>
        <p>
          {mode === 'login'
            ? 'Accédez à votre espace de signalement sécurisé'
            : 'Rejoignez notre plateforme de signalement des infractions'}
        </p>
      </div>

      {apiError && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{apiError}</span>
        </div>
      )}

      <div className="auth-form">
        {mode === 'login' ? (
          <LoginFormContent
            onSubmit={handleLoginSubmit}
            isLoading={isLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        ) : (
          <RegisterFormContent
            onSubmit={handleRegisterSubmit}
            isLoading={isLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        )}

        <SocialLogin />

        <div className="form-footer">
          <p>
            {mode === 'login'
              ? "Vous n'avez pas de compte ?"
              : 'Vous avez déjà un compte ?'}
            <Link href={mode === 'login' ? '/register' : '/login'} className="link-primary">
              {mode === 'login' ? 'Inscrivez-vous' : 'Connectez-vous'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
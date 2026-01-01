'use client';
import React from 'react';
import ReportForm from '@/components/home/ReportForm';
import { ArrowLeft, Shield, Lock, Eye, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


export default function ReportAnonymePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.3), transparent 50%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header avec glassmorphism */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          padding: '20px 35px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              position: 'relative',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 0 20px rgba(126, 34, 206, 0.5)'
            }}>
              <Image src="/logo.jfif" alt="Logo" width={50} height={50} />
            </div>
            <div>
              <h1 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: '28px',
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}>
                Signalement Anonyme
              </h1>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '2px 0 0 0',
                fontSize: '14px'
              }}>
                Protection totale de votre identité
              </p>
            </div>
          </div>
          
          <Link 
            href="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ArrowLeft size={18} />
            Retour
          </Link>
        </header>

        {/* Bandeaux d'information avec cards modernes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Card principale */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.4)',
            gridColumn: 'span 2'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Shield size={32} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '24px', 
                  color: 'white',
                  fontWeight: '700',
                  marginBottom: '10px'
                }}>
                  Protection de votre anonymat garantie à 100%
                </h2>
                <p style={{ 
                  margin: 0, 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontSize: '15px',
                  lineHeight: '1.6'
                }}>
                  Ce signalement est entièrement anonyme. Aucune information personnelle ne sera collectée. 
                  Vous recevrez un numéro de suivi unique pour consulter l'avancement de votre dossier en toute confidentialité.
                </p>
              </div>
            </div>
          </div>

          {/* Mini cards informatives */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex'
            }}>
              <Lock size={24} color="white" />
            </div>
            <div>
              <h3 style={{ 
                margin: 0, 
                fontSize: '16px', 
                color: 'white',
                fontWeight: '600',
                marginBottom: '5px'
              }}>
                Cryptage sécurisé
              </h3>
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>
                Données chiffrées de bout en bout
              </p>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex'
            }}>
              <Eye size={24} color="white" />
            </div>
            <div>
              <h3 style={{ 
                margin: 0, 
                fontSize: '16px', 
                color: 'white',
                fontWeight: '600',
                marginBottom: '5px'
              }}>
                Zéro traçabilité
              </h3>
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>
                Aucune trace de votre identité
              </p>
            </div>
          </div>
        </div>

        {/* Conteneur du formulaire moderne */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '25px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          marginBottom: '30px'
        }}>
          <ReportForm isAnonymousMode={true} />
        </div>

        {/* Footer moderne avec info urgence */}
        <footer style={{
          background: 'rgba(239, 68, 68, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '25px 35px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            flexShrink: 0
          }}>
            <AlertCircle size={28} color="white" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'white', fontWeight: '600', marginBottom: '5px' }}>
              En cas d'urgence immédiate
            </h3>
            <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255, 255, 255, 0.9)' }}>
              Contactez directement les services d'urgence : 
              <strong style={{ marginLeft: '8px', color: '#fbbf24' }}>
                17 (Police) • 18 (Pompiers) • 15 (SAMU)
              </strong>
            </p>
          </div>
        </footer>
      </div>

      {/* Particules décoratives */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
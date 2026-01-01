'use client';
import React, { useState } from 'react';
import { AlertCircle, FileText, Search, Bell, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import '@/styles/welcom.css';
import { FaUserCircle, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import ReportForm from '@/components/home/ReportForm';
import SuiviComponent from '@/components/home/FollowUp';
import StatisticsComponent from '@/components/home/StatisticsDashboard.tsx';
import NotificationsComponent from '@/components/home/notifications';
import { useEffect } from 'react';

export default function WelcomePage() {
   const [user, setUser] = useState<any>(null);

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);

  // Commentaires
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [submittedComments, setSubmittedComments] = useState<
    { text: string; rating: number; user: string }[]
  >([]);

  // Recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);


  // Active Tab
  const [activeTab, setActiveTab] = useState('Home');

  const handleCommentSubmit = () => {
    if (!comment) return;
    setSubmittedComments([...submittedComments, { text: comment, rating, user: user?.name || 'Anonyme' }]);
    setComment('');
    setRating(0);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');

    window.location.href = '/login';
  };

  return (
    <div className="welcome-page">
      {/* HEADER FIXE */}
      <header className="top-menu">
        <div className="header-left">
          <div className="logo-container">
            <Image src="/logo.jfif" alt="SecuriCité Logo" width={50} height={50} />
          </div>
          <h1 className="site-title">SecuriCité</h1>
        </div>
        <div className="header-center">
          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Rechercher un signalement, une infraction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && alert(`Recherche pour : ${searchQuery}`)}
            />
            <button onClick={() => alert(`Recherche pour : ${searchQuery}`)}>Rechercher</button>
          </div>
        </div>
        <div className="profile-section">
          <FaUserCircle size={28} color="white" />
          <span style={{ color: 'white', marginRight: '10px' }}>{user?.name || 'Utilisateur'}</span>
          <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>

      {/* NAV BAR - Navigation principale */}
      <div className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'Home' ? 'active' : ''}`}
          onClick={() => setActiveTab('Home')}
        >
          Accueil
        </button>
        <button
          className={`tab-btn ${activeTab === 'Signalement' ? 'active' : ''}`}
          onClick={() => setActiveTab('Signalement')}
        >
          <AlertCircle size={18} style={{ marginRight: '5px' }} />
          Faire un signalement
        </button>
        <button
          className={`tab-btn ${activeTab === 'Suivi' ? 'active' : ''}`}
          onClick={() => setActiveTab('Suivi')}
        >
          <FileText size={18} style={{ marginRight: '5px' }} />
          Suivi
        </button>
        <button
          className={`tab-btn ${activeTab === 'Statistiques' ? 'active' : ''}`}
          onClick={() => setActiveTab('Statistiques')}
        >
          <BarChart3 size={18} style={{ marginRight: '5px' }} />
          Statistiques
        </button>
        <button
          className={`tab-btn ${activeTab === 'Notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('Notifications')}
        >
          <Bell size={18} style={{ marginRight: '5px' }} />
          Notifications
          {}
        </button>
        
      </div>

      {/* CONTENU PRINCIPAL - Change selon l'onglet actif */}
      <main className="content">
        {activeTab === 'Home' && (
          <>
            <section className="infractions">
              <h2>Infractions courantes</h2>
              <div className="infractions-grid">
                <div className="infraction-card">
                  <Image src="/3.jpg" alt="Agression" width={400} height={250} />
                  <h3>Agression</h3>
                  <p>Les agressions physiques représentent une menace directe pour la sécurité des citoyens. Signalez rapidement pour une intervention efficace.</p>
                </div>
                <div className="infraction-card">
                  <Image src="/4.jpg" alt="Vol" width={400} height={250} />
                  <h3>Vol</h3>
                  <p>Le vol affecte les biens et la sécurité. Déclarer ces incidents permet d'identifier les zones à risque et prévenir la récidive.</p>
                </div>
                <div className="infraction-card">
                  <Image src="/1.jpg" alt="Trafic de drogue" width={400} height={250} />
                  <h3>Trafic de drogue</h3>
                  <p>Le trafic alimente l'insécurité et la criminalité organisée. Les signalements citoyens sont essentiels pour lutter contre ces réseaux.</p>
                </div>
                <div className="infraction-card">
                  <Image src="/2.jpg" alt="Cybercriminalité" width={400} height={250} />
                  <h3>Cybercriminalité</h3>
                  <p>Le piratage, les fraudes en ligne et le vol de données mettent vos informations personnelles en danger. Signalez ces incidents pour protéger la communauté.</p>
                </div>
              </div>
            </section>
          </>
        )}
        
        {activeTab === 'Signalement' && (
          <ReportForm />
        )}
        
        {activeTab === 'Suivi' && (
          <SuiviComponent />
        )}
        
        {activeTab === 'Statistiques' && (
          <StatisticsComponent />
        )}

      {activeTab === 'Notifications' && (
  <NotificationsComponent />
)}
      </main>

      {/* FOOTER COMMENTAIRES + CONTACT */}
      <footer className="footer-comment">
        <h2>Commentaires & Avis</h2>
        <textarea
          placeholder="Donnez votre avis sur votre expérience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="rating">
          <label>Note :</label>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
          />
          <div className="stars">
            {Array.from({ length: 5 }, (_, i) => {
              const fullStar = i + 1 <= rating;
              const halfStar = i + 0.5 === rating;
              return <span key={i} className="star">{fullStar ? '★' : halfStar ? '⯨' : '☆'}</span>;
            })}
          </div>
        </div>
        <button onClick={handleCommentSubmit}>Envoyer</button>

        <div className="comments-list">
          {submittedComments.map((c, idx) => (
            <div key={idx} className="comment">
              <strong>{c.user} :</strong> {c.text} <span className="comment-rating">{'★'.repeat(Math.floor(c.rating))}</span>
            </div>
          ))}
        </div>

        {/* CONTACT & RESEAUX SOCIAUX */}
        <section className="contact-social-section">
          <h2>Contactez-nous & Suivez-nous</h2>
          <p>Pour toute question ou assistance :</p>
          <ul className="contact-info">
            <li>Email : <a href="mailto:contact@signalement.com">contact@signalement.com</a></li>
            <li>Téléphone : <a href="tel:+33559982222">+33 5 59 98 22 22</a></li>
            <li>Adresse : 5 rue O'Quin 64000 Pau, France</li>
          </ul>
          <div className="socials">
            <h3>Suivez-nous sur :</h3>
            <ul className="social-links">
              <li><a href="https://www.facebook.com/ServicePublicFr" target="_blank" rel="noopener noreferrer"><FaFacebookF /> Facebook</a></li>
              <li><a href="https://www.instagram.com/servicepublicfr/" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a></li>
              <li><a href="https://fr.linkedin.com/company/entreprendre-servicepublic" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /> LinkedIn</a></li>
            </ul>
          </div>
        </section>
      </footer>
    </div>
  );
}
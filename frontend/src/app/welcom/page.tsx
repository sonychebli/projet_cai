'use client';
import React, { useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { Users, FileText, Search, AlertCircle, Bell } from 'lucide-react';
import Image from 'next/image';
import '@/styles/welcom.css';
import Link from 'next/link';
import { FaUserCircle, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function WelcomePage() {
  const { user } = useUserContext();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [submittedComments, setSubmittedComments] = useState<
    { text: string; rating: number; user: string }[]
  >([]);

  const handleCommentSubmit = () => {
    if (!comment) return;
    setSubmittedComments([...submittedComments, { text: comment, rating, user: user?.name || 'Anonyme' }]);
    setComment('');
    setRating(0);
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <div className="welcome-page">
      {/* MENU HORIZONTAL */}
      <header className="top-menu">
        <h1 className="site-title">Plateforme de Signalement</h1>
        <nav className="menu-nav">
          <ul className="menu-list">
            <li>
              <Link href="/report" className="menu-link"><AlertCircle size={18} /> Faire un signalement</Link>
            </li>
            <li>
              <Link href="/suivi" className="menu-link"><FileText size={18} /> Suivi</Link>
            </li>
            <li>
              <Link href="/recherche" className="menu-link"><Search size={18} /> Recherche</Link>
            </li>
            <li>
              <Link href="/notifications" className="menu-link"><Bell size={18} /> Notifications</Link>
            </li>
          </ul>

          {/* Profil + Déconnexion */}
          <div className="profile-section">
            <FaUserCircle size={28} color="white" />
            <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
          </div>
        </nav>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="content">
        {/* PHOTOS + ARTICLES */}
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
              <p>Le vol affecte les biens et la sécurité. Déclarer ces incidents permet d’identifier les zones à risque et prévenir la récidive.</p>
            </div>
            <div className="infraction-card">
              <Image src="/1.jpg" alt="Trafic de drogue" width={400} height={250} />
              <h3>Trafic de drogue</h3>
              <p>Le trafic alimente l’insécurité et la criminalité organisée. Les signalements citoyens sont essentiels pour lutter contre ces réseaux.</p>
            </div>
            <div className="infraction-card">
              <Image src="/2.jpg" alt="Cybercriminalité" width={400} height={250} />
              <h3>Cybercriminalité</h3>
              <p>Le piratage, les fraudes en ligne et le vol de données mettent vos informations personnelles en danger. Signalez ces incidents pour protéger la communauté.</p>
            </div>
          </div>
        </section>
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
            <br />
            <br />
            
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

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
      const [navOpen, setNavOpen] = useState(false);
    // Enable smooth scrolling for anchor links
    useEffect(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
      return () => {
        document.documentElement.style.scrollBehavior = '';
      };
    }, []);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'Is Club-Connect free?',
      answer: 'Yes! Club-Connect is completely free for students. Schools can upgrade to premium features for advanced analytics.'
    },
    {
      question: 'How do I join a club?',
      answer: 'Simply browse clubs, click on one that interests you, and hit the "Join" button. You\'ll instantly get access to events and announcements.'
    },
    {
      question: 'Can I track my participation?',
      answer: 'Absolutely! Your profile shows all joined clubs, attended events, earned badges, and participation statistics.'
    },
    {
      question: 'Is my data secure?',
      answer: 'We prioritize privacy with encrypted data storage and compliance with educational privacy standards.'
    }
  ];

  const tourCloseRef = useRef(null);
  const [showTour, setShowTour] = useState(false);

  // Modal focus-trap and Esc-to-close
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setShowTour(false);
    }
    if (!showTour) return;

    const modal = document.querySelector('.modal');
    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = modal ? Array.from(modal.querySelectorAll(focusableSelector)) : [];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function trapTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKey);
    document.addEventListener('keydown', trapTab);
    // autofocus first focusable
    setTimeout(() => { if (first) first.focus(); }, 0);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('keydown', trapTab);
    };
  }, [showTour]);

  

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="landing-navbar" role="banner">
        <div className="container" style={{position: 'relative'}}>
          <div className="logo">🏫 Club-Connect</div>
          {/* Hamburger icon for mobile */}
          <button className="hamburger" aria-label="Open navigation" onClick={() => setNavOpen(true)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
          {/* Side drawer nav */}
          <nav className={`mobile-nav${navOpen ? ' open' : ''}`}> 
            <button className="close-nav" aria-label="Close navigation" onClick={() => setNavOpen(false)}>&times;</button>
            <ul>
              <li>
                <a href="#features" onClick={e => {e.preventDefault(); setNavOpen(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });}}>Features</a>
              </li>
              <li>
                <a href="#testimonials" onClick={e => {e.preventDefault(); setNavOpen(false); document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });}}>Testimonials</a>
              </li>
              <li><Link to="/app/login" onClick={()=>setNavOpen(false)}>Sign in</Link></li>
              <li><Link to="/app/register" className="btn" onClick={()=>setNavOpen(false)}>Sign up</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <h1>The future of student clubs happens together</h1>
            <p>Student connection endures. Club-Connect brings students, clubs, and opportunities together in one simple platform.</p>
            <div className="hero-actions">
              <Link to="/app/register" className="btn primary">Sign up for ClubConnect</Link>
              <Link to="/app/login" className="btn outline">Sign in</Link>
              <button className="btn outline" onClick={() => setShowTour(true)} aria-haspopup="dialog">Take a quick tour</button>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="false">
            <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="illustrationTitle illustrationDesc">
              <title id="illustrationTitle">Club-Connect illustration</title>
              <desc id="illustrationDesc">Stylized illustration of students collaborating around clubs and events.</desc>
              <rect x="0" y="0" width="100%" height="100%" fill="#F5F7FB"/>
              <g transform="translate(40,40)">
                <circle cx="80" cy="80" r="48" fill="#7ED957" opacity="0.15" />
                <rect x="150" y="40" width="220" height="120" rx="12" fill="#fff" stroke="#E6EEF8" />
                <circle cx="210" cy="100" r="28" fill="#6EB5FF" opacity="0.18" />
                <rect x="200" y="220" width="280" height="120" rx="12" fill="#fff" stroke="#E6EEF8" />
                <text x="170" y="110" fontSize="18" fill="#0b1220">Discover clubs</text>
                <text x="210" y="260" fontSize="18" fill="#0b1220">Events & RSVP</text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      <main id="main">
      <section id="features" className="section features" aria-labelledby="features-heading">
        <div className="container">
          <h2 id="features-heading">Accelerate your student experience</h2>
          <p>From joining your first club to leading events, Club-Connect provides tools to help you get involved and stay connected.</p>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🧑‍🤝‍🧑 Discover & Join Clubs</h3>
              <p>Browse all available clubs with detailed descriptions, meeting times, and leadership info. Join instantly and get access to exclusive content.</p>
              <Link to="/app/clubs" className="feature-link">Explore clubs →</Link>
            </div>
            <div className="feature-card">
              <h3>📅 Track Events & Meetings</h3>
              <p>Never miss a meeting again. View upcoming events, set reminders, and mark attendance directly from your dashboard.</p>
              <Link to="/app" className="feature-link">View events →</Link>
            </div>
            <div className="feature-card">
              <h3>📊 Monitor Participation</h3>
              <p>Track your involvement across clubs. See attendance history, earned badges, and participation stats in one place.</p>
              <Link to="/app/profile" className="feature-link">View profile →</Link>
            </div>
            <div className="feature-card">
              <h3>📢 Stay Updated</h3>
              <p>Receive real-time announcements from club leaders. No more missed messages or scattered information.</p>
              <Link to="/app/notifications" className="feature-link">Check notifications →</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="section testimonials">
        <div className="container">
          <h2>Trusted by students and schools nationwide</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p>"Club-Connect made it so easy to find and join clubs. I discovered my passion for art and became club president!"</p>
              <p><strong>Sarah Johnson</strong><br/>Art Club President, University of Example</p>
            </div>
            <div className="testimonial-card">
              <p>"The event tracking saved me hours. I never miss meetings anymore and my grades improved from better time management."</p>
              <p><strong>Mike Chen</strong><br/>Sports Enthusiast, State College</p>
            </div>
            <div className="testimonial-card">
              <p>"As a club leader, managing announcements and tracking attendance is now effortless. Highly recommend!"</p>
              <p><strong>Emily Rodriguez</strong><br/>Tech Club Leader, Tech University</p>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <h3>50+</h3>
              <p>Schools using Club-Connect</p>
            </div>
            <div className="stat">
              <h3>1000+</h3>
              <p>Active students</p>
            </div>
            <div className="stat">
              <h3>25%</h3>
              <p>Increase in club participation</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section faq" aria-labelledby="faq-heading">
        <div className="container">
          <h2 id="faq-heading">Frequently asked questions</h2>
          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  id={`faq-${index}-btn`}
                  className={`faq-question ${openFaq === index ? 'active' : ''}`}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-${index}-panel`}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openFaq === index ? '−' : '+'}</span>
                </button>
                <div id={`faq-${index}-panel`} className={`faq-answer ${openFaq === index ? 'open' : ''}`} role="region" aria-labelledby={`faq-${index}-btn`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="container">
          <h2>Ready to build your college experience?</h2>
          <p>Join thousands of students already using Club-Connect to discover opportunities and stay connected.</p>
          <Link to="/app/register" className="btn primary large">Get started for free</Link>
        </div>
      </section>

      </main>
      <footer className="footer">
        <div className="container">
          <nav>
            <ul>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </nav>
          <p>&copy; 2025 Club-Connect</p>
        </div>
      </footer>
      {/* Removed duplicate header/navbar and skip-link */}
    </>
  );
};

export default Landing;
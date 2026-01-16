import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Landing.css';

const isMobile = () => window.matchMedia && window.matchMedia('(max-width: 600px)').matches;

const Landing = () => {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  // Enable smooth scrolling for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
  // Scroll to section if location.state.scrollTo is set
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);
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

  const [mobile, setMobile] = useState(isMobile());
  useEffect(() => {
    const handler = () => setMobile(isMobile());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="landing-navbar" role="banner">
        <div className="container" style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '56px'}}>
          <div className="logo" style={{fontSize: '1.3rem', fontWeight: 700}}>🏫 Club-Connect</div>
          <nav>
            <ul style={{display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0}}>
              <li><a href="#features">Features</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#cta">Get Started</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main">
        <section id="features" className="section features" aria-labelledby="features-heading" style={{paddingTop: '1.2rem'}}>
          <div className="container" style={{maxWidth: 420, margin: '0 auto'}}>
            <div className="feature-card app-feature-card" style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0.8rem 1rem', borderRadius: 12, boxShadow: '0 1px 6px rgba(110,181,255,0.07)', marginBottom: 12, cursor: 'pointer', border: '1.5px solid #F0F4F8'}}>
              <span style={{fontSize: '1.5rem', marginRight: 8}}>🧑‍🤝‍🧑</span>
              <div style={{flex: 1}}>
                <div style={{fontWeight: 600, fontSize: '1.08rem'}}>Discover & Join Clubs <span style={{fontSize: '1.1rem', color: '#6EB5FF'}}>→</span></div>
                <div style={{fontSize: '0.97rem', color: '#666', marginTop: 2}}>Browse all clubs, join instantly, and get access to exclusive content.</div>
              </div>
            </div>
          </div>
        </section>
        <section id="faq" className="section faq" aria-labelledby="faq-heading">
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
        {/* Hide testimonials and marketing on mobile */}
        {!mobile && (
          <>
            <section id="testimonials" className="section testimonials" aria-label="Testimonials">
              <div className="container">
                <h2>Trusted by students and schools nationwide</h2>
                <div className="testimonials-grid">
                  <div className="testimonial-card">
                    <p>"Club-Connect made it so easy to find and join clubs—discovered my passion for art and became club president!"</p>
                    <div className="testimonial-author">
                      <strong>Sarah Johnson</strong><br />
                      Art Club President, University of Example
                    </div>
                  </div>
                  {/* Add more testimonials as needed */}
                </div>
              </div>
            </section>
          </>
        )}
        <section id="cta" className="section cta">
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
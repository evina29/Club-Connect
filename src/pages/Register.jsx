import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ProgressStepper from '../components/ProgressStepper.jsx';
import { schools, languages, userRoles, notificationTypes } from '../data/onboardingData.js';
import { geocodeZip, findSchoolsByBBox } from '../services/schoolLookup.js';
import './Register.css';
import { useLanguage } from '../context/LanguageContext.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Step 1: School Selection
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedSchoolKey, setSelectedSchoolKey] = useState(null);
  const [customSchool, setCustomSchool] = useState('');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [showCustomSchool, setShowCustomSchool] = useState(false);
  const [zipQuery, setZipQuery] = useState('');
  const [zipResults, setZipResults] = useState([]);
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState('');
  
  // Step 2: Account Creation
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState('👤');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Profile pic options
  const profilePics = [
    '👤', '😊', '😎', '🤓', '🥳', '🦊', '🐱', '🐶', 
    '🐼', '🦁', '🐯', '🦄', '🌟', '⭐', '💫', '✨',
    '🎨', '🎭', '🎪', '🎸', '🎮', '⚽', '🏀', '🎯'
  ];
  
  // Step 3: Language Preference
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { setLanguage } = useLanguage();
  
  // Step 4: Role & Clubs
  const [selectedRole, setSelectedRole] = useState('student');
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [clubSearch, setClubSearch] = useState('');
  
  // Step 5: Notification Preferences
  const [notifications, setNotifications] = useState({
    events: true,
    messages: true,
    voting: true,
    attendance: true,
    announcements: true
  });
  
  const steps = ['School', 'Account', 'Language', 'Role & Clubs', 'Notifications', 'Preview'];
  const totalSteps = steps.length;
  
  // Filter schools based on search
  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    school.location.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  // Displayed list prefers zipResults when present
  const displayedSchools = zipResults.length > 0 ? zipResults : filteredSchools;

  const schoolKey = (s) => `${(s?.name||'').toString().toLowerCase().trim()}|${(s?.location||'').toString().toLowerCase().trim()}`;
  
  // Mock clubs data (replace with actual data from Firebase)
  const availableClubs = [
    { id: 1, name: 'Chess Club', category: 'Games', description: 'Strategic thinking and competitive play' },
    { id: 2, name: 'Robotics Club', category: 'Technology', description: 'Building robots and coding competitions' },
    { id: 3, name: 'Art Society', category: 'Arts', description: 'Expressing creativity through visual arts' },
    { id: 4, name: 'Drama Club', category: 'Arts', description: 'Theatrical performances and acting workshops' },
    { id: 5, name: 'Science Olympiad', category: 'Science', description: 'Competing in STEM excellence' },
    { id: 6, name: 'Debate Team', category: 'Academic', description: 'Sharpening minds through discourse' },
  ];
  
  const filteredClubs = availableClubs.filter(club =>
    club.name.toLowerCase().includes(clubSearch.toLowerCase())
  );
  
  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1 && !selectedSchool && !customSchool) {
      setError('Please select or enter your school');
      return;
    }
    if (currentStep === 2 && (!name || !email || !password || !agreedToTerms)) {
      setError('Please fill all required fields and agree to terms');
      return;
    }
    
    setError('');
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // Create account with extended user data
      await register(name, email, password, {
        school: selectedSchool?.name || customSchool,
        username,
        profilePic,
        language: selectedLanguage,
        role: selectedRole,
        clubs: selectedClubs,
        notifications
      });
      
      // Navigate to dashboard with welcome message
      navigate('/app', { state: { showWelcome: true } });
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
      setCurrentStep(2); // Go back to account creation step
    } finally {
      setLoading(false);
    }
  };
  
  const toggleClub = (clubId) => {
    setSelectedClubs(prev =>
      prev.includes(clubId)
        ? prev.filter(id => id !== clubId)
        : [...prev, clubId]
    );
  };
  
  const toggleNotification = (type) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };
  
  return (
    <div className="register-container">
      <div className="register-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏫</div>
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Join ClubConnect</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Connect with clubs and opportunities at your school
          </p>
        </div>
        
        {/* Progress Stepper */}
        <ProgressStepper currentStep={currentStep} totalSteps={totalSteps} steps={steps} />
        
        {/* Step Content */}
        <div style={{ minHeight: '400px' }}>
          
          {/* Step 1: School Selection */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '8px' }}>
                Which school do you attend?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                Select your school to see available clubs and events
              </p>
              
              <input
                type="text"
                placeholder="Search for your school..."
                value={schoolSearch}
                onChange={(e) => setSchoolSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  marginBottom: '16px'
                }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Enter ZIP or city"
                  value={zipQuery}
                  onChange={(e) => setZipQuery(e.target.value)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
                <button type="button" onClick={async () => {
                  setZipError('');
                  setZipResults([]);
                  if (!zipQuery.trim()) { setZipError('Enter ZIP or city'); return; }
                  setZipLoading(true);
                  try {
                    const geo = await geocodeZip(zipQuery.trim());
                    if (!geo) { setZipError('Location not found'); setZipLoading(false); return; }
                    const schoolsFound = await findSchoolsByBBox(geo.bbox) || [];

                    // Merge Overpass results with local `schools`, deduplicate by name+location
                    const mergedMap = new Map();
                    const normKey = (s) => `${(s.name||'').toLowerCase().trim()}|${(s.location||'').toLowerCase().trim()}`;

                    // Add remote results first
                    for (const s of schoolsFound) {
                      const key = normKey(s);
                      mergedMap.set(key, s);
                    }

                    // Add local schools if they don't already exist
                    for (const s of schools) {
                      const key = normKey(s);
                      if (!mergedMap.has(key)) mergedMap.set(key, s);
                    }

                    const mergedList = Array.from(mergedMap.values());
                    if (mergedList.length === 0) setZipError('No schools found for that area');
                    setZipResults(mergedList);
                  } catch (err) {
                    setZipError('Lookup failed — try again later');
                  } finally { setZipLoading(false); }
                }} style={{ padding: '10px 14px', borderRadius: '8px' }}>Find by ZIP</button>
              </div>
              {zipLoading && <div style={{ marginBottom: '12px' }}>Searching for schools…</div>}
              {zipError && <div style={{ color: 'var(--accent-red)', marginBottom: '12px' }}>{zipError}</div>}
              
              <div style={{ 
                maxHeight: '280px', 
                overflowY: 'auto',
                marginBottom: '16px',
                border: '1px solid var(--bg-secondary)',
                borderRadius: '8px'
              }}>
                {displayedSchools.map(school => (
                  <button
                    key={school.id}
                    type="button"
                    onClick={() => {
                      setSelectedSchool(school);
                      setSelectedSchoolKey(schoolKey(school));
                      // store preview so layout (sidebar) can reflect selection before account creation
                      try { localStorage.setItem('clubconnect_preview_school', school.name); } catch (e) {}
                      setShowCustomSchool(false);
                      setCustomSchool('');
                    }}
                      aria-pressed={selectedSchoolKey ? selectedSchoolKey === schoolKey(school) : false}
                      className={`school-option ${selectedSchoolKey && selectedSchoolKey === schoolKey(school) ? 'selected' : ''}`}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '16px',
                      border: 'none',
                      borderBottom: '1px solid var(--bg-secondary)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{ color: 'var(--text-primary)', fontWeight: '500', marginBottom: '4px' }}>
                      {school.name}
                    </div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                      {school.location}
                    </div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setShowCustomSchool(!showCustomSchool)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--soft-blue)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginBottom: '12px'
                }}
              >
                {showCustomSchool ? '← Back to list' : 'My school isn\'t listed'}
              </button>
              
              {showCustomSchool && (
                <input
                  type="text"
                  placeholder="Enter your school name..."
                  value={customSchool}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCustomSchool(v);
                    setSelectedSchool(null);
                    setSelectedSchoolKey(v ? `${v.toString().toLowerCase().trim()}|` : null);
                    try { localStorage.setItem('clubconnect_preview_school', v || ''); } catch (e) {}
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                />
              )}

              <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-tertiary)' }}>
                <strong>Selected:</strong> {selectedSchool?.name || customSchool || (selectedSchoolKey ? selectedSchoolKey.split('|')[0] : 'None')}
              </div>
            </div>
          )}
          
          {/* Step 2: Account Creation */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '8px' }}>
                Create your account
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                Set up your ClubConnect profile
              </p>
              
              {/* Profile Picture Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                  Choose your profile picture
                </label>                <p style={{ color: '#666666', fontSize: '12px', marginBottom: '12px', lineHeight: '1.5' }}>
                  Select an avatar that represents you. You can change this later in settings.
                </p>                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(8, 1fr)', 
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  {profilePics.map((pic) => (
                    <div
                      key={pic}
                      onClick={() => setProfilePic(pic)}
                      style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        cursor: 'pointer',
                        borderRadius: '50%',
                        border: `2px solid ${profilePic === pic ? 'var(--vibrant-green)' : 'var(--border-color)'}`,
                        backgroundColor: profilePic === pic ? 'rgba(126, 217, 87, 0.1)' : 'var(--bg-secondary)',
                        transition: 'all 0.2s',
                        transform: profilePic === pic ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      {pic}
                    </div>
                  ))}
                </div>
              </div>
              
              <input
                type="text"
                placeholder="Full name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-label="Full name"
                aria-required="true"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  marginBottom: '12px'
                }}
              />
              
              <input
                type="text"
                placeholder="Username (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  marginBottom: '12px'
                }}
              />
              
              <input
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  marginBottom: '12px'
                }}
              />
              
              <input
                type="password"
                placeholder="Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}
              />
              
              <label style={{ 
                display: 'flex', 
                alignItems: 'start', 
                gap: '12px',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  style={{ marginTop: '2px' }}
                />
                <span>
                  I agree to the Terms of Service and Privacy Policy *
                </span>
              </label>
            </div>
          )}
          
          {/* Step 3: Language Preference */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '8px' }}>
                Choose your language
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                Select your preferred language for the app
              </p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '12px' 
              }}>
                {languages.map(lang => (
                  <div
                    key={lang.code}
                    onClick={() => { setSelectedLanguage(lang.code); try { setLanguage(lang.code); } catch(e){} }}
                    style={{
                      padding: '16px',
                      backgroundColor: selectedLanguage === lang.code ? 'var(--bg-secondary)' : 'transparent',
                      border: `2px solid ${selectedLanguage === lang.code ? 'var(--soft-blue)' : 'var(--border-color)'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{lang.flag}</div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{lang.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 4: Role & Clubs */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '8px' }}>
                What's your role?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                This helps us customize your experience
              </p>
              
              <div style={{ marginBottom: '32px' }}>
                {userRoles.map(role => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    style={{
                      padding: '16px',
                      backgroundColor: selectedRole === role.id ? 'var(--bg-secondary)' : 'transparent',
                      border: `2px solid ${selectedRole === role.id ? 'var(--soft-blue)' : 'var(--border-color)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{ fontSize: '24px' }}>{role.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500', marginBottom: '2px' }}>
                        {role.name}
                      </div>
                      <div style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                        {role.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', marginBottom: '12px' }}>
                Which clubs are you part of?
              </h3>
              
              <input
                type="text"
                placeholder="Search clubs..."
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  marginBottom: '12px'
                }}
              />
              
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {filteredClubs.map(club => (
                  <label
                    key={club.id}
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: selectedClubs.includes(club.id) ? 'rgba(126, 217, 87, 0.1)' : 'transparent',
                      border: selectedClubs.includes(club.id) ? '1px solid rgba(126, 217, 87, 0.3)' : '1px solid transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedClubs.includes(club.id)}
                      onChange={() => toggleClub(club.id)}
                      style={{ marginTop: '4px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#333333', fontWeight: '600', marginBottom: '4px' }}>{club.name}</div>
                      <div style={{ color: '#666666', fontSize: '13px', marginBottom: '2px' }}>{club.description}</div>
                      <div style={{ color: '#999999', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{club.category}</div>
                    </div>
                  </label>
                ))}
              </div>
              
              <button
                onClick={() => setSelectedClubs([])}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Skip - I'll join clubs later
              </button>
            </div>
          )}
          
          {/* Step 5: Notification Preferences */}
          {currentStep === 5 && (
            <div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '8px' }}>
                Notification preferences
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                Choose what updates you want to receive
              </p>
              
              {notificationTypes.map(type => (
                <label
                  key={type.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: '500', marginBottom: '4px' }}>
                      {type.label}
                    </div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                      {type.description}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[type.id]}
                    onChange={() => toggleNotification(type.id)}
                    style={{ 
                      width: '20px', 
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                </label>
              ))}
            </div>
          )}
          
          {/* Step 6: Preview */}
          {currentStep === 6 && (
            <div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '8px' }}>
                You're all set! 🎉
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                Review your information and start exploring clubs
              </p>
              
              <div style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderRadius: '12px', 
                padding: '20px',
                marginBottom: '20px'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginBottom: '4px' }}>School</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {selectedSchool?.name || customSchool}
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginBottom: '4px' }}>Name</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{name}</div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginBottom: '4px' }}>Email</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{email}</div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginBottom: '4px' }}>Role</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {userRoles.find(r => r.id === selectedRole)?.name}
                  </div>
                </div>
                
                <div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginBottom: '4px' }}>Clubs Joined</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {selectedClubs.length > 0 
                      ? `${selectedClubs.length} clubs` 
                      : 'None yet - join clubs anytime!'}
                  </div>
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: 'rgba(126, 217, 87, 0.08)', 
                borderRadius: '8px', 
                padding: '16px',
                border: '1px solid rgba(126, 217, 87, 0.2)'
              }}>
                <h4 style={{ color: '#333333', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>
                  💡 Tips to get started
                </h4>
                <ul style={{ color: '#666666', fontSize: '13px', paddingLeft: '20px', margin: 0, lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '8px' }}>Explore clubs and join the ones that interest you</li>
                  <li style={{ marginBottom: '8px' }}>Check your calendar for upcoming events</li>
                  <li style={{ marginBottom: '8px' }}>Connect with club officers and members</li>
                  <li>Mark your attendance at events to earn badges</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div style={{ 
            padding: '12px 16px', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px', 
            color: '#DC2626',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginTop: '24px' 
        }}>
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '15px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              Back
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: 'var(--soft-blue)',
              border: '2px solid #1a73e8',
              borderRadius: '8px',
              color: '#1a1a1a',
              fontSize: '16px',
              fontWeight: '600',
              letterSpacing: '0.02em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(110,181,255,0.10)'
            }}
          >
            {loading ? 'Creating account...' : currentStep === totalSteps ? 'Complete Setup' : 'Next'}
          </button>
        </div>
        
        {/* Login Link */}
        {currentStep === 2 && (
          <p style={{ 
            marginTop: '20px', 
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '14px'
          }}>
            Already have an account?{' '}
            <Link to="/app/login" style={{ color: 'var(--soft-blue)', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;

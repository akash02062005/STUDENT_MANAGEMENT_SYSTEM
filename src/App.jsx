import React, { useState, useEffect } from 'react';
import './index.css';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import Login from './components/Login';
import Profile from './components/Profile';

const API_BASE_URL = 'http://localhost:8080/api/students';

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('elite-user')) || null);
  const [view, setView] = useState('hub');
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('elite-theme') || 'dark');

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [sRes, aRes] = await Promise.all([
        fetch(API_BASE_URL),
        fetch(`${API_BASE_URL}/analytics`)
      ]);
      setStudents(await sRes.json());
      setAnalytics(await aRes.json());
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
    document.body.className = theme === 'dark' ? '' : 'light-theme';
    localStorage.setItem('elite-theme', theme);
  }, [theme, user]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('elite-user', JSON.stringify(userData));
    setView('hub');
  };

  const handleLogout = () => {
    if (window.confirm('Securely logout from Elite Hub?')) {
      setUser(null);
      localStorage.removeItem('elite-user');
    }
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleSync = async () => {
    setLoading(true);
    await fetch(`${API_BASE_URL}/import-department-data`, { method: 'POST' });
    await fetchData();
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const topPerformers = [...students]
    .sort((a, b) => b.cgpa5 - a.cgpa5)
    .slice(0, 10);

  return (
    <div className="app-shell animate-in">
      {/* Desktop Sidebar */}
      <div className="sidebar">
        <div className="logo" style={{display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '3.5rem'}}>
          <div style={{width: 38, height: 38, background: 'var(--accent)', borderRadius: 12, boxShadow: '0 0 30px var(--accent-glow)'}}></div>
          <span style={{fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.05em'}}>ELITE HUB</span>
        </div>

        <nav>
          <div className={`nav-link ${view === 'hub' ? 'active' : ''}`} onClick={() => setView('hub')}>
             <span>📊</span> <span>Analytics Hub</span>
          </div>
          <div className={`nav-link ${view === 'records' ? 'active' : ''}`} onClick={() => setView('records')}>
             <span>📚</span> <span>Academic Matrix</span>
          </div>
          <div className={`nav-link ${view === 'top' ? 'active' : ''}`} onClick={() => setView('top')}>
             <span>🏆</span> <span>Hall of Fame</span>
          </div>
          <div className={`nav-link ${view === 'profile' ? 'active' : ''}`} onClick={() => setView('profile')}>
             <span>👤</span> <span>Profile Hub</span>
          </div>
        </nav>

        <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
           <div style={{padding: '1.2rem', background: 'var(--glass)', borderRadius: 20, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1.2rem'}}>
              <div style={{width: 36, height: 36, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem'}}>{user.username[0]?.toUpperCase()}</div>
              <div style={{overflow: 'hidden'}}>
                 <div style={{fontSize: '0.85rem', fontWeight: '800', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{user.username}</div>
                 <div style={{fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800'}}>{user.role}</div>
              </div>
              <button onClick={handleLogout} style={{marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}} title="Secure Logout">🚪</button>
           </div>
           
           <button className="theme-toggle" onClick={toggleTheme}>
              <span>{theme === 'dark' ? '☀️' : '🌙'}</span> <span>{theme === 'dark' ? 'Elite Light' : 'Elite Dark'}</span>
           </button>
           
           {user.role === 'ADMIN' && (
             <button className="btn-primary" style={{width: '100%', height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem'}} onClick={handleSync} disabled={loading}>
                {loading ? 'SYNCING...' : '🔄 SYNC MATRIX'}
             </button>
           )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="bottom-nav">
         <div className={`nav-link-mobile ${view === 'hub' ? 'active' : ''}`} onClick={() => setView('hub')}>
            <span>📊</span> <span>Hub</span>
         </div>
         <div className={`nav-link-mobile ${view === 'records' ? 'active' : ''}`} onClick={() => setView('records')}>
            <span>📚</span> <span>Matrix</span>
         </div>
         <div className={`nav-link-mobile ${view === 'profile' ? 'active' : ''}`} onClick={() => setView('profile')}>
            <span>👤</span> <span>Profile</span>
         </div>
         <div className="nav-link-mobile" onClick={handleLogout}>
            <span>🚪</span> <span>Exit</span>
         </div>
      </div>

      <main className="main-content">
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem'}}>
           <div>
              <h1 style={{fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.07em', lineHeight: '1.1'}}>
                {view === 'hub' ? 'Department Hub' : view === 'records' ? 'Academic Matrix' : view === 'profile' ? 'Profile Hub' : 'Elite Hall'}
              </h1>
              <p style={{color: 'var(--text-secondary)', fontWeight: '700', fontSize: '1.1rem', marginTop: '0.8rem'}}>
                CSE ACADEMIC INTELLIGENCE HUB • BATCH 2023-27
              </p>
           </div>
           {analytics && (
             <div style={{textAlign: 'right', minWidth: '200px'}}>
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '0.2em', marginBottom: '0.6rem'}}>MATRIX STATUS</div>
                <div style={{fontSize: '1.6rem', fontWeight: '900', color: 'var(--success)'}}>{analytics.placementEligible} ELITE READY</div>
             </div>
           )}
        </header>

        {view === 'hub' && <Dashboard students={students} analytics={analytics} />}
        {view === 'records' && (
          <div className="animate-in">
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', gap: '2rem', flexWrap: 'wrap'}}>
                <h3 style={{fontSize: '1.8rem', fontWeight: '800'}}>Faculty Records</h3>
                {user.role === 'ADMIN' && (
                  <button className="btn-primary" onClick={() => { setCurrentStudent(null); setShowForm(true); }}>
                    + ENROLL STUDENT
                  </button>
                )}
             </div>
             <StudentList 
               students={students} 
               onEdit={user.role === 'ADMIN' ? (s) => { setCurrentStudent(s); setShowForm(true); } : null}
               onDelete={() => fetchData()}
             />
          </div>
        )}
        {view === 'top' && (
          <StudentList 
            students={topPerformers} 
            onEdit={user.role === 'ADMIN' ? (s) => { setCurrentStudent(s); setShowForm(true); } : null}
            onDelete={() => fetchData()}
          />
        )}
        {view === 'profile' && (
          <Profile user={user} onUpdate={fetchData} />
        )}
      </main>

      {showForm && (
        <StudentForm 
          student={currentStudent} 
          onSave={async (data) => {
             const method = currentStudent ? 'PUT' : 'POST';
             const url = currentStudent ? `${API_BASE_URL}/${currentStudent.studentId}` : API_BASE_URL;
             await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
             setShowForm(false);
             fetchData();
          }} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default App;

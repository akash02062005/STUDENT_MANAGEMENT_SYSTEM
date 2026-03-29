import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const user = await res.json();
        onLogin(user);
      } else {
        const err = await res.json();
        setError(err.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection refused. Hub backend must be running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page animate-in">
      <div className="mesh-bg">
        <div className="blob" style={{left: '5%', top: '10%'}}></div>
        <div className="blob blob-2" style={{right: '5%', bottom: '10%'}}></div>
        <div className="blob blob-3" style={{left: '30%', bottom: '0%'}}></div>
      </div>

      <div className="login-card">
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
           <div style={{width: 48, height: 48, background: 'var(--accent)', borderRadius: 12, margin: '0 auto 1.5rem', boxShadow: '0 0 30px var(--accent-glow)'}}></div>
           <h1 style={{fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.06em'}}>Elite Academic Hub</h1>
           <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.5rem'}}>
             CSE DEPARTMENT • BATCH 2023-27
           </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. admin" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {error && (
            <div style={{padding: '1rem', background: 'hsla(0, 84%, 60%, 0.1)', border: '1px solid var(--danger)', borderRadius: 12, color: 'var(--danger)', fontSize: '0.8rem', fontWeight: '800', marginBottom: '2rem'}}>
              {error}
            </div>
          )}

          <button type="submit" className="portal-btn" disabled={loading}>
            {loading ? 'VERIFYING...' : 'ENTER ACADEMIC HUB'}
          </button>
        </form>

        <div style={{marginTop: '2.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600'}}>
          CSE Academic Matrix v5.0 Elite • Built for Excellence
        </div>
      </div>
    </div>
  );
};

export default Login;

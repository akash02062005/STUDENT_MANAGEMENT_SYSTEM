import React, { useState } from 'react';

const Profile = ({ user, onUpdate }) => {
  const [email, setEmail] = useState(user.email || '');
  const [department, setDepartment] = useState(user.department || 'CSE');
  const [age, setAge] = useState(user.age || 20);
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // In V6, all profile updates go to the unified /profile/{studentId} endpoint
    const studentId = user.studentId || user.username;
    const url = `http://localhost:8080/api/students/profile/${studentId}`;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, department, age, newPassword })
      });

      if (res.ok) {
        alert('Elite Profile & Security Matrix Updated Successfully');
        setNewPassword('');
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to update hub profile.');
      }
    } catch (e) {
      console.error('Update failed:', e);
      alert('Hub connection error.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card animate-in profile-grid" style={{background: 'var(--bg-surface)'}}>
      <div style={{textAlign: 'center', background: 'var(--glass)', padding: '5rem 3rem', borderRadius: 48, border: '2px solid var(--border)'}}>
         <div className="avatar-large" style={{margin: '0 auto 3rem'}}>{user.username[0]?.toUpperCase()}</div>
         <h2 style={{fontSize: '2.4rem', fontWeight: '800', letterSpacing: '-0.05em', color: 'var(--text-primary)'}}>{user.username}</h2>
         <p style={{color: 'var(--accent)', fontWeight: '800', marginTop: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.8rem'}}>{user.role} HUB ACCESS</p>
         
         <div style={{marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
            <div style={{padding: '1.5rem', background: 'var(--bg-deep)', borderRadius: 24, border: '1px solid var(--border)'}}>
               <div style={{fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '0.6rem', letterSpacing: '0.1em'}}>MATRIX IDENTITY</div>
               <div style={{fontWeight: '800', fontSize: '1.1rem'}}>{user.studentId || 'N/A'}</div>
            </div>
         </div>
      </div>

      <div style={{paddingTop: '1rem'}}>
         <h3 style={{fontSize: '2rem', fontWeight: '800', marginBottom: '4rem', letterSpacing: '-0.04em'}}>Elite Biographical Hub</h3>
         
         <form onSubmit={handleUpdate}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '2.5rem'}}>
               <div className="input-group">
                  <label className="input-label">Elite Email</label>
                  <input 
                     type="email" 
                     className="input-field" 
                     value={email} 
                     onChange={(e) => setEmail(e.target.value)} 
                     placeholder="manager@elite.edu"
                  />
               </div>
               <div className="input-group">
                  <label className="input-label">Department Hub</label>
                  <input 
                     type="text" 
                     className="input-field" 
                     value={department} 
                     onChange={(e) => setDepartment(e.target.value)}
                  />
               </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '4rem'}}>
               <div className="input-group">
                  <label className="input-label">Academic Age</label>
                  <input 
                     type="number" 
                     className="input-field" 
                     value={age} 
                     onChange={(e) => setAge(e.target.value)}
                  />
               </div>
               <div className="input-group">
                  <label className="input-label">Update Matrix Password</label>
                  <input 
                     type="password" 
                     className="input-field" 
                     value={newPassword} 
                     onChange={(e) => setNewPassword(e.target.value)}
                     placeholder="Leave blank to keep current"
                  />
               </div>
            </div>

            <div style={{marginTop: 'auto', padding: '2.5rem', background: 'var(--accent-glow)', borderRadius: 32, border: '1px solid hsla(217, 91%, 60%, 0.1)', marginBottom: '4rem'}}>
               <h4 style={{fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '900', marginBottom: '1rem', textTransform: 'uppercase'}}>Security Integration</h4>
               <p style={{fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7'}}>
                 Synchronizing this biographical matrix will update your identity records across all Departmental Analytics services. Administrative users are verified through the Auth Hub, while students are linked via Registration Numbers.
               </p>
            </div>

            <button type="submit" className="portal-btn" style={{width: 'auto', padding: '1.3rem 4rem', fontSize: '1.1rem'}} disabled={saving}>
               {saving ? 'SYNCHRONIZING HUB...' : 'COMMIT PROFILE CHANGES'}
            </button>
         </form>
      </div>
    </div>
  );
};

export default Profile;

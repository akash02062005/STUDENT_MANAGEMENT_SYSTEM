import React, { useState, useEffect } from 'react';

const StudentForm = ({ student, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    gpa: '',
    age: ''
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      gpa: parseFloat(formData.gpa),
      age: parseInt(formData.age)
    });
  };

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  };

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem', marginBottom: '1.2rem',
    background: 'var(--bg-darker)', border: '1px solid var(--border)',
    borderRadius: '0.6rem', color: 'var(--text-primary)',
    outline: 'none', transition: 'border-color 0.2s'
  };

  return (
    <div style={overlayStyle} className="animate-in">
      <div className="card" style={{width: '90%', maxWidth: '500px', padding: '2.5rem'}}>
        <h2 style={{marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '800'}}>{student ? 'Edit Student Record' : 'Enroll New Student'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="stat-label" style={{marginBottom: '0.5rem'}}>ID & Personal Details</div>
          <input 
            style={inputStyle} placeholder="Student ID (e.g. S101)" 
            value={formData.studentId} disabled={!!student}
            onChange={(e) => setFormData({...formData, studentId: e.target.value})}
            required 
          />
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <input 
              style={inputStyle} placeholder="First Name" 
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required 
            />
            <input 
              style={inputStyle} placeholder="Last Name" 
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required 
            />
          </div>
          <input 
            style={inputStyle} placeholder="Email Address" type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
          
          <div className="stat-label" style={{marginBottom: '0.5rem', marginTop: '0.5rem'}}>Academic Information</div>
          <input 
            style={inputStyle} placeholder="Department (e.g. Computer Science)" 
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            required 
          />
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <input 
              style={inputStyle} placeholder="Target GPA (0.0 - 4.0)" type="number" step="0.1" max="4" min="0"
              value={formData.gpa}
              onChange={(e) => setFormData({...formData, gpa: e.target.value})}
              required 
            />
            <input 
              style={inputStyle} placeholder="Current Age" type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              required 
            />
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {student ? 'Confirm Update' : 'Initialize Enrollment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;

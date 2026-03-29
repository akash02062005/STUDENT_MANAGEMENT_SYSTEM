import React, { useState } from 'react';

const StudentList = ({ students, onEdit, onDelete }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (students.length === 0) return (
    <div className="card animate-in" style={{textAlign: 'center', padding: '5rem'}}>
      <h2 style={{fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.2rem'}}>Academic Matrix Synchronization Required</h2>
      <p style={{color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto'}}>
        Click the <strong>SYNC DATA</strong> button in the sidebar to initialize the 2023-27 batch records and perform V3 Elite analytics.
      </p>
    </div>
  );

  return (
    <div className="matrix-container animate-in">
      <table>
        <thead>
          <tr>
            <th style={{width: 150}}>REG NO.</th>
            <th>STUDENT NAME</th>
            <th style={{textAlign: 'center'}}>S3 CGPA</th>
            <th style={{textAlign: 'center'}}>S5 PROJECTED</th>
            <th style={{textAlign: 'center'}}>HUB STATUS</th>
            <th style={{textAlign: 'right'}}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <React.Fragment key={s.studentId}>
              <tr 
                onClick={() => setExpandedId(expandedId === s.studentId ? null : s.studentId)} 
                style={{cursor: 'pointer', borderLeft: s.isAtRisk ? '4px solid var(--danger)' : s.cgpa5 >= 8.5 ? '4px solid var(--success)' : 'none'}}
              >
                <td style={{fontWeight: '800', color: 'var(--accent)'}}>{s.studentId}</td>
                <td style={{fontWeight: '700', fontSize: '1rem'}}>
                  {s.firstName} {s.lastName}
                  <div style={{fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em'}}>CSE Department • Batch 2023-27</div>
                </td>
                <td style={{textAlign: 'center'}}>
                  <span className="gpa-tag">{s.cgpa3?.toFixed(2)}</span> <span className="out-of">out of 10</span>
                </td>
                <td style={{textAlign: 'center'}}>
                  <span className="gpa-tag" style={{color: 'var(--success)'}}>{s.cgpa5?.toFixed(2)}</span> <span className="out-of">out of 10</span>
                </td>
                <td style={{textAlign: 'center'}}>
                  {s.isAtRisk ? (
                    <span className="badge badge-risk">AT-RISK</span>
                  ) : s.cgpa5 >= 8.0 ? (
                    <span className="badge badge-ready">PLACEMENT READY</span>
                  ) : (
                    <span className="badge" style={{background: 'var(--bg-deep)', color: 'var(--text-secondary)'}}>STABLE</span>
                  )}
                </td>
                <td style={{textAlign: 'right'}}>
                  <button className="btn btn-outline" style={{padding: '0.4rem 0.8rem', marginRight: '0.5rem'}} onClick={(e) => { e.stopPropagation(); onEdit(s); }}>⚙️</button>
                  <button className="btn btn-outline" style={{padding: '0.4rem 0.8rem', color: 'var(--danger)'}} onClick={(e) => { e.stopPropagation(); onDelete(s.studentId); }}>🗑️</button>
                </td>
              </tr>
              {expandedId === s.studentId && (
                <tr className="animate-in">
                  <td colSpan="6" style={{padding: 0}}>
                    <div className="deep-dive-grid">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num} className="sem-box" style={{border: num > 3 ? '1px dashed var(--accent)' : '1px solid var(--border)'}}>
                          <div style={{fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '0.5rem'}}>SEMESTER {num} {num > 3 ? '(PROJ)' : ''}</div>
                          <div style={{marginBottom: '0.8rem'}}>
                            <div style={{fontSize: '0.6rem', color: 'var(--accent)', fontWeight: '800'}}>GPA</div>
                            <div style={{fontWeight: '800', fontSize: '1.2rem'}}>{s[`gpa${num}`]?.toFixed(2)} <span style={{fontSize: '0.7rem', fontWeight: '400', color: 'var(--text-muted)'}}>out of 10</span></div>
                          </div>
                          <div>
                            <div style={{fontSize: '0.6rem', color: 'var(--success)', fontWeight: '800'}}>CGPA</div>
                            <div style={{fontWeight: '800', fontSize: '1.2rem'}}>{s[`cgpa${num}`]?.toFixed(2)} <span style={{fontSize: '0.7rem', fontWeight: '400', color: 'var(--text-muted)'}}>out of 10</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{padding: '1.5rem 2rem', background: 'var(--glass)', display: 'flex', gap: '4rem', alignItems: 'center'}}>
                       <div>
                          <div className="stat-label" style={{fontSize: '0.6rem'}}>Department Attendance</div>
                          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                             <div style={{height: 8, width: 200, background: 'var(--bg-deep)', borderRadius: 4, overflow: 'hidden'}}>
                                <div style={{height: '100%', width: `${s.attendance}%`, background: s.attendance < 75 ? 'var(--danger)' : 'var(--success)'}}></div>
                             </div>
                             <span style={{fontWeight: '800', fontSize: '1.1rem'}}>{s.attendance}%</span>
                          </div>
                       </div>
                       <div>
                          <div className="stat-label" style={{fontSize: '0.6rem'}}>Active Backlogs</div>
                          <div style={{fontSize: '1.1rem', fontWeight: '800', color: s.backlogs > 0 ? 'var(--danger)' : 'var(--text-primary)'}}>
                            {s.backlogs > 0 ? `${s.backlogs} BACKLOGS FOUND` : 'CLEAN RECORD'}
                          </div>
                       </div>
                       <div>
                          <div className="stat-label" style={{fontSize: '0.6rem'}}>Placement Index</div>
                          <div style={{fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent)'}}>{s.placementScore?.toFixed(0)} / 100</div>
                       </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;

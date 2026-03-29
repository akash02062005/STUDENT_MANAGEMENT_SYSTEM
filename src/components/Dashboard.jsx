import React from 'react';

const Dashboard = ({ students, analytics }) => {
  if (!analytics) return <div className="card animate-in" style={{textAlign: 'center', fontWeight: '800'}}>Syncing Department Intelligence...</div>;

  const { trajectoryAvg, gradeSpread, placementEligible } = analytics;
  const total = students.length;

  const AreaChart = ({ data }) => {
    if (!data) return null;
    const max = 10, min = 0;
    const padding = 60;
    const width = 800, height = 350;
    
    const points = data.map((val, i) => ({
      x: padding + (i * (width - 2 * padding) / (data.length - 1)),
      y: height - padding - ((Math.min(10.0, val) - min) * (height - 2 * padding) / (max - min))
    }));

    const getBezierPath = (pts) => {
      let d = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const cp1x = (pts[i].x + pts[i+1].x) * 0.5;
        d += ` C ${cp1x},${pts[i].y} ${cp1x},${pts[i+1].y} ${pts[i+1].x},${pts[i+1].y}`;
      }
      return d;
    };

    const pathD = getBezierPath(points);

    return (
      <div className="chart-container" style={{width: '100%', overflow: 'hidden'}}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          preserveAspectRatio="xMidYMid meet" 
          width="100%" 
          style={{maxWidth: '100%', height: 'auto', display: 'block'}}
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {[0, 2, 4, 6, 8, 10].map(v => {
            const y = height - padding - (v * (height - 2 * padding) / 10);
            return (
              <g key={v}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--border)" strokeWidth="2" strokeDasharray="8" />
                <text x={padding - 20} y={y + 6} textAnchor="end" fill="var(--text-primary)" fontSize="14" fontWeight="800">{v}</text>
              </g>
            );
          })}

          <path d={`${pathD} V ${height - padding} H ${points[0].x} Z`} fill="url(#areaGrad)" />
          <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="10" fill="var(--bg-deep)" stroke="var(--accent)" strokeWidth="5" />
              <text x={p.x} y={p.y - 30} textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="900">{data[i].toFixed(2)}</text>
              <text x={p.x} y={height - 20} textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="800">S{i + 1}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="animate-in">
      {/* Responsive Stat Cards Hub */}
      <div className="stat-grid">
        <div className="stat-card" style={{borderLeft: '8px solid var(--accent)'}}>
          <div className="stat-label" style={{fontSize: '0.85rem', letterSpacing: '0.15em'}}>TOTAL STRENGTH</div>
          <div className="stat-value" style={{fontSize: '3.5rem', fontWeight: '900'}}>{total}</div>
        </div>
        <div className="stat-card" style={{borderLeft: '8px solid var(--success)'}}>
          <div className="stat-label" style={{fontSize: '0.85rem', letterSpacing: '0.15em'}}>PLACEMENT ELITE</div>
          <div className="stat-value" style={{color: 'var(--success)', fontSize: '3.5rem', fontWeight: '900'}}>{placementEligible}</div>
        </div>
        <div className="stat-card" style={{borderLeft: '8px solid #f59e0b'}}>
          <div className="stat-label" style={{fontSize: '0.85rem', letterSpacing: '0.15em'}}>HUB DISTINCTION</div>
          <div className="stat-value" style={{color: '#f59e0b', fontSize: '3.5rem', fontWeight: '900'}}>{gradeSpread['Elite (9.0+)']}</div>
        </div>
      </div>

      {/* Grid Matrix Analysis */}
      <div className="dashboard-grid">
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3.5rem', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
             <h3 style={{fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.04em'}}>Department Trajectory</h3>
             <div style={{padding: '0.8rem 1.5rem', background: 'var(--accent-glow)', borderRadius: 16, fontSize: '0.8rem', fontWeight: '900', color: 'var(--accent)', border: '1px solid var(--accent)'}}>
               S1-S5 MATRIX INDEX
             </div>
          </div>
          <AreaChart data={trajectoryAvg} />
          <p style={{fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '4rem', textAlign: 'center', lineHeight: '1.8', maxWidth: '750px', margin: '3rem auto 0'}}>
            Real-time visual trajectory of the 2023-27 batch performance metrics scaled strictly to the 10.0 academic index.
          </p>
        </div>

        <div className="card">
          <h3 style={{fontSize: '2rem', fontWeight: '800', marginBottom: '4rem', letterSpacing: '-0.04em'}}>Batch Spread Analysis</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '2.5rem'}}>
             {Object.entries(gradeSpread).sort(([,a],[,b]) => b-a).map(([label, count]) => (
                <div key={label}>
                   <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap'}}>
                      <span style={{fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)'}}>{label}</span>
                      <span style={{fontSize: '1.2rem', fontWeight: '900'}}>{count} Intelligence Records</span>
                   </div>
                   <div style={{height: 18, background: 'var(--bg-deep)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)'}}>
                      <div style={{
                         height: '100%', 
                         width: `${total > 0 ? (count / total) * 100 : 0}%`, 
                         background: label.includes('Elite') ? '#f59e0b' : 'var(--accent)',
                         transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                         boxShadow: '0 0 25px var(--accent-glow)'
                      }}></div>
                   </div>
                </div>
             ))}
          </div>
          <div style={{marginTop: '5rem', padding: '3.5rem 2.5rem', background: 'var(--accent-glow)', borderRadius: 36, border: '2px solid var(--accent)'}}>
             <h4 style={{fontSize: '1rem', color: 'var(--accent)', fontWeight: '900', marginBottom: '1.2rem', textTransform: 'uppercase'}}>MOBILE HUB INSIGHT</h4>
             <p style={{fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: '1.8', fontWeight: '500'}}>
               Adaptive analysis identifies <span style={{color: 'var(--success)', fontWeight: '900'}}>{placementEligible} Elite Candidates</span> who have maintained optimal matrix performance for the 2023-27 session.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

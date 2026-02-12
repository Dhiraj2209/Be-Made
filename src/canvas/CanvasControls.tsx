import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { configuratorStore } from '../store/configuratorStore';
import { TOP_COLORS } from '../data/topColors';

// SVG Icon Components
const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const MaximizeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const CanvasControls = observer(() => {
  const [showInfo, setShowInfo] = useState(false);
  
  const currentColor = TOP_COLORS.find(c => c.id === configuratorStore.topColorId) || TOP_COLORS[0];

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div className="canvas-ui-container" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', padding: '20px', zIndex: 10 }}>
      
      {/* Top Right: Utility Buttons */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px', pointerEvents: 'auto' }}>
        <button className="ui-btn"><SaveIcon /></button>
        <button className="ui-btn"><ShareIcon /></button>
        <button className="ui-btn" onClick={handleFullScreen}><MaximizeIcon /></button>
      </div>

      {/* Bottom Left: Info Section */}
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px', pointerEvents: 'auto' }}>
        {showInfo && (
          <div className="info-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{currentColor.title}</h3>
              <button onClick={() => setShowInfo(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                <CloseIcon />
              </button>
            </div>
            <span className="badge">{currentColor.type}</span>
            <p className="description-text">{currentColor.description}</p>
          </div>
        )}
        
        <button className="ui-btn" onClick={() => setShowInfo(!showInfo)}>
          <InfoIcon />
        </button>
      </div>

      <style>{`
        .ui-btn {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: all 0.2s;
        }
        .ui-btn:hover { background: #fff; transform: translateY(-1px); }
        
        .info-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(5px);
          padding: 24px;
          border-radius: 16px;
          width: 320px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          animation: slideIn 0.3s ease-out;
        }
        
        .badge {
          display: inline-block;
          background: #f0f0f0;
          color: #666;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          margin: 10px 0;
        }
        
        .description-text {
          color: #555;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
});

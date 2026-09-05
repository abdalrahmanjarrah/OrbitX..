import { Suspense } from 'react';
import { IntroExperience } from '../components/intro/IntroExperience';

export interface IntroViewProps {
  onLogin?: () => void;
  onGuest?: () => void;
  inviterName?: string;
}

function LoadingScreen() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#04040a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00d4ff',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1 }}>OrbitX</div>
      <div style={{ fontSize: 11, color: '#16002d', letterSpacing: 4, marginTop: 8 }}>
        INITIALIZING SECTOR...
      </div>
      <div
        style={{
          marginTop: 24,
          width: 120,
          height: 2,
          background: '#090b1f',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '60%',
            height: '100%',
            background: '#00d4ff',
            animation: 'loading-bar 1.5s ease-in-out infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(260%); }
        }
      `}</style>
    </div>
  );
}

export default function IntroView({ onLogin, onGuest, inviterName }: IntroViewProps) {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#04040a' }}>
      <Suspense fallback={<LoadingScreen />}>
        <IntroExperience onLogin={onLogin} onGuest={onGuest} inviterName={inviterName} />
      </Suspense>
    </div>
  );
}

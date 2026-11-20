import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { PublicLanding } from './pages/PublicLanding';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ResearcherDashboard } from './pages/dashboards/ResearcherDashboard';
import { ReviewerDashboard } from './pages/dashboards/ReviewerDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { getFeatureTheme } from './utils/theme';

function AppContent() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [currentTab, setCurrentTab] = useState('Home');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center text-xs text-gray-400 font-mono">
        Initializing ProofTrail AI Engine...
      </div>
    );
  }

  // Public Landing Page if user is not authenticated
  if (!user) {
    return (
      <>
        <PublicLanding
          onOpenLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
          onOpenSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />

        {showLogin && (
          <Login
            onSuccess={() => setShowLogin(false)}
            onSwitchToSignup={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
          />
        )}

        {showSignup && (
          <Signup
            onSuccess={() => setShowSignup(false)}
            onSwitchToLogin={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
          />
        )}
      </>
    );
  }

  const handleNavigateTab = (tab: string, sessionId?: string) => {
    setCurrentTab(tab);
  };

  const featureTheme = getFeatureTheme(currentTab);

  return (
    <div className={`flex min-h-screen ${featureTheme.bgGradient} text-gray-100 transition-colors duration-300 relative`}>
      {/* Optional Feature Background Overlay Pattern */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${featureTheme.bgImageUrl})` }}
      />

      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header currentTab={currentTab} />

        <main className="flex-1 p-8 overflow-y-auto">
          {/* Role-Based Router */}
          {user.role === 'RESEARCHER' && (
            <ResearcherDashboard currentSubTab={currentTab} onNavigateTab={handleNavigateTab} />
          )}

          {user.role === 'REVIEWER' && (
            <ReviewerDashboard currentSubTab={currentTab} />
          )}

          {user.role === 'ADMIN' && (
            <AdminDashboard currentSubTab={currentTab} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';
import { Workspace } from './pages/Workspace';
import { EvidenceExplorer } from './pages/EvidenceExplorer';
import { FinalReport } from './pages/FinalReport';
import { ResearchHistory } from './pages/ResearchHistory';
import { Settings } from './pages/Settings';

export default function App() {
  const [currentTab, setCurrentTab] = useState('Home');
  const [activeQuestion, setActiveQuestion] = useState<string | undefined>(undefined);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);

  const handleStartResearch = (question: string) => {
    setActiveQuestion(question);
    setCurrentTab('Workspace');
  };

  const handleNavigateTab = (tab: string, sessionId?: string) => {
    if (sessionId) {
      setActiveSessionId(sessionId);
    }
    setCurrentTab(tab);
  };

  return (
    <div className="flex min-h-screen bg-[#090D16] text-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header currentTab={currentTab} />

        <main className="flex-1 p-8 overflow-y-auto">
          {currentTab === 'Home' && <Home onStartResearch={handleStartResearch} />}
          {currentTab === 'Workspace' && (
            <Workspace
              initialQuestion={activeQuestion}
              onNavigateTab={handleNavigateTab}
            />
          )}
          {currentTab === 'Evidence Explorer' && (
            <EvidenceExplorer sessionId={activeSessionId} />
          )}
          {currentTab === 'Final Report' && (
            <FinalReport sessionId={activeSessionId} />
          )}
          {currentTab === 'Research History' && (
            <ResearchHistory onSelectSession={handleNavigateTab} />
          )}
          {currentTab === 'Settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Home } from '../Home';
import { Workspace } from '../Workspace';
import { WebsiteImporter } from '../WebsiteImporter';
import { DocumentLibrary } from '../DocumentLibrary';
import { EvidenceExplorer } from '../EvidenceExplorer';
import { EvidenceMap } from '../EvidenceMap';
import { FinalReport } from '../FinalReport';
import { DecisionBriefs } from '../DecisionBriefs';
import { ResearchHistory } from '../ResearchHistory';
import { Settings } from '../Settings';

interface ResearcherDashboardProps {
  currentSubTab: string;
  onNavigateTab: (tab: string, sessionId?: string) => void;
}

export const ResearcherDashboard: React.FC<ResearcherDashboardProps> = ({ currentSubTab, onNavigateTab }) => {
  const [activeQuestion, setActiveQuestion] = useState<string | undefined>(undefined);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);

  const handleStartResearch = (q: string) => {
    setActiveQuestion(q);
    onNavigateTab('Workspace');
  };

  const handleSelectSession = (tab: string, sid?: string) => {
    if (sid) setActiveSessionId(sid);
    onNavigateTab(tab, sid);
  };

  return (
    <>
      {currentSubTab === 'Home' && <Home onStartResearch={handleStartResearch} />}
      {currentSubTab === 'Workspace' && (
        <Workspace initialQuestion={activeQuestion} onNavigateTab={handleSelectSession} />
      )}
      {currentSubTab === 'Website Importer' && <WebsiteImporter sessionId={activeSessionId} />}
      {currentSubTab === 'Document Library' && <DocumentLibrary sessionId={activeSessionId} />}
      {currentSubTab === 'Evidence Explorer' && <EvidenceExplorer sessionId={activeSessionId} />}
      {currentSubTab === 'Evidence Map' && <EvidenceMap sessionId={activeSessionId} />}
      {currentSubTab === 'Final Report' && <FinalReport sessionId={activeSessionId} />}
      {currentSubTab === 'Decision Briefs' && <DecisionBriefs sessionId={activeSessionId} />}
      {currentSubTab === 'Research History' && <ResearchHistory onSelectSession={handleSelectSession} />}
      {currentSubTab === 'Settings' && <Settings />}
    </>
  );
};

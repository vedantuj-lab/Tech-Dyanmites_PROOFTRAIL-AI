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
import { ClaimVerificationView } from '../subviews/ClaimVerificationView';
import { ConflictDetectionView } from '../subviews/ConflictDetectionView';
import { SourceQualityView } from '../subviews/SourceQualityView';
import { ResearchCollectionsView } from '../subviews/ResearchCollectionsView';
import { SourceWatchlistView } from '../subviews/SourceWatchlistView';
import { NotificationsView } from '../subviews/NotificationsView';

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
      {(currentSubTab === 'Home' || currentSubTab === 'Overview' || currentSubTab === 'New Research') && (
        <Home onStartResearch={handleStartResearch} />
      )}
      {currentSubTab === 'Workspace' && (
        <Workspace initialQuestion={activeQuestion} onNavigateTab={handleSelectSession} />
      )}
      {currentSubTab === 'Website Importer' && <WebsiteImporter sessionId={activeSessionId} />}
      {currentSubTab === 'Document Library' && <DocumentLibrary sessionId={activeSessionId} />}
      {currentSubTab === 'Evidence Explorer' && <EvidenceExplorer sessionId={activeSessionId} />}
      {currentSubTab === 'Evidence Map' && <EvidenceMap sessionId={activeSessionId} />}
      {currentSubTab === 'Claim Verification' && <ClaimVerificationView sessionId={activeSessionId} />}
      {currentSubTab === 'Conflict Detection' && <ConflictDetectionView sessionId={activeSessionId} />}
      {currentSubTab === 'Source Quality' && <SourceQualityView sessionId={activeSessionId} />}
      {currentSubTab === 'Decision Intelligence' && <DecisionBriefs sessionId={activeSessionId} />}
      {(currentSubTab === 'Final Report' || currentSubTab === 'My Reports') && (
        <FinalReport sessionId={activeSessionId} />
      )}
      {currentSubTab === 'Research Collections' && <ResearchCollectionsView />}
      {currentSubTab === 'Source Watchlist' && <SourceWatchlistView />}
      {currentSubTab === 'Research History' && <ResearchHistory onSelectSession={handleSelectSession} />}
      {currentSubTab === 'Notifications' && <NotificationsView />}
      {currentSubTab === 'Settings' && <Settings />}
    </>
  );
};

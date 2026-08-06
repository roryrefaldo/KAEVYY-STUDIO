import React, { useState } from 'react';
import { PRDHeader, ViewMode, RoleLens } from './PRDHeader';
import { PRDNavigation } from './PRDNavigation';
import { PRDSectionView } from './PRDSectionView';
import { ERDVisualizer } from './ERDVisualizer';
import { ApiBlueprintViewer } from './ApiBlueprintViewer';
import { WorkflowSimulator } from './WorkflowSimulator';
import { ExportModal } from './ExportModal';
import { allPRDSections, databaseEntities, apiEndpoints } from '../../data/prdData';

export const PRDSpecSuite: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('reader');
  const [roleLens, setRoleLens] = useState<RoleLens>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Filter sections by search query or role lens
  const filteredSections = allPRDSections.filter(sec => {
    const matchesSearch = !searchQuery || 
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.contentMarkdown.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sec.tags && sec.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (roleLens === 'CLIENT') {
      return sec.tags?.includes('Client') || sec.category === 'experiences' || sec.category === 'order_system';
    }
    if (roleLens === 'DEVELOPER') {
      return sec.tags?.includes('Developer') || sec.category === 'experiences' || sec.category === 'order_system' || sec.category === 'share_asset';
    }
    if (roleLens === 'ADMIN') {
      return sec.tags?.includes('Admin') || sec.category === 'security_tech' || sec.category === 'quality_ops';
    }

    return true;
  });

  const activeSection = allPRDSections.find(s => s.id === activeSectionId) || allPRDSections[0];

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col min-h-screen">
      
      <PRDHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        roleLens={roleLens}
        setRoleLens={setRoleLens}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        totalSectionsCount={allPRDSections.length}
      />

      <div className="flex-1 max-w-[1700px] w-full mx-auto flex flex-col md:flex-row">
        
        {viewMode === 'reader' && (
          <>
            <PRDNavigation
              sections={filteredSections}
              activeSectionId={activeSectionId}
              onSelectSection={(id) => setActiveSectionId(id)}
              searchQuery={searchQuery}
            />

            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
              <PRDSectionView
                section={activeSection}
                totalSections={allPRDSections.length}
                onPrevSection={() => setActiveSectionId(prev => Math.max(1, prev - 1))}
                onNextSection={() => setActiveSectionId(prev => Math.min(allPRDSections.length, prev + 1))}
              />
            </main>
          </>
        )}

        {viewMode === 'erd' && (
          <main className="flex-1 p-6 lg:p-10">
            <ERDVisualizer entities={databaseEntities} />
          </main>
        )}

        {viewMode === 'api' && (
          <main className="flex-1 p-6 lg:p-10">
            <ApiBlueprintViewer endpoints={apiEndpoints} />
          </main>
        )}

        {viewMode === 'workflow' && (
          <main className="flex-1 p-6 lg:p-10">
            <WorkflowSimulator />
          </main>
        )}

      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        sections={allPRDSections}
      />

    </div>
  );
};

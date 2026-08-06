import React from 'react';
import { PRDSection, SectionCategory } from '../../types/prd';
import { 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  Users, 
  Briefcase, 
  ShoppingBag, 
  Layers, 
  ShieldCheck, 
  Database, 
  GitBranch, 
  Sliders, 
  AlertTriangle 
} from 'lucide-react';

interface PRDNavigationProps {
  sections: PRDSection[];
  activeSectionId: number;
  onSelectSection: (id: number) => void;
  searchQuery: string;
}

const CATEGORY_MAP: Record<SectionCategory, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  overview: { label: 'Platform Overview & Vision', icon: BookOpen },
  roles: { label: 'User Roles & Authentication', icon: Users },
  business: { label: 'Business Model & Escrow', icon: Briefcase },
  features: { label: 'Core Product Features', icon: ShoppingBag },
  experiences: { label: 'Role Experiences & Portals', icon: Layers },
  order_system: { label: 'Order System & Capacity Queue', icon: GitBranch },
  share_asset: { label: 'SHARE ASSET Hub & Library', icon: Layers },
  security_tech: { label: 'Platform Security & Anti-Malware', icon: ShieldCheck },
  database_api: { label: 'Database Architecture & API Spec', icon: Database },
  architecture_flows: { label: 'System Architecture & User Flows', icon: GitBranch },
  quality_ops: { label: 'Quality Control, Audit & Analytics', icon: Sliders },
  roadmap_risks: { label: 'Roadmap, Risks & Architecture Summary', icon: AlertTriangle }
};

export const PRDNavigation: React.FC<PRDNavigationProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
  searchQuery
}) => {
  // Group sections by category
  const grouped = sections.reduce((acc, sec) => {
    if (!acc[sec.category]) {
      acc[sec.category] = [];
    }
    acc[sec.category].push(sec);
    return acc;
  }, {} as Record<SectionCategory, PRDSection[]>);

  const categories = Object.keys(grouped) as SectionCategory[];

  return (
    <nav className="w-full lg:w-80 bg-slate-900 border-r border-slate-800/80 flex flex-col h-[calc(100vh-80px)] sticky top-20 overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Table of Contents ({sections.length})
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
          65/65 Complete
        </span>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {categories.map((catKey) => {
          const catInfo = CATEGORY_MAP[catKey] || { label: catKey, icon: BookOpen };
          const Icon = catInfo.icon;
          const catSections = grouped[catKey];

          return (
            <div key={catKey} className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{catInfo.label}</span>
                <span className="ml-auto text-[10px] text-slate-500 font-normal">
                  ({catSections.length})
                </span>
              </div>

              <div className="space-y-0.5 pl-2 border-l border-slate-800">
                {catSections.map((sec) => {
                  const isActive = sec.id === activeSectionId;
                  const isSearchMatch = searchQuery
                    ? sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      sec.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      sec.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
                    : false;

                  return (
                    <button
                      key={sec.id}
                      onClick={() => onSelectSection(sec.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-cyan-950 text-cyan-300 ring-1 ring-cyan-700/60 font-semibold shadow-sm'
                          : isSearchMatch
                          ? 'bg-amber-950/40 text-amber-300 hover:bg-slate-800/60'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="truncate pr-2">{sec.title}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {isActive ? (
                          <ChevronRight className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 text-slate-600 group-hover:text-cyan-500/80 transition-colors" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

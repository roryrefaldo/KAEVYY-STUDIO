import React from 'react';
import { 
  FileText, 
  Database, 
  Code, 
  GitCommit, 
  Download, 
  Search, 
  ShieldCheck, 
  User, 
  Code2, 
  ShieldAlert 
} from 'lucide-react';

export type ViewMode = 'reader' | 'erd' | 'api' | 'workflow' | 'summary';
export type RoleLens = 'ALL' | 'CLIENT' | 'DEVELOPER' | 'ADMIN';

interface PRDHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  roleLens: RoleLens;
  setRoleLens: (role: RoleLens) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenExportModal: () => void;
  totalSectionsCount: number;
}

export const PRDHeader: React.FC<PRDHeaderProps> = ({
  viewMode,
  setViewMode,
  roleLens,
  setRoleLens,
  searchQuery,
  setSearchQuery,
  onOpenExportModal,
  totalSectionsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  KAEVY STUDIO
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-cyan-950 text-cyan-400 ring-1 ring-cyan-800">
                    v1.1.1 PRD & Architecture Spec
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Roblox Development Platform • Managed Escrow • Developer Queue • 30-Day Warranty • Share Asset Hub
              </p>
            </div>
          </div>

          {/* Navigation View Modes */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setViewMode('reader')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'reader'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              PRD Reader ({totalSectionsCount})
            </button>

            <button
              onClick={() => setViewMode('erd')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'erd'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              ERD Schema
            </button>

            <button
              onClick={() => setViewMode('api')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'api'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              API Blueprint
            </button>

            <button
              onClick={() => setViewMode('workflow')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'workflow'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              Flow Simulator
            </button>

            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/50 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export Full PRD (.md)
            </button>
          </div>

        </div>

        {/* Sub-bar: Search & Role Filter */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 65 PRD sections, escrow rules, security specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Role Filter Lens */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Role Lens:</span>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-medium">
              <button
                onClick={() => setRoleLens('ALL')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  roleLens === 'ALL' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => setRoleLens('CLIENT')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  roleLens === 'CLIENT' ? 'bg-blue-900/80 text-blue-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3 h-3" /> Client
              </button>
              <button
                onClick={() => setRoleLens('DEVELOPER')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  roleLens === 'DEVELOPER' ? 'bg-emerald-900/80 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3 h-3" /> Developer
              </button>
              <button
                onClick={() => setRoleLens('ADMIN')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  roleLens === 'ADMIN' ? 'bg-purple-900/80 text-purple-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3 h-3" /> Admin
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

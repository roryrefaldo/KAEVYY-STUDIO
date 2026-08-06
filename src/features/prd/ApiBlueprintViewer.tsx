import React, { useState } from 'react';
import { ApiEndpoint } from '../../types/prd';
import { Code, ShieldCheck, Lock, Globe, Search, Copy, Check } from 'lucide-react';

interface ApiBlueprintViewerProps {
  endpoints: ApiEndpoint[];
}

export const ApiBlueprintViewer: React.FC<ApiBlueprintViewerProps> = ({ endpoints }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(endpoints[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredEndpoints = endpoints.filter(
    ep => ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ep.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ep.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyJson = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'POST': return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'PUT': return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'DELETE': return 'bg-rose-950 text-rose-400 border-rose-800';
      default: return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6 bg-slate-950 text-slate-200">
      
      {/* Header Info */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">RESTful API Architecture Blueprint</h2>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800">
            JSON Envelope Standard
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Strict REST API contracts with HttpOnly JWT token authorization, Zod request body validation, and role-based middleware guards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3 h-[600px] flex flex-col">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search API endpoints or HTTP methods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar">
            {filteredEndpoints.map((ep, idx) => {
              const isSelected = ep.path === selectedEndpoint.path && ep.method === selectedEndpoint.method;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-950 border-cyan-700/80 text-cyan-300 font-bold shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border ${getMethodBadge(ep.method)}`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-slate-200 text-xs font-semibold truncate">
                      {ep.path}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal line-clamp-1">
                    {ep.summary}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Inspector */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
          {selectedEndpoint ? (
            <>
              <div className="space-y-2 pb-4 border-b border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-black border ${getMethodBadge(selectedEndpoint.method)}`}>
                    {selectedEndpoint.method}
                  </span>
                  <span className="text-base font-mono font-bold text-white">
                    {selectedEndpoint.path}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{selectedEndpoint.summary}</p>

                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400">Access Role Required:</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono font-bold">
                    {selectedEndpoint.roleRequired}
                  </span>
                </div>
              </div>

              {/* Endpoint Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {selectedEndpoint.description}
                </p>
              </div>

              {/* Request Payload */}
              {selectedEndpoint.requestBodyExample && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">JSON Request Payload Schema</h4>
                    <button
                      onClick={() => handleCopyJson(selectedEndpoint.requestBodyExample!)}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy JSON
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                    {selectedEndpoint.requestBodyExample}
                  </pre>
                </div>
              )}

              {/* Response Payload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">JSON Response Payload Standard</h4>
                  <button
                    onClick={() => handleCopyJson(selectedEndpoint.responseExample)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy Response
                  </button>
                </div>
                <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                  {selectedEndpoint.responseExample}
                </pre>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">Select an API endpoint from the list</div>
          )}
        </div>

      </div>

    </div>
  );
};

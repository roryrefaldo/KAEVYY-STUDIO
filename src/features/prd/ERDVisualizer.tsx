import React, { useState } from 'react';
import { DatabaseEntity } from '../../types/prd';
import { Database, Table, Key, Link, Search, ArrowRight } from 'lucide-react';

interface ERDVisualizerProps {
  entities: DatabaseEntity[];
}

export const ERDVisualizer: React.FC<ERDVisualizerProps> = ({ entities }) => {
  const [selectedTableName, setSelectedTableName] = useState<string>(entities[0]?.tableName || '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntities = entities.filter(
    e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         e.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         e.fields.some(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedEntity = entities.find(e => e.tableName === selectedTableName) || entities[0];

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6 bg-slate-950 text-slate-200">
      
      {/* Header Info */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Relational Database Schema (28 Normalized Entities)</h2>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800">
            PostgreSQL 16 Engine
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Normalized data architecture supporting Escrow Vault ledgers, Developer Queue capacity tracking, 30-Day Bug Warranty tickets, and Share Asset document/file archives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Entity Table List */}
        <div className="lg:col-span-4 bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3 h-[600px] flex flex-col">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search database entities or fields..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {filteredEntities.map((ent) => {
              const isSelected = ent.tableName === selectedTableName;
              return (
                <button
                  key={ent.tableName}
                  onClick={() => setSelectedTableName(ent.tableName)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-950 border-cyan-700/80 text-cyan-300 font-bold shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Table className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{ent.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {ent.tableName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Entity Inspector */}
        <div className="lg:col-span-8 bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
          {selectedEntity ? (
            <>
              <div className="space-y-1 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedEntity.name}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                    table: {selectedEntity.tableName}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{selectedEntity.description}</p>
              </div>

              {/* Fields Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  Table Columns ({selectedEntity.fields.length})
                </h4>

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-[11px] font-bold text-slate-400 border-b border-slate-800">
                        <th className="p-2.5">Field Name</th>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Attributes</th>
                        <th className="p-2.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
                      {selectedEntity.fields.map((f, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="p-2.5 font-bold text-slate-200">
                            {f.name}
                          </td>
                          <td className="p-2.5 text-cyan-300">
                            {f.type}
                          </td>
                          <td className="p-2.5 text-[10px]">
                            <div className="flex items-center gap-1">
                              {f.isPrimary && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                                  PK
                                </span>
                              )}
                              {f.isForeign && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                                  FK ({f.references})
                                </span>
                              )}
                              {!f.nullable ? (
                                <span className="text-emerald-400">NOT NULL</span>
                              ) : (
                                <span className="text-slate-500">NULLABLE</span>
                              )}
                            </div>
                          </td>
                          <td className="p-2.5 font-sans text-slate-400 text-xs">
                            {f.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Relationships */}
              {selectedEntity.relationships && selectedEntity.relationships.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Link className="w-3.5 h-3.5 text-cyan-400" />
                    Foreign Key Relational Mapping
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedEntity.relationships.map((rel, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between font-mono font-bold text-cyan-300">
                          <span>{selectedEntity.name}</span>
                          <span className="text-amber-400 font-sans text-[10px] px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800">
                            {rel.type}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span>{rel.targetEntity}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans">{rel.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">Select an entity from the left list</div>
          )}
        </div>

      </div>

    </div>
  );
};

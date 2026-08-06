import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, CreditCard, Lock, UserCheck, Flag, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

interface TimelineNode {
  id: number;
  title: string;
  subtitle: string;
  icon: any;
  description: string;
  badge: string;
  color: string;
  border: string;
  bg: string;
}

const nodes: TimelineNode[] = [
  {
    id: 1,
    title: 'Brief',
    subtitle: '1. Project Scope',
    icon: FileText,
    description: 'Client defines project requirements, map specifications, asset references, and budget in the structured order wizard.',
    badge: 'Requirements',
    color: 'text-cyan-400',
    border: 'border-cyan-800',
    bg: 'bg-cyan-950/80'
  },
  {
    id: 2,
    title: 'Payment',
    subtitle: '2. Payment Selection',
    icon: CreditCard,
    description: 'Client chooses from Indonesia-first methods (QRIS, Bank Virtual Account, E-Wallet) or international PayPal.',
    badge: 'Checkout',
    color: 'text-purple-400',
    border: 'border-purple-800',
    bg: 'bg-purple-950/80'
  },
  {
    id: 3,
    title: 'Protection',
    subtitle: '3. Escrow Vault Lock',
    icon: Lock,
    description: '100% of order payment is safely deposited into KAEVY Escrow Vault. Funds are protected and unreleased until signoff.',
    badge: 'Escrow Vault',
    color: 'text-blue-400',
    border: 'border-blue-800',
    bg: 'bg-blue-950/80'
  },
  {
    id: 4,
    title: 'Developer',
    subtitle: '4. Talent Assignment',
    icon: UserCheck,
    description: 'A verified Roblox developer with open queue capacity claims the project and initiates Luau / Studio setup.',
    badge: 'Verified Developer',
    color: 'text-emerald-400',
    border: 'border-emerald-800',
    bg: 'bg-emerald-950/80'
  },
  {
    id: 5,
    title: 'Checkpoints',
    subtitle: '5. Milestone Updates',
    icon: Flag,
    description: 'Developer submits proof at 25%, 50%, 75%, and 100% stages (video clips, test place links, script previews).',
    badge: '25% - 100% Milestones',
    color: 'text-teal-400',
    border: 'border-teal-800',
    bg: 'bg-teal-950/80'
  },
  {
    id: 6,
    title: 'Delivery',
    subtitle: '6. Review & Signoff',
    icon: CheckCircle2,
    description: 'Client reviews final .RBXL place file and approves delivery to trigger escrow vault release.',
    badge: 'Final Deliverables',
    color: 'text-amber-400',
    border: 'border-amber-800',
    bg: 'bg-amber-950/80'
  },
  {
    id: 7,
    title: 'Warranty',
    subtitle: '7. 30-Day Guarantee',
    icon: ShieldCheck,
    description: '30-day post-delivery bug warranty activates automatically to cover scope-related defects at no cost.',
    badge: '30-Day Bug Warranty',
    color: 'text-emerald-400',
    border: 'border-emerald-800',
    bg: 'bg-emerald-950/80'
  }
];

export const RadialOrbitalTimeline: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<number>(1);
  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  return (
    <section className="px-4 lg:px-12 max-w-[1500px] mx-auto w-full space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Lock className="w-4 h-4" /> End-to-End Execution Flow
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          How KAEVY Escrow & Development Workflow Operates
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Select any workflow stage below to inspect the step-by-step protection rules and milestone requirements.
        </p>
      </div>

      {/* Desktop Orbital Interactive Radial Layout */}
      <div className="hidden lg:grid grid-cols-12 gap-8 items-center py-6">
        
        {/* Left Interactive Node Ring / List */}
        <div className="col-span-5 space-y-2">
          {nodes.map((node) => {
            const Icon = node.icon;
            const isActive = node.id === activeNodeId;
            return (
              <button
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                  isActive
                    ? `${node.bg} ${node.border} shadow-xl ring-1 ring-cyan-500/50`
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl border ${isActive ? `${node.bg} ${node.color} ${node.border}` : 'bg-slate-950 text-slate-400 border-slate-800'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{node.subtitle}</span>
                    <h4 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{node.title}</h4>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Active Node Detail Display Card */}
        <div className="col-span-7">
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${activeNode.bg} ${activeNode.color} border ${activeNode.border}`}>
                  {React.createElement(activeNode.icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{activeNode.subtitle}</span>
                  <h3 className="text-2xl font-black text-white">{activeNode.title} Stage</h3>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${activeNode.bg} ${activeNode.color} ${activeNode.border}`}>
                {activeNode.badge}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {activeNode.description}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>STAGE VERIFICATION:</span>
                <span className="text-emerald-400 font-bold">AUTOMATED AUDIT PASS</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ESCROW STATE:</span>
                <span className="text-cyan-400 font-bold">VAULT LOCKED & PROTECTED</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Mobile Vertical Linear Timeline Fallback */}
      <div className="grid lg:hidden grid-cols-1 gap-4">
        {nodes.map((node) => {
          const Icon = node.icon;
          return (
            <div key={node.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${node.bg} ${node.color} border ${node.border}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{node.subtitle}</span>
                    <h4 className="text-sm font-bold text-white">{node.title}</h4>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${node.bg} ${node.color} ${node.border}`}>
                  {node.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{node.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

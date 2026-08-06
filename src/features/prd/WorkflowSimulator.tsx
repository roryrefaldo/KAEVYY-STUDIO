import React, { useState } from 'react';
import { orderWorkflowSteps, assetWorkflowSteps } from '../../data/prdData';
import { GitCommit, ShieldCheck, CheckCircle2, User, Code2, ShieldAlert, ArrowRight, Play, RefreshCw, Sparkles } from 'lucide-react';

export const WorkflowSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'order' | 'asset'>('order');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const steps = activeTab === 'order' ? orderWorkflowSteps : assetWorkflowSteps;
  const currentStep = steps[activeStepIndex] || steps[0];

  const handleNextStep = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setActiveStepIndex(0);
  };

  const getActorBadge = (actor: string) => {
    switch (actor) {
      case 'CLIENT': return { bg: 'bg-blue-950 text-blue-300 border-blue-800', icon: User };
      case 'DEVELOPER': return { bg: 'bg-emerald-950 text-emerald-300 border-emerald-800', icon: Code2 };
      case 'ADMIN': return { bg: 'bg-purple-950 text-purple-300 border-purple-800', icon: ShieldAlert };
      default: return { bg: 'bg-cyan-950 text-cyan-300 border-cyan-800', icon: ShieldCheck };
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6 bg-slate-950 text-slate-200">
      
      {/* Header Info & Tab Switcher */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Interactive Platform Flow Simulator</h2>
          </div>
          <p className="text-xs text-slate-400">
            Step-by-step visual execution simulator for Escrow Order Lifecycle and Share Asset Verification/Moderation Pipeline.
          </p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('order'); setActiveStepIndex(0); }}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'order'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Order Escrow & Queue Lifecycle
          </button>
          <button
            onClick={() => { setActiveTab('asset'); setActiveStepIndex(0); }}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'asset'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Share Asset Upload & Moderation
          </button>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
        
        {/* Stepper Dots */}
        <div className="flex items-center justify-between overflow-x-auto pb-4 custom-scrollbar">
          {steps.map((st, idx) => {
            const isCompleted = idx < activeStepIndex;
            const isCurrent = idx === activeStepIndex;

            return (
              <React.Fragment key={st.stepNumber}>
                <button
                  onClick={() => setActiveStepIndex(idx)}
                  className="flex flex-col items-center gap-2 min-w-[100px] text-center group cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 shadow-lg shadow-cyan-500/50 scale-110'
                        : isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                        : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : st.stepNumber}
                  </div>
                  <span
                    className={`text-[11px] font-medium max-w-[110px] leading-tight ${
                      isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {st.title}
                  </span>
                </button>

                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 min-w-[20px] ${idx < activeStepIndex ? 'bg-emerald-600' : 'bg-slate-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Inspector Card */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 text-cyan-400 pointer-events-none">
            <Sparkles className="w-32 h-32" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-cyan-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-800">
                Step {currentStep.stepNumber} / {steps.length}
              </span>
              <h3 className="text-lg font-bold text-white">{currentStep.title}</h3>
            </div>

            {/* Actor Badge */}
            {(() => {
              const actorInfo = getActorBadge(currentStep.actor);
              const ActorIcon = actorInfo.icon;
              return (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${actorInfo.bg}`}>
                  <ActorIcon className="w-3.5 h-3.5" />
                  <span>Actor: {currentStep.actor}</span>
                </div>
              );
            })()}
          </div>

          {/* Action details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User / Role Action</span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">{currentStep.action}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">System State Transition</span>
              <p className="text-xs text-cyan-300 font-mono leading-relaxed">{currentStep.systemStateChange}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Escrow / Asset Impact</span>
              <p className="text-xs text-amber-300 leading-relaxed">{currentStep.escrowOrAssetImpact}</p>
            </div>
          </div>

          {/* Simulator Navigation Controls */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Flow
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevStep}
                disabled={activeStepIndex === 0}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 disabled:opacity-40 transition-colors"
              >
                Previous Step
              </button>

              <button
                onClick={handleNextStep}
                disabled={activeStepIndex === steps.length - 1}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30 disabled:opacity-40 transition-colors"
              >
                Advance Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

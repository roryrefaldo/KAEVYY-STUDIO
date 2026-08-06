import React, { useState } from 'react';
import { PRDSection } from '../../types/prd';
import { 
  Check, 
  Copy, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Sparkles, 
  Shield, 
  UserCheck, 
  Briefcase 
} from 'lucide-react';

interface PRDSectionViewProps {
  section: PRDSection;
  totalSections: number;
  onPrevSection: () => void;
  onNextSection: () => void;
}

export const PRDSectionView: React.FC<PRDSectionViewProps> = ({
  section,
  totalSections,
  onPrevSection,
  onNextSection
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(section.contentMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto space-y-8 bg-slate-950 text-slate-200">
      
      {/* Top Banner & Control */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-400 font-mono text-xs font-bold border border-cyan-800/80">
            Section {section.id} / {totalSections}
          </span>
          <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
            {section.category.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied MD!' : 'Copy Section MD'}
          </button>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={onPrevSection}
              disabled={section.id === 1}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Previous Section"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-500 px-1">
              {section.id}
            </span>
            <button
              onClick={onNextSection}
              disabled={section.id === totalSections}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Next Section"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Title & Summary */}
      <div className="space-y-3 pb-6 border-b border-slate-800/80">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {section.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          {section.summary}
        </p>

        {/* Tags */}
        {section.tags && section.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            {section.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 text-cyan-300 border border-slate-800 font-mono"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Key Takeaways Callout Box */}
      {section.keyTakeaways && section.keyTakeaways.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-800/50 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Key Blueprint Takeaways</span>
          </div>
          <ul className="space-y-1.5 pl-5 list-disc text-xs sm:text-sm text-slate-200">
            {section.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="leading-relaxed">
                {takeaway}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Markdown Body */}
      <div className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-cyan-400 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-table:border-collapse prose-th:bg-slate-900 prose-th:text-slate-200 prose-td:border-slate-800 text-sm leading-relaxed space-y-4">
        {renderMarkdownSimple(section.contentMarkdown)}
      </div>

      {/* Bottom Pagination */}
      <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={onPrevSection}
          disabled={section.id === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 disabled:opacity-40 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Section
        </button>

        <span className="text-xs font-mono text-slate-500">
          Section {section.id} of {totalSections}
        </span>

        <button
          onClick={onNextSection}
          disabled={section.id === totalSections}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30 disabled:opacity-40 transition-colors"
        >
          Next Section
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </article>
  );
};

// Helper renderer for structured markdown
function renderMarkdownSimple(mdText: string) {
  const lines = mdText.split('\n');
  return (
    <div className="space-y-3 font-sans">
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-xl font-bold text-cyan-300 pt-3 pb-1 border-b border-slate-800">{line.replace('# ', '')}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-lg font-bold text-white pt-2">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-base font-semibold text-slate-200 pt-1">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('```')) {
          return <div key={idx} className="font-mono text-xs text-cyan-300 bg-slate-900 p-2.5 rounded border border-slate-800 my-1">{line.replace(/```/g, '')}</div>;
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 pl-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>{line.replace(/^[-*]\s+/, '')}</span>
            </div>
          );
        }
        if (line.startsWith('|')) {
          return <div key={idx} className="font-mono text-xs text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800 overflow-x-auto">{line}</div>;
        }
        if (line.trim() === '') {
          return <div key={idx} className="h-1" />;
        }
        return <p key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed">{line}</p>;
      })}
    </div>
  );
}

import React, { useState } from 'react';
import { PRDSection } from '../../types/prd';
import { Download, Copy, Check, X, FileText, Sparkles } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: PRDSection[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, sections }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate complete PRD markdown document containing all 65 sections
  const fullMarkdownContent = `# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## KAEVY STUDIO - Roblox Development & Digital Service Platform Specification
*Generated on July 30, 2026 | Version 1.1.1 Final Product Requirements Document*

---

${sections.map(sec => sec.contentMarkdown).join('\n\n---\n\n')}

---
*End of KAEVY STUDIO Product Requirements Document (PRD).*
`;

  const handleDownload = () => {
    const blob = new Blob([fullMarkdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'KAEVY_STUDIO_PRODUCT_REQUIREMENTS_DOCUMENT.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMarkdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Export Full PRD Specification (v1.1.1)</h3>
            <p className="text-xs text-slate-400">Download the complete production-ready Markdown specification document.</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-bold text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>Document Highlights:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Includes all **65 detailed PRD sections** covering Client, Developer, and Admin roles.</li>
            <li>Contains 10% Platform Fee & Escrow Vault financial specifications.</li>
            <li>Contains Developer Queue capacity limits (Verified = 3, Elite = 5 max active projects simultaneously).</li>
            <li>Contains 30-Day Bug Warranty coverage & dispute arbitration rules.</li>
            <li>Contains complete **SHARE ASSET** library, documentation upload, and moderation specs.</li>
            <li>Contains 28 Database Entities, REST API Blueprint, OWASP security rules, and tech stack recommendations.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Complete PRD (.md)
          </button>

          <button
            onClick={handleCopy}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Raw PRD Text'}
          </button>
        </div>

      </div>
    </div>
  );
};

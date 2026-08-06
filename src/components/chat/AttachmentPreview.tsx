import React from 'react';
import { FileCode, FileArchive, Image as ImageIcon, Box, ExternalLink, Download } from 'lucide-react';
import { AttachmentItem } from '../../server/socket/socketEvents';

interface AttachmentPreviewProps {
  attachments: AttachmentItem[];
  onDownload?: (attachment: AttachmentItem) => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachments, onDownload }) => {
  if (!attachments || attachments.length === 0) return null;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType?.toUpperCase()) {
      case 'IMAGE':
        return <ImageIcon className="w-5 h-5 text-emerald-400" />;
      case 'RBXL':
        return <Box className="w-5 h-5 text-red-400" />;
      case 'ZIP':
        return <FileArchive className="w-5 h-5 text-amber-400" />;
      case 'LUA':
        return <FileCode className="w-5 h-5 text-blue-400" />;
      case 'DOC':
        return <ExternalLink className="w-5 h-5 text-purple-400" />;
      default:
        return <FileCode className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getTypeLabel = (fileType: string) => {
    switch (fileType?.toUpperCase()) {
      case 'RBXL':
        return 'Roblox Place (.rbxl)';
      case 'ZIP':
        return 'ZIP Archive (.zip)';
      case 'LUA':
        return 'Luau Script (.lua)';
      case 'IMAGE':
        return 'Gambar';
      case 'DOC':
        return 'Tautan Dokumen';
      default:
        return 'Berkas Proyek';
    }
  };

  return (
    <div className="flex flex-col gap-2 my-2">
      {attachments.map((att) => {
        const isImage = att.fileType?.toUpperCase() === 'IMAGE' || att.mimeType?.startsWith('image/');

        if (isImage) {
          return (
            <div key={att.id} className="group relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/80 max-w-sm">
              <img
                src={att.downloadUrl}
                alt={att.fileName}
                className="max-h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end justify-between">
                <span className="text-xs font-medium text-zinc-200 truncate">{att.fileName}</span>
                <a
                  href={att.downloadUrl}
                  download={att.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onDownload && onDownload(att)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                  title="Unduh Gambar"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        }

        return (
          <div
            key={att.id}
            className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all max-w-md gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-zinc-800/80 shrink-0">
                {getFileIcon(att.fileType)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-zinc-100 truncate">{att.fileName}</span>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                  <span className="font-mono text-indigo-400">{getTypeLabel(att.fileType)}</span>
                  {att.fileSizeBytes && <span>• {formatFileSize(att.fileSizeBytes)}</span>}
                </div>
              </div>
            </div>

            <a
              href={att.downloadUrl}
              download={att.fileName}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onDownload && onDownload(att)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </a>
          </div>
        );
      })}
    </div>
  );
};

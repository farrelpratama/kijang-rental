"use client";

interface DocumentPreviewModalProps {
  url: string | null;
  onClose: () => void;
}

export default function DocumentPreviewModal({
  url,
  onClose,
}: DocumentPreviewModalProps) {
  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-fade-in">
      <div className="relative max-w-3xl w-full max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <span className="font-bold text-sm text-[#031636]">Pratinjau Dokumen</span>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-[#031636] font-bold text-lg"
          >
            ✕
          </button>
        </div>
        <div className="p-6 flex-1 flex items-center justify-center bg-slate-900/5 overflow-y-auto">
          <img 
            src={url} 
            alt="Document preview" 
            className="max-w-full max-h-[60vh] object-contain rounded-xl shadow border border-slate-200"
          />
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-white bg-[#031636] hover:bg-[#05204f] rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

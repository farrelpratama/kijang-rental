"use client";

interface Document {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: "ktp" | "sim";
  fileUrl: string;
  status: "Pending" | "Verified" | "Rejected";
  createdAt: string;
}

interface DocumentVerificationCardProps {
  doc: Document;
  updatingId: string | null;
  onVerify: (id: string, status: "Verified" | "Rejected") => Promise<void>;
  onPreview: (url: string) => void;
}

export default function DocumentVerificationCard({
  doc,
  updatingId,
  onVerify,
  onPreview,
}: DocumentVerificationCardProps) {
  return (
    <div
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition"
    >
      <div className="flex items-start gap-4">
        {/* Document preview miniature */}
        <div 
          onClick={() => onPreview(doc.fileUrl)}
          className="h-16 w-24 bg-slate-100 rounded-xl overflow-hidden cursor-pointer border border-slate-200 flex items-center justify-center relative group"
        >
          <img 
            src={doc.fileUrl} 
            alt={doc.type} 
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-[10px] text-white font-bold">Zoom</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded tracking-wide">
              {doc.type.toUpperCase()}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              doc.status === "Verified" 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-150" 
                : doc.status === "Pending" 
                ? "bg-amber-50 text-amber-700 border border-amber-150 animate-pulse" 
                : "bg-rose-50 text-rose-700 border border-rose-150"
            }`}>
              {doc.status}
            </span>
          </div>
          <p className="font-bold text-[#031636] text-sm">{doc.userName}</p>
          <p className="text-xs text-slate-400">
            {doc.userEmail} • Diunggah pada {new Date(doc.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
        <button
          onClick={() => onPreview(doc.fileUrl)}
          className="px-3.5 py-2 text-xs font-bold text-[#031636] bg-slate-50 border border-slate-150 hover:bg-slate-100 rounded-xl transition"
        >
          Lihat Dokumen
        </button>

        {doc.status === "Pending" && (
          <>
            <button
              disabled={updatingId === doc.id}
              onClick={() => onVerify(doc.id, "Rejected")}
              className="px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-600 hover:text-white rounded-xl transition"
            >
              Tolak
            </button>
            <button
              disabled={updatingId === doc.id}
              onClick={() => onVerify(doc.id, "Verified")}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#031636] hover:bg-[#05204f] rounded-xl transition shadow"
            >
              Verifikasi
            </button>
          </>
        )}
      </div>
    </div>
  );
}

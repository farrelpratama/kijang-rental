"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";
import DocumentVerificationCard from "@/src/components/admin/document-verification-card";
import CustomersTable from "@/src/components/admin/customers-table";
import DocumentPreviewModal from "@/src/components/admin/document-preview-modal";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

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

export default function AdminCustomersPage() {
  const [activeTab, setActiveTab] = useState<"documents" | "customers">("documents");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Image preview modal
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // 1. Fetch all customers
      const { data: dbCustomers, error: custError } = await supabase
        .from("users")
        .select("id, name, email, phone, created_at")
        .eq("role", "customer")
        .order("name", { ascending: true });

      if (custError) throw custError;
      if (dbCustomers) {
        setCustomers(
          dbCustomers.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            createdAt: c.created_at,
          }))
        );
      }

      // 2. Fetch all documents with user profile info
      const { data: dbDocs, error: docError } = await supabase
        .from("documents")
        .select(`
          id,
          user_id,
          type,
          file_url,
          status,
          created_at,
          user:users (
            name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (docError) throw docError;
      if (dbDocs) {
        setDocuments(
          dbDocs.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            userName: d.user?.name || "Pelanggan",
            userEmail: d.user?.email || "",
            type: d.type,
            fileUrl: d.file_url,
            status: d.status,
            createdAt: d.created_at,
          }))
        );
      }

    } catch (err) {
      console.error("Error fetching customers/documents data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyDocument = async (docId: string, status: "Verified" | "Rejected") => {
    try {
      setUpdatingId(docId);
      const supabase = createClient();
      const { error } = await supabase
        .from("documents")
        .update({ status })
        .eq("id", docId);

      if (error) throw error;

      setDocuments(
        documents.map((d) => (d.id === docId ? { ...d, status } : d))
      );
    } catch (err: any) {
      console.error("Error updating document status:", err);
      alert("Gagal memperbarui status dokumen: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#031636]">Pelanggan & Dokumen</h1>
        <p className="text-slate-500 mt-1">
          Daftar akun pelanggan dan verifikasi kelayakan dokumen persyaratan (KTP/SIM).
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("documents")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all duration-200 ${
            activeTab === "documents"
              ? "border-[#FEA619] text-[#FEA619]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Verifikasi Dokumen ({documents.filter((d) => d.status === "Pending").length} Baru)
        </button>
        <button
          onClick={() => setActiveTab("customers")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all duration-200 ${
            activeTab === "customers"
              ? "border-[#FEA619] text-[#FEA619]"
              : "border-transparent text-slate-400 hover:text-slate-655"
          }`}
        >
          Daftar Akun Pelanggan ({customers.length})
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl"></div>
          ))}
        </div>
      ) : activeTab === "documents" ? (
        // Documents tab
        <div className="space-y-4">
          {documents.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 font-medium">
              Belum ada dokumen yang diunggah oleh pelanggan.
            </div>
          ) : (
            documents.map((doc) => (
              <DocumentVerificationCard
                key={doc.id}
                doc={doc}
                updatingId={updatingId}
                onVerify={handleVerifyDocument}
                onPreview={setPreviewUrl}
              />
            ))
          )}
        </div>
      ) : (
        // Customers accounts list tab
        <CustomersTable customers={customers} />
      )}

      {/* Image Preview Modal */}
      <DocumentPreviewModal
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </div>
  );
}

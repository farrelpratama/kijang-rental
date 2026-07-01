"use client";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

interface CustomersTableProps {
  customers: Customer[];
}

export default function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
              <th className="py-4 px-6">Nama Lengkap</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Nomor Telepon</th>
              <th className="py-4 px-6">Tanggal Bergabung</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                  Belum ada pelanggan terdaftar.
                </td>
              </tr>
            ) : (
              customers.map((cust) => (
                <tr key={cust.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-bold text-[#031636] text-sm">
                    {cust.name}
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-sm">
                    {cust.email}
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-sm">
                    {cust.phone || "-"}
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-xs">
                    {new Date(cust.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

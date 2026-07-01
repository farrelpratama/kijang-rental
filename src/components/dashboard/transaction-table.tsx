"use client";

interface Transaction {
  id: string;
  date: string;
  time: string;
  bookingRef: string;
  carModel: string;
  amount: number;
  status: string;
  statusBg: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  formatIDR: (num: number) => string;
}

export default function TransactionTable({
  transactions,
  formatIDR,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-150 bg-white p-8 text-center text-slate-500">
        Belum ada riwayat transaksi pembayaran.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-150 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-500">
          <thead className="bg-slate-50 text-xs font-bold uppercase text-[#031636] tracking-wider border-b border-slate-100">
            <tr>
              <th scope="col" className="px-6 py-4">Kode Ref</th>
              <th scope="col" className="px-6 py-4">Tanggal</th>
              <th scope="col" className="px-6 py-4">Kendaraan</th>
              <th scope="col" className="px-6 py-4">Jumlah</th>
              <th scope="col" className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-mono font-bold text-[#031636]">
                  #{transaction.bookingRef}
                </td>
                <td className="px-6 py-4">
                  <div>{transaction.date}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{transaction.time}</div>
                </td>
                <td className="px-6 py-4 font-medium text-[#031636]">
                  {transaction.carModel}
                </td>
                <td className="px-6 py-4 font-bold text-[#031636]">
                  {formatIDR(transaction.amount)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${transaction.statusBg}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { Pencil, Trash2, Eye } from "lucide-react";
import type { Invoice } from "../../types/invoice";

interface Props {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onView: (invoice: Invoice) => void;
}

function InvoiceTable({
  invoices,
  onEdit,
  onDelete,
  onView
}: Props) {
  const getStatusClass = (
    status: Invoice["payment_status"]
  ) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "partial":
        return "bg-blue-100 text-blue-700";

      case "unpaid":
        return "bg-yellow-100 text-yellow-700";

      case "overdue":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr className="text-left text-xs uppercase tracking-wider text-slate-600">
            <th className="px-6 py-4">Invoice</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Trip</th>
            <th className="px-6 py-4">Invoice Date</th>
            <th className="px-6 py-4">Due Date</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="border-t hover:bg-slate-50 transition"
            >
              <td className="px-6 py-4 font-medium">
                {invoice.invoice_number}
              </td>

              <td className="px-6 py-4">
                {invoice.customers?.customer_name ?? "—"}
              </td>

              <td className="px-6 py-4">
                {invoice.trips
                  ? `${invoice.trips.pickup_location} → ${invoice.trips.delivery_location}`
                  : "—"}
              </td>

              <td className="px-6 py-4">
                {formatDate(invoice.invoice_date)}
              </td>

              <td className="px-6 py-4">
                {formatDate(invoice.due_date)}
              </td>

              <td className="px-6 py-4 font-medium">
                {formatAmount(invoice.total_amount)}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                    invoice.payment_status
                  )}`}
                >
                  {invoice.payment_status}
                </span>
              </td>

              

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">

                  <button
                    onClick={() => onView(invoice)}
                    className="text-slate-600 hover:text-slate-900"
                    title="View invoice"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => onEdit(invoice)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit invoice"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(invoice)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete invoice"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;
import { Plus } from "lucide-react";

interface Props {
  onAddInvoice: () => void;
}

function InvoiceHeader({ onAddInvoice }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="text-gray-500 mt-1">
          Manage all company invoices
        </p>
      </div>

      <button
        onClick={onAddInvoice}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Invoice
        </button>

    </div>
  );
}

export default InvoiceHeader;
import { useEffect, useState } from "react";
import { getInvoices, deleteInvoice } from "../../services/invoiceService";
import type { Invoice } from "../../types/invoice";

import InvoiceHeader from "../../components/invoices/InvoiceHeader";
import InvoiceSearch from "../../components/invoices/InvoiceSearch";
import InvoiceTable from "../../components/invoices/InvoiceTable";
import AddInvoiceModal from "../../components/invoices/AddInvoiceModal";
import EditInvoiceModal from "../../components/invoices/EditInvoiceModal";

function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  async function loadInvoices() {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error("Failed to load invoices:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteInvoice(invoice: Invoice) {
  const confirmed = window.confirm(
    `Are you sure you want to delete invoice ${invoice.invoice_number}?`,
  );

  if (!confirmed) return;

  try {
    await deleteInvoice(invoice.id);
    await loadInvoices();

    alert("Invoice deleted successfully!");
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    alert("Failed to delete invoice. Please try again.");
  }
}

  useEffect(() => {
    loadInvoices();
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const search = searchTerm.toLowerCase();

    return (
      invoice.invoice_number
        .toLowerCase()
        .includes(search) ||
      invoice.invoice_date
        .toLowerCase()
        .includes(search) ||
      invoice.due_date
        .toLowerCase()
        .includes(search) ||
      invoice.payment_status
        .toLowerCase()
        .includes(search) ||
      invoice.customers?.customer_name
        .toLowerCase()
        .includes(search) ||
      invoice.trips?.pickup_location
        .toLowerCase()
        .includes(search) ||
      invoice.trips?.delivery_location
        .toLowerCase()
        .includes(search)
    );
  });

  if (loading) {
    return <div className="p-8">Loading invoices...</div>;
  }

  return (
    <div className="p-8">
      <InvoiceHeader
        onAddInvoice={() => setIsModalOpen(true)}
      />

      <InvoiceSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <InvoiceTable
        invoices={filteredInvoices}
        onEdit={(invoice) => {setSelectedInvoice(invoice);}}
        onDelete={handleDeleteInvoice}
      />

      <EditInvoiceModal
        isOpen={selectedInvoice !== null}
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onSaved={loadInvoices}
      />

      <AddInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadInvoices}
      />
    </div>
  );
}

export default InvoicesPage;
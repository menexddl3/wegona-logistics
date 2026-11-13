
import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { getInvoiceItems } from "../../services/invoiceItemService";
import { updateInvoiceWithItems } from "../../services/invoiceService";
import type { Invoice } from "../../types/invoice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  invoice: Invoice | null;
}

interface InvoiceItemForm {
  description: string;
  quantity: number;
  unitPrice: number;
}

function EditInvoiceModal({
  isOpen,
  onClose,
  onSaved,
  invoice,
}: Props) {
  const [customers, setCustomers] = useState<
    { id: string; customer_name: string }[]
  >([]);

  const [trips, setTrips] = useState<
    {
      id: string;
      pickup_location: string;
      delivery_location: string;
      trip_date: string;
    }[]
  >([]);

  const [customerId, setCustomerId] = useState("");
  const [tripId, setTripId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taxAmount, setTaxAmount] = useState(0);

  const [paymentStatus, setPaymentStatus] = useState<
    "unpaid" | "partial" | "paid" | "overdue"
  >("unpaid");

  const [items, setItems] = useState<InvoiceItemForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const totalAmount = subtotal + taxAmount;

  useEffect(() => {
    if (!isOpen || !invoice) return;

    const selectedInvoice = invoice;

    let cancelled = false;

    async function loadInvoiceData() {
      setLoading(true);
      setErrorMessage("");

      try {
        const [customerResult, tripsResult, invoiceItems] =
          await Promise.all([
            supabase
              .from("customers")
              .select("id, customer_name")
              .order("customer_name"),

            supabase
              .from("trips")
              .select(
                "id, pickup_location, delivery_location, trip_date",
              )
              .order("trip_date", { ascending: false }),

            getInvoiceItems(selectedInvoice.id),
          ]);

        if (customerResult.error) throw customerResult.error;
        if (tripsResult.error) throw tripsResult.error;

        if (cancelled) return;

        setCustomers(customerResult.data ?? []);
        setTrips(tripsResult.data ?? []);

        setCustomerId(selectedInvoice.customer_id);
        setTripId(selectedInvoice.trip_id);
        setInvoiceDate(selectedInvoice.invoice_date);
        setDueDate(selectedInvoice.due_date);
        setTaxAmount(selectedInvoice.tax_amount ?? 0);
        setPaymentStatus(selectedInvoice.payment_status);

        setItems(
          invoiceItems.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unit_price),
          })),
        );
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load invoice:", error);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Failed to load invoice details.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInvoiceData();

    return () => {
      cancelled = true;
    };
  }, [isOpen, invoice]);

  async function handleUpdateInvoice(){
    setErrorMessage("");

    if (!invoice) return;

    if (!customerId || !tripId || !invoiceDate || !dueDate) {
      setErrorMessage("Please complete all the invoice details.");
      return;
    }

    if (dueDate < invoiceDate) {
      setErrorMessage("Due date cannot be earlier than invoice date.");
      return;
    }

    if (
      items.length === 0 ||
      items.some(
        (item) => 
          !item.description.trim() ||
          !Number.isFinite(item.quantity) ||
          item.quantity <= 0 ||
          !Number.isFinite(item.unitPrice) || 
          item.unitPrice < 0
      )
    ){
      setErrorMessage(
        "Enter a description, positive quantity, and valid unit price for every item."
      );
      return;
    }

    if (!Number.isFinite(taxAmount) || taxAmount < 0) {
      setErrorMessage("Tax amount cannot be negative.");
      return;
    }

    setSaving(true);

    try {
      await updateInvoiceWithItems(
        invoice.id,
        customerId,
        tripId,
        invoiceDate,
        dueDate,
        taxAmount,
        paymentStatus,
        items.map((item) => ({
          description: item.description.trim(),
          quantity: item.quantity,
          unit_price: item.unitPrice,
        }))
      );

      onClose();
      onSaved();
    } catch (error) {
      console.error("Failed to update invoice:", error);

      setErrorMessage(
        error instanceof Error 
          ? error.message
          : "Failed to update invoice. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Edit Invoice</h2>
            <p className="mt-1 text-sm text-gray-500">
              Invoice: {invoice.invoice_number}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <p className="py-8 text-center text-gray-500">
            Loading invoice details...
          </p>
        ) : (
          <>
            
            {errorMessage && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            {/* INVOICE DETAILS */}
            <div className="mb-6 grid grid-cols-2 gap-4">

              {/* Customer */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Customer
                </label>

                <select
                  value={customerId}
                  onChange={(event) => setCustomerId(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="">Select customer</option>

                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customer_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trip */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Trip
                </label>

                <select
                  value={tripId}
                  onChange={(event) => setTripId(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="">Select trip</option>

                  {trips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.pickup_location} → {trip.delivery_location} ({trip.trip_date})
                    </option>
                  ))}
                </select>
              </div>

              {/* Invoice Date */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Invoice Date
                </label>

                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(event) => setInvoiceDate(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Due Date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
            </div>

            {/* INVOICE ITEMS */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold">
                Invoice Items
              </h3>

              {items.map((item, index) => (
                <div
                  key={index}
                  className="mb-3 grid grid-cols-12 gap-3"
                >
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(event) => {
                      setItems((previous) =>
                        previous.map((current, i) =>
                          i === index
                            ? { ...current, description: event.target.value }
                            : current
                        )
                      );
                    }}
                    className="col-span-5 rounded-lg border px-3 py-2"
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(event) => {
                      setItems((previous) =>
                        previous.map((current, i) =>
                          i === index
                            ? { ...current, quantity: Number(event.target.value) }
                            : current
                        )
                      );
                    }}
                    className="col-span-2 rounded-lg border px-3 py-2"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(event) => {
                      setItems((previous) =>
                        previous.map((current, i) =>
                          i === index
                            ? { ...current, unitPrice: Number(event.target.value) }
                            : current
                        )
                      );
                    }}
                    className="col-span-3 rounded-lg border px-3 py-2"
                  />

                  <div className="col-span-2 flex items-center justify-end font-medium">
                    {(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setItems((previous) => [
                    ...previous,
                    { description: "", quantity: 1, unitPrice: 0 },
                  ])
                }
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>

            {/* TAX AND PAYMENT STATUS */}
            <div className="mb-6 grid grid-cols-2 gap-4">

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tax Amount
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={taxAmount}
                  onChange={(event) => setTaxAmount(Number(event.target.value))}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Payment Status
                </label>

                <select
                  value={paymentStatus}
                  onChange={(event) =>
                    setPaymentStatus(
                      event.target.value as
                        | "unpaid"
                        | "partial"
                        | "paid"
                        | "overdue"
                    )
                  }
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* INVOICE SUMMARY */}
            <div className="mb-6 border-t pt-4">

              <div className="mb-2 flex justify-end">
                <span className="mr-8 text-gray-500">Subtotal</span>
                <span className="w-32 text-right font-medium">
                  {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="mb-2 flex justify-end">
                <span className="mr-8 text-gray-500">Tax</span>
                <span className="w-32 text-right font-medium">
                  {taxAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-end text-lg font-bold">
                <span className="mr-8">Total</span>
                <span className="w-32 text-right">
                  {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateInvoice}
                disabled={saving || loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Invoice"}
              </button>
            </div>

          </>
        )}
      </div>
    </div>
  );
}

export default EditInvoiceModal;

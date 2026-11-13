import { useEffect, useState } from "react";
import {createInvoiceWithItems} from "../../services/invoiceService";
import { supabase } from "../../lib/supabase";
import { X, Plus } from "lucide-react";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

interface InvoiceItemForm {
  description: string;
  quantity: number;
  unitPrice: number;
}

function AddInvoiceModal({
  isOpen,
  onClose,
  onSaved,
}: Props) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [tripId, setTripId] = useState("");

  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [paymentStatus, setPaymentStatus] = useState<
    "unpaid" | "partial" | "paid" | "overdue"
  >("unpaid");

  const [items, setItems] = useState<InvoiceItemForm[]>([
    {
      description: "",
      quantity: 1,
      unitPrice: 0,
    },
  ]);

  const [taxAmount, setTaxAmount] = useState(0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice, 0
  );

  const totalAmount = subtotal + taxAmount;

  useEffect(() => {
    if (!isOpen) return;

    async function loadOptions() {
      const [customerResult, tripsResult] = await Promise.all([supabase
        .from("customers")
        .select("id, customer_name")
        .order("customer_name"),

        supabase
          .from("trips")
          .select(
            "id, pickup_location, delivery_location, trip_date"
          )
          .order("trip_date", {ascending: false}),
      ]);

      if (customerResult.error) {
        console.error(customerResult.error);
      } else {
        setCustomers(customerResult.data ?? []);
      }
    

      if (tripsResult.error) {
        console.error(tripsResult.error);
      } else {
        setTrips(tripsResult.data ?? []);
      }
    }

    loadOptions();
  }, [isOpen]);

  async function handleCreateInvoice() {
    setErrorMessage("");

    if (!customerId || ! tripId || !invoiceDate || !dueDate) {
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
    ) {
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
      // const {data: company, error: companyError} = await supabase
      //   .from("customers")
      //   .select("customer_id")
      //   .eq("id", customerId)
      //   .single();

      // if (companyError) throw companyError;

      const { data: latestInvoices, error: invoiceError} = await supabase
      .from("invoices")
      .select("invoice_number")
      .like("invoice_number", "INV-%");

      if (invoiceError) throw invoiceError;

      const highestNumber = (latestInvoices ?? []).reduce(
        (highest, invoice) => {
          const match = invoice.invoice_number.match(/^INV-(\d+)$/);
          return match
          ? Math.max(highest, Number(match[1]))
          : highest;
        },
        0
      );
    

    const invoiceNumber = `INV-${String(highestNumber + 1).padStart(6, "0")}`;

    await createInvoiceWithItems(
      // company.company_id, substitute with a valid company ID ->hardcoded for now
      "1b5501ed-1fd0-4b37-a30d-e3f6be504804",
      customerId,
      tripId,
      invoiceNumber,
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

    setCustomerId("");
    setTripId("");
    setInvoiceDate("");
    setDueDate("");
    setTaxAmount(0);
    setPaymentStatus("unpaid");
    setItems([{ description: "" , quantity: 1, unitPrice: 0}]);

    onClose();
    onSaved();
  } catch (error) {
    console.error("Failed to create iinvoice: ", error);
    setErrorMessage(
      error instanceof Error 
      ? error.message
      : "Failed to create invoice. Please try again."
    );
  } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              Add Invoice
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Create a new invoice
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            <X size={18} />
          </button>
        </div>

        {/* Customer + Trip */}

        <div className="grid grid-cols-2 gap-4 mb-4">

          <div>
            <label className="block text-sm font-medium mb-1">
              Customer
            </label>

            <select
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">
                Select customer
              </option>

              {customers.map((customer) => (
                <option 
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.customer_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Trip
            </label>

            <select
              value={tripId}
              onChange={(event) => setTripId(event.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >

              <option value="">
                  Select trip
              </option>

              {trips.map((trip) => (
                <option
                  key={trip.id}
                  value={trip.id}
                >
                  {trip.pickup_location} →{" "}
                  {trip.delivery_location} (
                    {trip.trip_date}
                  )
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dates */}

        <div className="grid grid-cols-2 gap-4 mb-6">

          <div>
            <label className="block text-sm font-medium mb-1">
              Invoice Date
            </label>

            <input
              type="date"
              value={invoiceDate}
              onChange={(event) => setInvoiceDate(event.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Invoice Items */}

        <div className="mb-6">
          
          <h3 className="text-lg font-semibold mb-3">
            Invoice Items
          </h3>

          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-3 mb-3"
            >

            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(event) => {
                const updated = [...items];

                updated[index].description = event.target.value;
                setItems(updated);
              }}
              className="col-span-6 border rounded-lg px-3 py-2"
            />

            <input
              type="number"
              min="1"
              placeholder="Qty"
              value={item.quantity}
              onChange={(event) => {
                const updated = [...items];

                updated[index].quantity = 
                  Number(event.target.value);

                setItems(updated);
              }}
              className="col-span-2 border rounded-lg px-3 py-2"
            />

            <input
              type="number"
              min="0"
              step={"0.01"}
              placeholder="Unit Price"
              value={item.unitPrice}
              onChange={(event) => {
                const updated = [...items];

                updated[index].unitPrice = Number(event.target.value);

                setItems(updated);
              }}
              className="col-span-3 border rounded-lg px-3 py-2"
              />

              <div className="col-span-1 flex items-center justify-center font-medium">
                {(item.quantity * item.unitPrice).toFixed(2)}
              </div>
            </div>
        ))}

        <button
          type="button"
          onClick={() => 
            setItems([
              ...items,
              {
                description: "",
                quantity: 1,
                unitPrice: 0,
              },
            ])
          }
          className="text-blue-600 hover:text--bllue-800 text-sm font-medium"
        >
          <Plus size={18}>Add Item</Plus>
        </button>
        </div>

        {/* Tax + Status */}

        <div className="grid grid-cols-2 gap -4 mb-6">

          <div>
            <label className="blok text-sm font-medium mb-1">
              Tax Amount
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={taxAmount}
              onChange={(event) => setTaxAmount(Number(event.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Payment Status
            </label>

            <select
              value={paymentStatus}
              onChange={(event) => setPaymentStatus(event.target.value as
                | "unpaid"
                | "partial"
                | "paid"
                | "overdue"
              )}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-end mb-2">
            <span className="text-gray-500 mr-8">Subtotal</span>
            <span className="font-medium w-32 text-right">
              {subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-end mb-2">
            <span className="text-gray-500 mr-8">Tax</span>
            <span className="font-medium w-32 text-right">
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

        {errorMessage && (
          <p className="text-red-600 text-sm mb-4">
            {errorMessage}
          </p>
        )}

        {/* Buttons */}

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover: bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreateInvoice}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {/* Create Invoice */}{saving ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddInvoiceModal;
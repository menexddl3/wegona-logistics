import { Search } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function InvoiceSearch({
  searchTerm,
  onSearchChange,
}: Props) {
  return (
    <div className="relative mb-6">
      <Search
        size={18}
        className="absolute left-3 top-3 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search invoices..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        className="w-full border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default InvoiceSearch;
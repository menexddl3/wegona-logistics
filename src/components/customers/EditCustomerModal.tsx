import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { updateCustomer } from "../../services/customerService";
import type { Customer } from "../../types/customer";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null;
    onSaved: () => void;
}

function EditCustomerModal({ customer, isOpen, onClose, onSaved }: Props) {

    useEffect(() => {
        if (customer) {
            setName(customer.customer_name);
            setCompanyName(customer.company_name);
            setPhone(customer.phone);
            setEmail(customer.email);
            setAddress(customer.address);
            setCity(customer.city);
            setCountry(customer.country);
        }
    }, [customer]);

    const [name, setName] = useState(customer?.customer_name ?? "");
    const [companyName, setCompanyName] = useState(customer?.company_name ?? "");
    const [phone, setPhone] = useState(customer?.phone ?? "");
    const [email, setEmail] = useState(customer?.email ?? "");
    const [address, setAddress] = useState(customer?.address ?? "");
    const [city, setCity] = useState(customer?.city ?? "");
    const [country, setCountry] = useState(customer?.country ?? "");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!customer) return;

        try {
            const updatedCustomer = await updateCustomer(
                customer.id,
                companyName.trim(),
                name.trim(),
                phone.trim(),
                email.trim(),
                address.trim(),
                city.trim(),
                country.trim(),
            );

            console.log("Customer updated:", updatedCustomer);

            onSaved();
            onClose();
        } catch (error) {
            console.error("Failed to update customer:", error);
        }
    };

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-full max-w-lg p-6">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        Edit Customer
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        <X size={20} />
                    </button>

                </div>

                <form 
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    >

                    <input
                        type="text"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(event) => setCompanyName(event.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Customer Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Phone"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                        >
                            Save Changes
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default EditCustomerModal;
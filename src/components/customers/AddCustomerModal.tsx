import { X } from "lucide-react";
import { useState } from "react";
import { addCustomer } from "../../services/customerService";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCustomerAdded: ()=> void;
}

function AddCustomerModal({
    isOpen,
    onClose,
    onCustomerAdded,
    }: Props) {

    const [company_name, setCompanyName] =useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!name.trim()) {
            alert("Customer name is required");
            return;
        }

        if (!phone.trim()) {
            alert("Phone number is required");
            return;
        }

        if (!email.trim()) {
            alert("Email is required");
            return;
        }

        if (!company_name.trim()) {
            alert("Company name is required");
            return;
        }

        if (!address.trim()) {
            alert("Address is required");
            return;
        }

        if (!city.trim()) {
            alert("City is required");
            return;
        }

        if (!country.trim()) {
            alert("Country is required");
            return;
        }

        try {
            const customer = await addCustomer(
                company_name.trim(),
                name.trim(),
                phone.trim(),
                email.trim(),
                address.trim(),
                city.trim(),
                country.trim(),
            );

            console.log("Customer added:", customer);

            onCustomerAdded();
            onClose();
        } catch (error) {
            console.error("Failed to add customer:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-full max-w-lg p-6">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        Add Customer
                    </h2>

                    <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-black text-xl">
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
                    value={company_name}
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
                    className="px-4 py-2 rounded-lg border">
                        Cancel
                    </button>

                    <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                        Save Customer
                    </button>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCustomerModal;
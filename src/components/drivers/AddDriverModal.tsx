import { X } from "lucide-react";
import { useState } from "react";
import { addDriver } from "../../services/driverService";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
}

function AddDriverModal({ isOpen, onClose, onSaved }: Props) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [licenseExpiry, setLicenseExpiry] = useState("");
    const [nationalId, setNationalId] = useState("");
    const [status, setStatus] = useState("available");

    if (!isOpen) return null;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!name.trimEnd()) {
            alert("Driver name is required");
            return;
        }

        if (!phone.trim()) {
            alert("Phone number is required");
            return;
        }

        if(!licenseNumber.trim()) {
            alert("License number is required");
            return;
        }

        if (!licenseExpiry) {
            alert("License expiry is required");
            return;
        }

        try {
            const driver = await addDriver(
                name.trim(),
                phone.trim(),
                licenseNumber.trim(),
                licenseExpiry.trim(),
                nationalId.trim(),
                status as "available" | "on_trip" | "inactive",
            );

            console.log("Driver added:", driver);

            onSaved();
            onClose();
        } catch (error) {
            console.error("Failed to add driver:", error);
        }
        
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-full max-w-lg p-6">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        Add Driver
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
                    className="space-y-4">

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="License Number"
                        value={licenseNumber}
                        onChange={(event) => setLicenseNumber(event.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            License Expiry
                        </label>

                        <input
                            type="date"
                            value={licenseExpiry}
                            onChange={(event) => setLicenseExpiry(event.target.value)}
                            className="w-full border rounded-lg px-4 py-3"
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="National ID (Optional)"
                        value={nationalId}
                        onChange={(event) => setNationalId(event.target.value)}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            className="w-full border rounded-lg px-4 py-3"
                        >
                            <option value="available">Available</option>
                            <option value="on_trip">On Trip</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

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
                            Save Driver
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default AddDriverModal;
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { updateVehicle } from "../../services/vehicleService";
import type { Vehicle } from "../../types/vehicle";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle | null;
    onSaved: () => void;
}

function EditVehicleModal({
    isOpen,
    onClose,
    vehicle,
    onSaved,
}: Props) {

    const [registrationNumber, setRegistrationNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [capacity, setCapacity] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [status, setStatus] = useState<
        "active" | "maintenance" | "retired"
    >("active");

    useEffect(() => {
        if (vehicle) {
            setRegistrationNumber(vehicle.registration_number);
            setVehicleType(vehicle.vehicle_type);
            setMake(vehicle.make);
            setModel(vehicle.model);
            setYear(vehicle.year.toString());
            setCapacity(vehicle.capacity);
            setFuelType(vehicle.fuel_type);
            setStatus(vehicle.current_status);
        }
    }, [vehicle]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!vehicle) return;

        try {
            const updatedVehicle = await updateVehicle(
                vehicle.id,
                registrationNumber.trim(),
                vehicleType.trim(),
                make.trim(),
                model.trim(),
                Number(year),
                capacity.trim(),
                fuelType.trim(),
                status
            );

            console.log("Vehicle updated:", updatedVehicle);

            onSaved();
            onClose();

        } catch (error) {
            console.error("Failed to update vehicle:", error);
        }
    };

    if (!isOpen || !vehicle) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-full max-w-lg p-6">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        Edit Vehicle
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
                        placeholder="Registration Number"
                        value={registrationNumber}
                        onChange={(event) =>
                            setRegistrationNumber(event.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Vehicle Type"
                        value={vehicleType}
                        onChange={(event) =>
                            setVehicleType(event.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Make"
                        value={make}
                        onChange={(event) =>
                            setMake(event.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Model"
                        value={model}
                        onChange={(event) =>
                            setModel(event.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="number"
                        placeholder="Year"
                        value={year}
                        onChange={(event) =>
                            setYear(event.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Capacity"
                        value={capacity}
                        onChange={(event) =>
                            setCapacity(event.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Fuel Type"
                        value={fuelType}
                        onChange={(event) =>
                            setFuelType(event.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value as
                                    | "active"
                                    | "maintenance"
                                    | "retired"
                            )
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    >
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="retired">Retired</option>
                    </select>

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

export default EditVehicleModal;
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { addTrip } from "../../services/tripService";
import { getCustomers } from "../../services/customerService";
import { getDrivers } from "../../services/driverService";
import { getVehicles } from "../../services/vehicleService";

import type { Customer } from "../../types/customer";
import type { Driver } from "../../types/driver";
import type { Vehicle } from "../../types/vehicle";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function AddTripModal({
  isOpen,
  onClose,
  onSaved,
}: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [cargoDescription, setCargoDescription] = useState("");

  const [tripDate, setTripDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const [status, setStatus] =
    useState<"pending" | "in_progress" | "completed" | "cancelled">(
      "pending"
    );

  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    async function loadOptions() {
      try {
        const [customerData, driverData, vehicleData] =
          await Promise.all([
            getCustomers(),
            getDrivers(),
            getVehicles(),
          ]);

        setCustomers(customerData);
        setDrivers(driverData);
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Failed to load trip options:", error);
      }
    }

    loadOptions();
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await addTrip(
        customerId,
        driverId,
        vehicleId,
        pickupLocation.trim(),
        deliveryLocation.trim(),
        cargoDescription.trim(),
        tripDate,
        departureTime,
        arrivalTime || null,
        status,
        notes.trim() || null
      );

      onSaved();
      onClose();
    } catch (error) {
      console.error("Failed to add trip:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Add Trip
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Customer */}
          <select
            value={customerId}
            onChange={(event) =>
              setCustomerId(event.target.value)
            }
            required
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.customer_name}
              </option>
            ))}
          </select>

          {/* Driver */}
          <select
            value={driverId}
            onChange={(event) =>
              setDriverId(event.target.value)
            }
            required
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="">Select Driver</option>

            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.full_name}
              </option>
            ))}
          </select>

          {/* Vehicle */}
          <select
            value={vehicleId}
            onChange={(event) =>
              setVehicleId(event.target.value)
            }
            required
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="">Select Vehicle</option>

            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.registration_number} — {vehicle.make}{" "}
                {vehicle.model}
              </option>
            ))}
          </select>

          {/* Locations */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Pickup Location"
              value={pickupLocation}
              onChange={(event) =>
                setPickupLocation(event.target.value)
              }
              required
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="text"
              placeholder="Delivery Location"
              value={deliveryLocation}
              onChange={(event) =>
                setDeliveryLocation(event.target.value)
              }
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Cargo */}
          <input
            type="text"
            placeholder="Cargo Description"
            value={cargoDescription}
            onChange={(event) =>
              setCargoDescription(event.target.value)
            }
            required
            className="w-full border rounded-lg px-4 py-3"
          />

          {/* Date */}
          <input
            type="date"
            value={tripDate}
            onChange={(event) =>
              setTripDate(event.target.value)
            }
            required
            className="w-full border rounded-lg px-4 py-3"
          />

          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Departure Time
              </label>

              <input
                type="datetime-local"
                value={departureTime}
                onChange={(event) =>
                  setDepartureTime(event.target.value)
                }
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Arrival Time
              </label>

              <input
                type="datetime-local"
                value={arrivalTime}
                onChange={(event) =>
                  setArrivalTime(event.target.value)
                }
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | "pending"
                  | "in_progress"
                  | "completed"
                  | "cancelled"
              )
            }
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Notes */}
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={3}
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
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Trip
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddTripModal;
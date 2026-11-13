import type { Trip } from "../../types/trip";

interface Props {
    trips: Trip[];
    onEdit: (trip: Trip) => void;
    onDelete: (trip: Trip) => void;
}

function TripTable ({ trips, onEdit, onDelete}: Props) {

    const getStatusClass = (status: Trip["status"]) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700";
            
            case "in_progress":
                return "bg-blue-100 text-blue-700";
            
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            
            case "cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
                <thead className="bg-slate-100">
                    <tr className="text-left text-xs uppercase tracking-wider text-slate-600">
                        <th className="px-6 py-4">Route</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Driver</th>
                        <th className="px-6 py-4">Vehicle</th>
                        <th className="px-6 py-4">Cargo</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {trips.map((trip) => (
                        <tr key={trip.id} className="border-t">
                            <td className="px-6 py-4">
                                <div className="font-medium">
                                    {trip.pickup_location}
                                </div>

                                <div className="text-sm text-gray-500">
                                    → {trip.delivery_location}
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                {trip.customers?.customer_name ?? "—"}
                            </td>

                            <td className="px-6 py-4">
                                {trip.drivers?.full_name ?? "—"}
                            </td>

                            <td className="px-6 py-4">
                                {trip.vehicles ? `${trip.vehicles.registration_number}`
                                : "—"}
                            </td>

                            <td className="px-6 py-4">
                                {trip.cargo_description}
                            </td>

                            <td className="px-6 py-4">
                                {formatDate(trip.trip_date)}
                            </td>

                            <td className="px-6 py-4">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capialize ${getStatusClass(trip.status)}`}
                                >
                                    {trip.status.replace("_", " ")}
                                </span>
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(trip)}
                                        className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
                                        >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => onDelete(trip)}
                                        className="px-3 py-1 text-sm border rounded-lg text-red-600 hover:bg-red-50"
                                        >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default TripTable;
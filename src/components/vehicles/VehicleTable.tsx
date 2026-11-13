import { Pencil, Trash2 } from "lucide-react";
import type { Vehicle } from "../../types/vehicle";

interface Props {
    vehicles: Vehicle[];
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (vehicle: Vehicle) => void;
}

function VehicleTable({ vehicles, onEdit, onDelete,}: Props) {
    return (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

            <table className="w-full">

                <thead className="bg-slate-100">
                    <tr className="text-left text-xs uppercase tracking-wider text-slate-600">

                        <th className="px-6 py-4">Registration</th>
                        <th className="px-6 py-4">Vehicle</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Year</th>
                        <th className="px-6 py-4">Capacity</th>
                        <th className="px-6 py-4">Fuel Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>

                    </tr>
                </thead>

                <tbody>
                    {vehicles.map((vehicle) => (

                        <tr
                            key={vehicle.id}
                            className="border-t odd:bg-white even:bg-slate-50 hover:bg-blue-50 transition">

                                <td className="px-6 py-4 font-semibold">
                                    {vehicle.registration_number}
                                </td>

                                 <td className="px-6 py-4 font-semibold">
                                    <div>
                                        <p className="font-semibold">
                                            {vehicle.make} {vehicle.model}
                                        </p>
                                    </div>
                                </td>

                                 <td className="px-6 py-4 font-semibold">
                                    {vehicle.vehicle_type}
                                </td>

                                 <td className="px-6 py-4 font-semibold">
                                    {vehicle.year}
                                </td>

                                 <td className="px-6 py-4 font-semibold">
                                    {vehicle.capacity}
                                </td>

                                 <td className="px-6 py-4 font-semibold">
                                    {vehicle.fuel_type}
                                </td>

                                 <td className="px-6 py-4 font-semibold">
                                    {vehicle.current_status}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => onEdit(vehicle)}
                                            className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition">
                                                <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => onDelete(vehicle)}
                                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition">
                                                <Trash2 size={18} />
                                            </button>       
                                    </div>
                                </td>

                            </tr>

                    ))}
                </tbody>

            </table>
            
        </div>
    );
}
export default VehicleTable;
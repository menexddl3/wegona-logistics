import type { Driver } from "../../types/driver";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
    drivers: Driver[];
    onEdit: (driver: Driver) => void;
    onDelete: (driver: Driver) => void;
}

function DriverTable ({ drivers, onEdit, onDelete } : Props){
    return (
        <div className="overflow-hidden rounded-xl border bg-whte shadow-sm" >
            
            <table className="w-full">

                <thead className="bg-slate-100">

                    <tr className="text-left text-xs uppercase tracking-wider text-slate-600">

                        <th className="px-6 py-4">Driver</th>
                        <th className="px-6 py-4">Phone</th>
                        <th className="px-6 py-4">License</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>

                    </tr>

                </thead>
                
                <tbody>
                    {drivers.map((driver) => (

                        <tr
                            key={driver.id}
                            className="border-t odd:bg-white even:bg-slate-50 hover:bg-blue-50 transition-colors">

                                <td className="px-6 py-4">
                                    
                                    <div>

                                        <p className="font-semibold">
                                            {driver.full_name}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Driver
                                        </p>

                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    {driver.phone}
                                </td>

                                <td className="px-6 py-4">
                                    {driver.license_number}
                                </td>

                                <td className="px-6 py-4">
                                    {driver.status}
                                </td>

                                <td className="px-6 py-4 text-center">

                                    <div className="flex justify-center gap-2">

                                        <button
                                            onClick={() => onEdit(driver)} 
                                            className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition">
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => onDelete(driver)} 
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

export default DriverTable;
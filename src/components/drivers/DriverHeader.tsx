import { Plus } from "lucide-react";

interface Props {
    onAddDriver: () => void;
}

function DriverHeader ({ onAddDriver } : Props) {
    return (

        <div className="flex items-center justify-between mb-6">
            
            <div>
                
                <h1 className="text-3xl font-bold">
                    Drivers
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage all driver records
                </p>

            </div>

            <button
                onClick={onAddDriver}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <Plus size={18} />
                    Add Driver
                </button>

        </div>

    );
}
export default DriverHeader;
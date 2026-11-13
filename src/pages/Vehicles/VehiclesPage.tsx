import { useEffect, useState } from "react";
import { getVehicles, deleteVehicle } from "../../services/vehicleService";
import VehicleHeader from "../../components/vehicles/VehicleHeader";
import VehicleSearch from "../../components/vehicles/VehicleSearch";
import VehicleTable from "../../components/vehicles/VehicleTable";
import AddVehicleModal from "../../components/vehicles/AddVehicleModal";
import type { Vehicle } from "../../types/vehicle";
import EditVehicleModal from "../../components/vehicles/EditVehicleModal";

function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    const filteredVehicles = vehicles.filter((vehicle) => {
      const search = searchTerm.toLowerCase();

      return (
        vehicle.registration_number.toLowerCase().includes(search) ||
        vehicle.vehicle_type.toLowerCase().includes(search) ||
        vehicle.make.toLowerCase().includes(search) ||
        vehicle.model.toLowerCase().includes(search) ||
        vehicle.year.toString().includes(search) ||
        vehicle.fuel_type.toLowerCase().includes(search) ||
        vehicle.current_status.toLowerCase().includes(search)
      );
    });

    const handleDeleteVehicle = async (vehicle: Vehicle) => {
        const confrimed = window.confirm(`Are you sure you want to delete vehicle ${vehicle.registration_number}?`);
        if (!confrimed) return;

        try {
            await deleteVehicle(vehicle.id);
            await loadVehicles();
        } catch (error) {
            console.error("Failed to delete vehicle:", error);
        }
    };

    async function loadVehicles() {
        try {
            const data = await getVehicles();
            setVehicles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadVehicles();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                Loading vehicles...
            </div>
        );
    }

    return (
        <div className="p-8">
          <VehicleHeader
            onAddVehicle={()=> setIsModalOpen(true)}
          />
          <VehicleSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <VehicleTable
            vehicles={filteredVehicles}
            onEdit={(vehicle) => setSelectedVehicle(vehicle)}
            onDelete={(vehicle) => handleDeleteVehicle(vehicle)}
          />

        <EditVehicleModal
            vehicle={selectedVehicle}
            isOpen={selectedVehicle !== null}
            onClose={() => setSelectedVehicle(null)}
            onSaved={loadVehicles}
        />

          <AddVehicleModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSaved={loadVehicles}
        />

        </div>
    );
}

export default VehiclesPage;
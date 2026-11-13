import {useEffect, useState } from "react";
import { getDrivers, deleteDriver } from "../../services/driverService";
import type { Driver } from "../../types/driver";
import DriverTable from "../../components/drivers/DriverTable";
import DriverHeader from "../../components/drivers/DriverHeader";
import DriverSearch from "../../components/drivers/DriverSearch";
import AddDriverModal from "../../components/drivers/AddDriverModal";
import EditDriverModal from "../../components/drivers/EditDriverModal"

function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

    async function loadDrivers() {
      try {
        const data = await getDrivers();
        setDrivers(data);
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }

    }
    
    useEffect(() => {
      loadDrivers();
  }, []);
  
  const filteredDrivers = drivers.filter((driver) => {
    const search = searchTerm.toLocaleLowerCase();

    return (
      driver.full_name.toLowerCase().includes(search) ||
      driver.phone.toLowerCase().includes(search) ||
      driver.license_number.toLowerCase().includes(search) ||
      driver.national_id?.toLowerCase().includes(search) ||
      driver.status.toLowerCase().includes(search)
    );
  });


  const handleDelete = async (driver: Driver) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${driver.full_name}?`
    );

    if (!confirmed) return;

    try {
      await deleteDriver(driver.id);

      await loadDrivers();
    } catch (error) {
      console.error("Failed to delete driver:", error);
    }

  };

  if (loading) {
    return (
      <div className="p-8">
        Loading drivers...
      </div>
    );
  }

  return (
    <div className="p-8">

      <DriverHeader 
        onAddDriver={() => setIsModalOpen(true)} 
      />

      <DriverSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <DriverTable 
        drivers={filteredDrivers}
        onEdit={(driver) => setSelectedDriver(driver)}
        onDelete={handleDelete}
      />
      
      <AddDriverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadDrivers}
      />

      <EditDriverModal
        driver={selectedDriver}
        isOpen={selectedDriver !== null}
        onClose={() => setSelectedDriver(null)}
        onSaved={loadDrivers}
      />

    </div>
  );
}

export default DriversPage;
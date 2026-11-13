import { useEffect, useState } from "react";
import { getTrips, deleteTrip } from "../../services/tripService";
import type { Trip } from "../../types/trip";
import TripTable from "../../components/trips/TripTable";
import TripSearch from "../../components/trips/TripSearch";
import TripHeader from "../../components/trips/TripHeader";
import AddTripModal from "../../components/vehicles/AddTripModal";
import EditTripModal from "../../components/trips/EditTripModal";

function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleDelete = async (trip: Trip) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the trip from ${trip.pickup_location} to ${trip.delivery_location}?`
    );

    if (!confirmed) return;

    try {
      await deleteTrip(trip.id);
      await loadTrips();
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  const filteredTrips = trips.filter((trip) => {
  const search = searchTerm.toLowerCase();

  return (
    trip.pickup_location.toLowerCase().includes(search) ||
    trip.delivery_location.toLowerCase().includes(search) ||
    trip.cargo_description.toLowerCase().includes(search) ||
    trip.trip_date.toLowerCase().includes(search) ||
    trip.status.toLowerCase().includes(search) ||
    trip.notes?.toLowerCase().includes(search) ||

    trip.customers?.customer_name
      .toLowerCase()
      .includes(search) ||

    trip.drivers?.full_name
      .toLowerCase()
      .includes(search) ||

    trip.vehicles?.registration_number
      .toLowerCase()
      .includes(search) ||

    trip.vehicles?.make
      .toLowerCase()
      .includes(search) ||

    trip.vehicles?.model
      .toLowerCase()
      .includes(search) ||

    trip.departure_time?.toLowerCase().includes(search) ||

    trip.arrival_time?.toLowerCase().includes(search)
  );
});

  async function loadTrips() {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (error) {
      console.error("Failed to load trips:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrips();
  }, []);

  if (loading) {
    return <div className="p-8">Loading trips...</div>;
  }

  return (
    <div className="p-8">

        <TripHeader
          onAddTrip={() => setIsModalOpen(true)}
        />

        <TripSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <TripTable
          trips={filteredTrips}
          onEdit={(trip) => setSelectedTrip(trip)}
          onDelete={handleDelete}
        />

        <AddTripModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadTrips}
        />

        <EditTripModal
          trip={selectedTrip}
          isOpen={selectedTrip !== null}
          onClose={() => setSelectedTrip(null)}
          onSaved={loadTrips}
        />

      </div>
  );
}
export default TripsPage;
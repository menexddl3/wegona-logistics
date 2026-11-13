import { supabase } from "../lib/supabase";

export async function getTrips() {
  const { data, error } = await supabase
    .from("trips")
    .select(`
      *,
      customers (customer_name),
      drivers (full_name),
      vehicles (registration_number, make, model)
      `)
    .order("trip_date", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function addTrip(
  customerId: string,
  driverId: string,
  vehicleId: string,
  pickupLocation: string,
  deliveryLocation: string,
  cargoDescription: string,
  tripDate: string,
  departureTime: string,
  arrivalTime: string | null,
  status: "pending" | "in_progress" | "completed" | "cancelled",
  notes: string | null,
) {
  const { data, error } = await supabase
    .from("trips")
    .insert([
      {
        company_id: "1b5501ed-1fd0-4b37-a30d-e3f6be504804",
        customer_id: customerId,
        driver_id: driverId,
        vehicle_id: vehicleId,
        pickup_location: pickupLocation,
        delivery_location: deliveryLocation,
        cargo_description: cargoDescription,
        trip_date: tripDate,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        status,
        notes,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateTrip(
  id: string,
  customerId: string,
  driverId: string, 
  vehicleId: string,
  pickupLocation: string,
  deliveryLocation: string,
  cargoDescription: string,
  tripDate: string,
  departureTime: string,
  arrivalTime: string | null,
  status: "pending" | "in_progress" | "completed" | "cancelled",
  notes: string | null,
) {
  const { data, error } = await supabase
    .from("trips")
    .update({
      customer_id: customerId,
      driver_id: driverId,
      vehicle_id: vehicleId,
      pickup_location: pickupLocation,
      delivery_location: deliveryLocation,
      cargo_description: cargoDescription,
      trip_date: tripDate,
      departure_time: departureTime,
      arrival_time: arrivalTime,
      status,
      notes,
    })
    .eq("id", id)
    .select()
    .single();

    if (error) {
      throw error;
    }

    return data;
}

export async function deleteTrip(id: string) {
  const { error } = await supabase
   .from("trips")
   .delete()
   .eq("id", id);

   if (error) {
    throw error;
   }
}
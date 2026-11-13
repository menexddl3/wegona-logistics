import { supabase } from "../lib/supabase";

export async function getVehicles() {
    const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("registration_number");

        if (error) {
            throw error;
        }
        return data;
}

export async function addVehicle(
    registrationNumber: string,
    vehicleType: string,
    make: string,
    model: string,
    year: number,
    capacity: string,
    fuelType: string,
    status: "active" | "maintenance" | "retired",
) {
    const { data, error } = await supabase
        .from("vehicles")
        .insert([
            {
                company_id: "1b5501ed-1fd0-4b37-a30d-e3f6be504804",
                registration_number: registrationNumber,
                vehicle_type: vehicleType,
                make: make,
                model: model,
                year: year,
                capacity: capacity,
                fuel_type: fuelType,
                current_status: status,
            },
        ])
        .select()
        .single();

    if (error) {
        throw error;
    }
    return data;
}

export async function updateVehicle(
    id: string,
    registrationNumber: string,
    vehicleType: string,
    make: string,
    model: string,
    year: number,
    capacity: string,
    fuelType: string,
    status: "active" | "maintenance" | "retired",
) {
    const { data, error } = await supabase
        .from("vehicles")
        .update({
            registration_number: registrationNumber,
            vehicle_type: vehicleType,
            make: make,
            model: model,
            year: year,
            capacity: capacity,
            fuel_type: fuelType,
            current_status: status,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw error;
    }
    return data;
}

export async function deleteVehicle(id: string) {
  const { error } = await supabase
    .from("vehicles")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
    
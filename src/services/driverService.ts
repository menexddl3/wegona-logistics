import { supabase } from "../lib/supabase";

export async function getDrivers() {
    const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .order("full_name");

    if (error){
        throw error;
    }

    return data;
}

export async function addDriver(
    name: string,
    phone: string,
    licenseNumber: string,
    licenseExpiry: string,
    nationalId: string,
    status: string,
) {
    const { data, error } = await supabase
        .from("drivers")
        .insert([
            {
                company_id: "1b5501ed-1fd0-4b37-a30d-e3f6be504804",
                full_name: name,
                phone: phone,
                license_number: licenseNumber,
                license_expiry: licenseExpiry,
                national_id: nationalId || null,
                status: status,
            }
        ])
        .select()
        .single();

    if (error) {
        throw error;
    }
    return data;
}

export async function updateDriver(
    id: string,
    name: string,
    phone: string,
    licenseNumber: string,
    licenseExpiry: string,
    nationalId: string,
    status: "available" | "on_trip" | "inactive",
) {
    const { data, error } = await supabase
        .from("drivers")
        .update({
            full_name:name,
            phone: phone,
            license_number: licenseNumber,
            license_expiry: licenseExpiry,
            national_id: nationalId || null,
            status: status,
        })
        .eq("id", id)
        .select()
        .single();

        if (error) {
            throw error;
        }

        return data;
}

export async function deleteDriver(id: string) {
    const { error } = await supabase
        .from("drivers")
        .delete()
        .eq("id", id);

    if (error) {
        throw error;
    }
}
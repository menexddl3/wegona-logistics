import {supabase} from "../lib/supabase";

export async function getCustomers() {
    const {data, error} = await supabase
    .from("customers")
    .select("*")
    .order("customer_name");

    if (error) {
        throw error;
    }

    return data;
}

export async function addCustomer(
    company_name: string,
    name: string,
    phone: string, 
    email: string,
    address: string,
    city: string,
    country: string,
){
    const {data,error} =await supabase
    .from("customers")
    .insert([
        {
            company_id: "1b5501ed-1fd0-4b37-a30d-e3f6be504804",
            customer_name: name,
            company_name: company_name,
            phone: phone,
            email: email,
            address: address,
            city: city,
            country: country,
        },
    ])
    .select()
    .single();

    if (error) {
        throw error;
    }

    return data;
}
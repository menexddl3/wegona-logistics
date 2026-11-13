export interface Vehicle{
    id: string;
    created_at: string;
    company_id:string;
    registration_number: string;
    vehicle_type: string;
    make: string;
    model: string;
    year: string;
    capacity: string;
    fuel_type: string;
    current_status: "active" | "maintenance" | "retired";
}
export interface Trip {
    id: string;
    created_at: string;
    
    company_id: string;
    customer_id: string;
    driver_id: string;
    vehicle_id: string;

    pickup_location: string;
    delivery_location: string;
    cargo_description: string;

    trip_date: string;
    departure_time: string;
    arrival_time: string;

    status: "pending" | "in_progress" | "completed" | "cancelled";

    notes: string | null;

    customers: {
        customer_name: string;
    } | null;

    drivers: {
        full_name: string;
    } | null;

    vehicles: {
        registration_number: string;
        make: string;
        model: string;
    } | null;
}
export interface Driver {
    id: string;
    created_at: string;
    company_id: string;
    full_name: string;
    phone: string;
    license_number: string;
    license_expiry: string;
    national_id: string | null;
    status: "available" | "on_trip" | "inactive";
}


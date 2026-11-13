import {useEffect, useState} from "react";
import {getCustomers, deleteCustomer} from "../../services/customerService";
import type {Customer} from "../../types/customer";
import CustomerHeader from "../../components/customers/CustomerHeader";
import CustomerSearch from "../../components/customers/CustomerSearch";
import CustomerTable from "../../components/customers/CustomerTable";
import AddCustomerModal from "../../components/customers/AddCustomerModal";
import EditCustomerModal from "../../components/customers/EditCustomerModal";

function CustomerPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null> (null);

    async function loadCustomers(){
        try {
            const data = await getCustomers();
            setCustomers(data);
        }catch (error){
            console.error(error);
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCustomers();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if  (!confirmed) return;
        
        try {
            await deleteCustomer(id);

            await loadCustomers();
        } catch (error) {
            console.error("Failed to delete customer:", error);
        }
    };

    const filteredCustomers = customers.filter((customer) =>{
        const search = searchTerm.toLowerCase();

        return (
            customer.customer_name.toLowerCase().includes(search) ||
            customer.company_name.toLowerCase().includes(search) ||
            customer.phone.toLowerCase().includes(search) ||
            customer.email.toLowerCase().includes(search) ||
            customer.city.toLowerCase().includes(search)
        );
    } );

    if (loading) {
        return (
            <div className="p-8">
                Loading customers...
            </div>
        );
    }

    return (
        <div className="p-8">
            <CustomerHeader 
            onAddCustomer={() => setIsModalOpen(true)} />

            <CustomerSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            />

            <CustomerTable 
                customers={filteredCustomers}
                onEditCustomer={(customer) => {
                    console.log("Edit Click:", customer)
                    setSelectedCustomer(customer);
                }} 
                onDelete={handleDelete}
            />

            <EditCustomerModal
            customer={selectedCustomer}
            isOpen={selectedCustomer !== null}
            onClose={() => setSelectedCustomer(null)}
            onSaved={loadCustomers}
            />

            <AddCustomerModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onCustomerAdded={loadCustomers}
            />
        </div>
    );
}

export default CustomerPage;

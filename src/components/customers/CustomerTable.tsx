import {Pencil, Trash2} from "lucide-react";
import type { Customer } from "../../types/customer";

interface Props {
    customers: Customer[];
    onEditCustomer:(customer: Customer) => void;
    onDelete: (id: string) => void;
}

function CustomerTable({ customers, onEditCustomer, onDelete }: Props) {
    return (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

            <table className="w-full">
                <thead className="bg-slate-100">
                    <tr className="text-left text-xs uppercase tracking-wider text-slate-600">
                        
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Phone</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {customers.map((customer) => (
                        <tr
                            key={customer.id}
                            className="border-t odd:bg-white even:bg-slate-50 hover:bg-blue-50 transition-colors">
                                
                            <td className="px-6 py-4">
                                <div>
                                    <p className="font-semibold">
                                        {customer.customer_name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Customer
                                    </p>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                {customer.phone}
                            </td>

                            <td className="px-6 py-4">
                                {customer.email}
                            </td>

                            <td className="px-6 py-4 text-center">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => onEditCustomer(customer)}
                                        className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition">
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() => onDelete(customer.id)}
                                        className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerTable;
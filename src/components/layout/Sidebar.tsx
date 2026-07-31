import {NavLink} from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    Truck,
    Car,
    Route,
    FileText,
    Settings,
} from "lucide-react";

const menu = [
    {name: "Dashboard", path: "/", icon: LayoutDashboard},
    {name: "Customers", path: "/customers",  icon: Users},
    {name: "Drivers", path: "/drivers", icon: Truck},
    {name: "Vehicles", path: "/vehicles", icon: Car},
    {name: "Trips", path: "/trips", icon: Route},
    {name: "Invoices", path: "/invoices", icon: FileText},
    {name: "Settings", path: "/settings", icon: Settings},
];

function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-10">🚛 Wegona Logistics</h1>

            <nav
            className="space-y-2">
                {menu.map((item) => {const Icon = item.icon;
                    return (
                        <NavLink key={item.name} to={item.path} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition"> 
                            
                            <Icon size={20}/>
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}

export default Sidebar;
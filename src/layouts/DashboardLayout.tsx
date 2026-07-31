import {Outlet} from "react-router-dom"
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function DashboardLayout() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 bg-slate-100 min-h-screen">
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;
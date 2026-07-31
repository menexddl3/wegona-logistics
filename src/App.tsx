import {BrowserRouter, Routes, Route} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import CustomersPage from "./pages/Customers/CustomersPage";
import DriversPage from "./pages/Drivers/DriversPage";
import VehiclesPage from "./pages/Vehicles/VehiclesPage";
import TripsPage from "./pages/Trips/TripsPage";
import InvoicesPage from "./pages/Invoices/InvoicesPage";
import SettingsPage from "./pages/Settings/SettingsPage";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardLayout/>}>
      <Route index element={<DashboardPage />} />

      <Route path="customers" element={<CustomersPage />} />

      <Route path="drivers" element={<DriversPage />} />
      
      <Route path="vehicles" element={<VehiclesPage />} />

      <Route path="trips" element={<TripsPage />} />

      <Route path="invoices" element={<InvoicesPage />} />

      <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
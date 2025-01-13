import React from 'react';
import TruckManagement from './components/TruckManagement';
import DriverManagment from './components/DriverManagment';
import RoutesManagemnet from "./components/RoutesManagemnet";
import AssignmentManagement from "./components/AssignmentManagement";

const App = () => {
    return (
        <div>
            <TruckManagement />
            <DriverManagment />
            <RoutesManagemnet />
            <AssignmentManagement/>
        </div>
    );
};

export default App;
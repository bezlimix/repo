import React from "react";

const DriverList = ({drivers, fetchDrivers}) =>{
    const deleteDriver = async id => {
        await fetch(`http://localhost:5000/drivers/${id}`, {
            method: 'DELETE',
        });
        fetchDrivers();
    };

    return(
        <ul>
            {drivers.map(driver => (
                <li key = {driver.id}>
                    {driver.first_name} {driver.last_name}: {driver.status}
                    <button onClick={() => deleteDriver(driver.id)}>Delete</button>
                    <button onClick={() => deleteDriver(driver.id)}>ShowInfo</button>
                </li>
            ))

            }
        </ul>
    )
}
import React, { useState, useEffect } from 'react';

const DriverManagement = () => {
    const [drivers, setDrivers] = useState([]);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        license_number: '',
        phone_number: '',
        status: 'available',
    });
    const [errors, setErrors] = useState({});
    const [detailedDriver, setDetailedDriver] = useState(null);

    const fetchDrivers = async () => {
        try {
            const response = await fetch('http://localhost:5000/drivers');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDrivers(data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const validateField = (field, value) => {
        if (!value) {
            return 'This field is required.';
        }
        if ((field === 'first_name' || field === 'last_name') && value.length < 2) {
            return `${field.replace('_', ' ')} must be at least 2 characters long.`;
        }
        if (field === 'license_number' && value.length < 6) {
            return 'License number must be at least 6 characters long.';
        }
        if (field === 'phone_number' && !/^[0-9]{10}$/.test(value)) {
            return 'Phone number must be a valid 10-digit number.';
        }
        return null;
    };

    const validateForm = () => {
        const newErrors = {};
        for (const field in formData) {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addDriver = async () => {
        if (!validateForm()) return;

        try {
            await fetch('http://localhost:5000/drivers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            fetchDrivers();
            setFormData({ first_name: '', last_name: '', license_number: '', phone_number: '', status: 'available' });
            setErrors({});
        } catch (error) {
            console.error('Error adding driver:', error);
        }
    };

    const updateDriver = async (id) => {
        if (!validateForm()) return;

        try {
            await fetch(`http://localhost:5000/drivers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            fetchDrivers();
        } catch (error) {
            console.error('Error updating driver:', error);
        }
    };

    const deleteDriver = async (id) => {
        try {
            await fetch(`http://localhost:5000/drivers/${id}`, {
                method: 'DELETE',
            });
            fetchDrivers();
        } catch (error) {
            console.error('Error deleting driver:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const fetchDriverDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/drivers/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDetailedDriver(data);
        } catch (error) {
            console.error('Error fetching driver details:', error);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    return (
        <div>
            <h1>Driver Management</h1>

            {/* Driver Form */}
            <div>
                <h2>Add / Update Driver</h2>
                <div>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        style={{ borderColor: errors.first_name ? 'red' : '' }}
                    />
                    {errors.first_name && <small style={{ color: 'red' }}>{errors.first_name}</small>}
                </div>
                <div>
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        style={{ borderColor: errors.last_name ? 'red' : '' }}
                    />
                    {errors.last_name && <small style={{ color: 'red' }}>{errors.last_name}</small>}
                </div>
                <div>
                    <input
                        type="text"
                        name="license_number"
                        placeholder="License Number"
                        value={formData.license_number}
                        onChange={handleChange}
                        style={{ borderColor: errors.license_number ? 'red' : '' }}
                    />
                    {errors.license_number && <small style={{ color: 'red' }}>{errors.license_number}</small>}
                </div>
                <div>
                    <input
                        type="text"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        style={{ borderColor: errors.phone_number ? 'red' : '' }}
                    />
                    {errors.phone_number && <small style={{ color: 'red' }}>{errors.phone_number}</small>}
                </div>
                <div>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={{ borderColor: errors.status ? 'red' : '' }}
                    >
                        <option value="available">Available</option>
                        <option value="on_trip">On Trip</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {errors.status && <small style={{ color: 'red' }}>{errors.status}</small>}
                </div>
                <button onClick={addDriver}>Add Driver</button>
            </div>

            {/* Driver List */}
            <div>
                <h2>All Drivers</h2>
                <ul>
                    {drivers.map((driver) => (
                        <li key={driver.id}>
                            {driver.first_name} {driver.last_name} - {driver.license_number} - {driver.phone_number} - {driver.status}
                            <button onClick={() => updateDriver(driver.id)}>Update</button>
                            <button onClick={() => deleteDriver(driver.id)}>Delete</button>
                            <button onClick={() => fetchDriverDetails(driver.id)}>Show Info</button>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Driver Details */}
            {detailedDriver && (
                <div>
                    <h2>Driver Details</h2>
                    <p><strong>ID:</strong> {detailedDriver.id}</p>
                    <p><strong>First Name:</strong> {detailedDriver.first_name}</p>
                    <p><strong>Last Name:</strong> {detailedDriver.last_name}</p>
                    <p><strong>License Number:</strong> {detailedDriver.license_number}</p>
                    <p><strong>Phone Number:</strong> {detailedDriver.phone_number}</p>
                    <p><strong>Status:</strong> {detailedDriver.status}</p>
                    <button onClick={() => setDetailedDriver(null)}>Close Details</button>
                </div>
            )}
        </div>
    );
};

export default DriverManagement;
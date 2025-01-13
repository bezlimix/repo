import React, { useState, useEffect } from 'react';

const RoutesManagement = () => {
    const [routes, setRoutes] = useState([]);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        distance_km: '',
        estimated_time: '',
    });
    const [errors, setErrors] = useState({});

    const fetchRoutes = async () => {
        try {
            const response = await fetch('http://localhost:5000/routes');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRoutes(data);
        } catch (error) {
            console.error('Error fetching routes:', error);
        }
    };

    const validateField = (field, value) => {
        if (!value) {
            return 'This field is required.';
        }
        if ((field === 'origin' || field === 'destination') && value.length < 3) {
            return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least 3 characters long.`;
        }
        if ((field === 'distance_km' || field === 'estimated_time') && (isNaN(value) || value <= 0)) {
            return `${field.replace('_', ' ')} must be a positive number.`;
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

    const addRoute = async () => {
        if (!validateForm()) return;
        try {
            await fetch('http://localhost:5000/routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            fetchRoutes();
            setFormData({ origin: '', destination: '', distance_km: '', estimated_time: '' });
            setErrors({});
        } catch (error) {
            console.error('Error adding route:', error);
        }
    };

    const updateRoute = async (id) => {
        if (!validateForm()) return;
        try {
            await fetch(`http://localhost:5000/routes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            fetchRoutes();
        } catch (error) {
            console.error('Error updating route: ', error);
        }
    };

    const deleteRoute = async (id) => {
        try {
            await fetch(`http://localhost:5000/routes/${id}`, {
                method: 'DELETE',
            });
            fetchRoutes();
        } catch (error) {
            console.error('Error deleting route:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    return (
        <div>
            <h1>Route Management</h1>
            {/* Route Form */}
            <div>
                <h2>Add / Update Route</h2>
                <div>
                    <input
                        type="text"
                        name="origin"
                        placeholder="Origin"
                        value={formData.origin}
                        onChange={handleChange}
                        style={{ borderColor: errors.origin ? 'red' : '' }}
                    />
                    {errors.origin && <small style={{ color: 'red' }}>{errors.origin}</small>}
                </div>
                <div>
                    <input
                        type="text"
                        name="destination"
                        placeholder="Destination"
                        value={formData.destination}
                        onChange={handleChange}
                        style={{ borderColor: errors.destination ? 'red' : '' }}
                    />
                    {errors.destination && <small style={{ color: 'red' }}>{errors.destination}</small>}
                </div>
                <div>
                    <input
                        type="text"
                        name="distance_km"
                        placeholder="Distance (km)"
                        value={formData.distance_km}
                        onChange={handleChange}
                        style={{ borderColor: errors.distance_km ? 'red' : '' }}
                    />
                    {errors.distance_km && <small style={{ color: 'red' }}>{errors.distance_km}</small>}
                </div>
                <div>
                    <input
                        type="text"
                        name="estimated_time"
                        placeholder="Estimated Time (hours)"
                        value={formData.estimated_time}
                        onChange={handleChange}
                        style={{ borderColor: errors.estimated_time ? 'red' : '' }}
                    />
                    {errors.estimated_time && <small style={{ color: 'red' }}>{errors.estimated_time}</small>}
                </div>
                <button onClick={addRoute}>Add Route</button>
            </div>

            {/* Routes List */}
            <div>
                <h2>All Routes</h2>
                <ul>
                    {routes.map((route) => (
                        <li key={route.id}>
                            {route.origin} to {route.destination} - {route.distance_km} km - {route.estimated_time} hours
                            <button onClick={() => updateRoute(route.id)}>Update</button>
                            <button onClick={() => deleteRoute(route.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RoutesManagement;

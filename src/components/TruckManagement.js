import React, { useState, useEffect } from 'react';

const TruckManagement = () => {
  const [trucks, setTrucks] = useState([]);
  const [formData, setFormData] = useState({
    plate_number: '',
    brand: '',
    model: '',
    capacity: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});

  const fetchTrucks = async () => {
    try {
      const response = await fetch('http://localhost:5000/trucks');
      const data = await response.json();
      setTrucks(data);
    } catch (error) {
      console.error('Error fetching trucks:', error);
    }
  };

  const validateField = (field, value) => {
    if (!value) {
      return 'This field is required.';
    }
    if (field === 'capacity' && (isNaN(value) || value <= 0)) {
      return 'Capacity must be a positive number.';
    }
    if (field === 'plate_number' && (value.length >=9)) {
      return 'Plate Number must be max. 8 Symbols.';
    }
    if (field === 'brand' && ((value.toString().length <3))) {
      return 'Brands name must be more than 3 characters.' ;
    }
    if (field === 'model' && ((value.toString().length <3 && value.length<5))) {
      return 'Brands name must be more than 3 characters.' ;
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

  const addTruck = async () => {
    if (!validateForm()) return;

    try {
      await fetch('http://localhost:5000/trucks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      fetchTrucks();
      setFormData({ plate_number: '', brand: '', model: '', capacity: '', status: 'active' });
      setErrors({});
    } catch (error) {
      console.error('Error adding truck:', error);
    }
  };

  const updateTruck = async (id) => {
    if (!validateForm()) return;

    try {
      await fetch(`http://localhost:5000/trucks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      fetchTrucks();
    } catch (error) {
      console.error('Error updating truck:', error);
    }
  };

  const deleteTruck = async (id) => {
    try {
      await fetch(`http://localhost:5000/trucks/${id}`, {
        method: 'DELETE',
      });
      fetchTrucks();
    } catch (error) {
      console.error('Error deleting truck:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  return (
      <div>
        <h1>Truck Management</h1>
        <div>
          <h2>Add / Update Truck</h2>
          <div>
            <input
                type="text"
                name="plate_number"
                placeholder="Plate Number"
                value={formData.plate_number}
                onChange={handleChange}
                style={{ borderColor: errors.plate_number ? 'red' : '' }}
            />
            {errors.plate_number && <small style={{ color: 'red' }}>{errors.plate_number}</small>}
          </div>
          <div>
            <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                style={{ borderColor: errors.brand ? 'red' : '' }}
            />
            {errors.brand && <small style={{ color: 'red' }}>{errors.brand}</small>}
          </div>
          <div>
            <input
                type="text"
                name="model"
                placeholder="Model"
                value={formData.model}
                onChange={handleChange}
                style={{ borderColor: errors.model ? 'red' : '' }}
            />
            {errors.model && <small style={{ color: 'red' }}>{errors.model}</small>}
          </div>
          <div>
            <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={handleChange}
                style={{ borderColor: errors.capacity ? 'red' : '' }}
            />
            {errors.capacity && <small style={{ color: 'red' }}>{errors.capacity}</small>}
          </div>
          <div>
            <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ borderColor: errors.status ? 'red' : '' }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && <small style={{ color: 'red' }}>{errors.status}</small>}
          </div>
          <button onClick={addTruck}>Add Truck</button>
        </div>

        <h2>All Trucks</h2>
        <ul>
          {trucks.map((truck) => (
              <li key={truck.id}>
                {truck.plate_number} - {truck.brand} {truck.model} - {truck.capacity}kg - {truck.status}
                <button onClick={() => updateTruck(truck.id)}>Update</button>
                <button onClick={() => deleteTruck(truck.id)}>Delete</button>
              </li>
          ))}
        </ul>
      </div>
  );
};

export default TruckManagement;
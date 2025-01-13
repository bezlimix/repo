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

  const fetchTrucks = async () => {
    try {
      const response = await fetch('http://localhost:5000/trucks');
      const data = await response.json();
      setTrucks(data);
    } catch (error) {
      console.error('Error fetching trucks:', error);
    }
  };

  const addTruck = async () => {
    try {
      await fetch('http://localhost:5000/trucks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      fetchTrucks();
      setFormData({ plate_number: '', brand: '', model: '', capacity: '', status: 'active' });
    } catch (error) {
      console.error('Error adding truck:', error);
    }
  };

  const updateTruck = async (id) => {
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

  useEffect(() => {
    fetchTrucks();
  }, []);

  return (
    <div>
      <h1>Truck Management</h1>
      <div>
        <h2>Add / Update Truck</h2>
        <input
          type="text"
          name="plate_number"
          placeholder="Plate Number"
          value={formData.plate_number}
          onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
        />
        <select
          name="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
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
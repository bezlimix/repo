import React, { useState, useEffect } from 'react';

const AssignmentManagement = () => {
    const [assignments, setAssignments] = useState([]);
    const [formData, setFormData] = useState({
        truck_id: '',
        driver_id: '',
        route_id: '',
        assignment_date: '',
        status: 'pending',
    });
    const [errors, setErrors] = useState({});
    const [detailedAssignment, setDetailedAssignment] = useState(null);

    const fetchAssignments = async () => {
        try {
            const response = await fetch('http://localhost:5000/assignments');
            const data = await response.json();
            setAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const validateField = async (field, value) => {
        if (!value) {
            return 'This field is required.';
        }
        if (['truck_id', 'driver_id', 'route_id'].includes(field)) {
            const table = field === 'truck_id' ? 'trucks' : field === 'driver_id' ? 'drivers' : 'routes';
            const response = await fetch(`http://localhost:5000/${table}/${value}`);
            if (!response.ok || (await response.json()) === {}) {
                return `Invalid ${field.replace('_', ' ')}`;
            }
        }
        return null;
    };

    const validateForm = async () => {
        const newErrors = {};
        for (const field in formData) {
            const error = await validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFieldValidation = async (e) => {
        const { name, value } = e.target;
        const error = await validateField(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const addAssignment = async () => {
        const isValid = await validateForm();
        if (!isValid) return;

        try {
            await fetch('http://localhost:5000/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            fetchAssignments();
            setFormData({ truck_id: '', driver_id: '', route_id: '', assignment_date: '', status: 'pending' });
            setErrors({});
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        await handleFieldValidation(e); // Проверяем значение поля на ходу
    };

    const fetchAssignmentDetails = async (id) => {
        try{
            const response = await fetch (`http://localhost:5000/assignments/${id}`);
            if (!response.ok){
                throw new Error('HTTP error!');
            }
            const data = await response.json();
            setDetailedAssignment(data);
        } catch(error) {
            console.error('Error fetching!')
        }
    }
    const updateAssignment = async (id) => {
        if (!validateForm()) return;

        try {
            await fetch(`http://localhost:5000/assignments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            fetchAssignments();
        } catch (error) {
            console.error('Error updating driver:', error);
        }
    };

    const deleteAssignment = async (id) => {
        try {
            await fetch(`http://localhost:5000/assignments/${id}`, {
                method: 'DELETE',
            });
            fetchAssignments();
        } catch (error) {
            console.error('Error deleting driver:', error);
        }
    };



    useEffect(() => {
        fetchAssignments();
    }, []);

    return (
        <div>
            <h1>Assignment Management</h1>

            {/* Assignment Form */}
            <div>
                <h2>Add Assignment</h2>
                <div>
                    <input
                        type="text"
                        name="truck_id"
                        placeholder="Truck ID"
                        value={formData.truck_id}
                        onChange={handleChange}
                        style={{ borderColor: errors.truck_id ? 'red' : '' }}
                    />
                    {errors.truck_id && <small style={{ color: 'red' }}>{errors.truck_id}</small>}
                </div>
                <div>
                    <input
                        type="text"
                        name="driver_id"
                        placeholder="Driver ID"
                        value={formData.driver_id}
                        onChange={handleChange}
                        style={{ borderColor: errors.driver_id ? 'red' : '' }}
                    />
                    {errors.driver_id && <small style={{ color: 'red' }}>{errors.driver_id}</small>}
                </div>
                <div>
                    <input
                        type="text"
                        name="route_id"
                        placeholder="Route ID"
                        value={formData.route_id}
                        onChange={handleChange}
                        style={{ borderColor: errors.route_id ? 'red' : '' }}
                    />
                    {errors.route_id && <small style={{ color: 'red' }}>{errors.route_id}</small>}
                </div>
                <div>
                    <input
                        type="date"
                        name="assignment_date"
                        value={formData.assignment_date}
                        onChange={handleChange}
                        style={{ borderColor: errors.assignment_date ? 'red' : '' }}
                    />
                    {errors.assignment_date && <small style={{ color: 'red' }}>{errors.assignment_date}</small>}
                </div>
                <div>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={{ borderColor: errors.status ? 'red' : '' }}
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {errors.status && <small style={{ color: 'red' }}>{errors.status}</small>}
                </div>
                <button onClick={addAssignment}>Add Assignment</button>
            </div>

            {/* Assignment List */}
            <div>
                <h2>All Assignments</h2>
                <ul>
                    {assignments.map((assignment) => (
                        <li key={assignment.id}>
                            Truck: {assignment.truck_id}, Driver: {assignment.driver_id}, Route: {assignment.route_id},
                            Date: {assignment.assignment_date}, Status: {assignment.status}
                            <button onClick={() => updateAssignment(assignment.id)}>Update</button>
                            <button onClick={() => deleteAssignment(assignment.id)}>Delete</button>
                            <button onClick={() => fetchAssignmentDetails(assignment.id)}>Show Info</button>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Assignment Details */}
            {detailedAssignment && (
                <div>
                    <h2>Assignment Details</h2>
                    <p><strong>Truck ID:</strong> {detailedAssignment.truck_id}</p>
                    <p><strong>Driver ID:</strong> {detailedAssignment.driver_id}</p>
                    <p><strong>Route ID:</strong> {detailedAssignment.route_id}</p>
                    <p><strong>Status:</strong> {detailedAssignment.status}</p>
                    <button onClick={() => setDetailedAssignment(null)}>Close Details</button>
                </div>
            )}
        </div>
    );
};

export default AssignmentManagement;

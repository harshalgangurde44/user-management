import React, { useState, useEffect } from "react";
import EmployeeRow from "./EmployeeRow";
import axios from "axios";
import useSearch from "./useSearch"; // Import the custom hook
import "./EmployeeTable.css"; // Adjust the path based on your folder structure

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [genderFilter, setGenderFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State to handle validation errors
  const [errors, setErrors] = useState({});

  // Use the useSearch hook to handle search functionality
  const { filteredData, handleSearch } = useSearch(employees, "");

  useEffect(() => {
    axios.get("http://localhost:5000/employees").then((res) => {
      setEmployees(res.data);
    });
  }, []);

  const sortEmployees = () => {
    const sorted = [...filteredData].sort((a, b) =>
      sortOrder === "asc" ? a.salary - b.salary : b.salary - a.salary
    );
    setEmployees(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filterByGender = (gender) => {
    setGenderFilter(gender);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/employees/${id}`).then(() => {
      setEmployees(employees.filter((emp) => emp.id !== id));
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newEmployee.firstName) newErrors.firstName = "First Name is required";
    if (!newEmployee.lastName) newErrors.lastName = "Last Name is required";
    if (!newEmployee.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(newEmployee.email))
      newErrors.email = "Invalid email format";
    if (!newEmployee.password) newErrors.password = "Password is required";
    else if (newEmployee.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (newEmployee.password !== newEmployee.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSignup = () => {
    if (validateForm()) {
      const newEmployeeData = {
        id: employees.length + 1,
        first_name: newEmployee.firstName,
        last_name: newEmployee.lastName,
        email: newEmployee.email,
        gender: "Not Specified", // You can modify this if you want to include gender input in the form
        salary: 0, // Default salary, you can modify this if needed
      };

      axios
        .post("http://localhost:5000/employees", newEmployeeData)
        .then((res) => {
          setEmployees([...employees, res.data]);
          setIsModalOpen(false); // Close modal after successful signup
          setNewEmployee({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setErrors({});
        })
        .catch((error) => console.error("Error adding employee:", error));
    }
  };

  return (
    <div className="container">
      <h1>User App</h1>
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search by name"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button onClick={sortEmployees}>
          Sort by Salary ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </button>
        <select onChange={(e) => filterByGender(e.target.value)}>
          <option value="">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Agender">Agender</option>
          <option value="Genderfluid">Genderfluid</option>
        </select>
      </div>
      <div className="btn">
        <button onClick={() => setIsModalOpen(true)}>Signup</button>
        <button>Export</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData
            .filter((emp) =>
              genderFilter ? emp.gender === genderFilter : true
            )
            .map((employee) => (
              <EmployeeRow
                key={employee.id}
                employee={employee}
                handleDelete={handleDelete}
              />
            ))}
        </tbody>
      </table>

      {/* Modal for Signup Form */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Sign Up</h2>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={newEmployee.firstName}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, firstName: e.target.value })
                }
              />
              {errors.firstName && (
                <p className="error-message">{errors.firstName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={newEmployee.lastName}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, lastName: e.target.value })
                }
              />
              {errors.lastName && (
                <p className="error-message">{errors.lastName}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={newEmployee.password}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, password: e.target.value })
                }
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={newEmployee.confirmPassword}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    confirmPassword: e.target.value,
                  })
                }
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="modal-buttons">
              <button className="btn1" onClick={handleSignup}>
                Sign Up
              </button>
              <button className="btn2" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;

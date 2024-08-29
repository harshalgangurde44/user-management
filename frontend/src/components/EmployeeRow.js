import React, { useState } from "react";
import axios from "axios";
import "./EmployeeTable.css"; // Adjust the path based on your folder structure

const EmployeeRow = ({ employee, handleDelete }) => {
  const [editable, setEditable] = useState(false);
  const [firstName, setFirstName] = useState(employee.first_name);
  const [lastName, setLastName] = useState(employee.last_name);
  const [email, setEmail] = useState(employee.email);
  const [gender, setGender] = useState(employee.gender);
  const [salary, setSalary] = useState(employee.salary);

  const handleEdit = () => {
    setEditable(!editable);
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:5000/employees/${employee.id}`, {
        first_name: firstName,
        last_name: lastName,
        email,
        gender,
        salary,
      })
      .then(() => setEditable(false));
  };

  return (
    <tr>
      <td>
        {editable ? (
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        ) : (
          firstName
        )}
      </td>
      <td>
        {editable ? (
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        ) : (
          lastName
        )}
      </td>
      <td>
        {editable ? (
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        ) : (
          email
        )}
      </td>
      <td>
        {editable ? (
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Agender">Agender</option>
            <option value="Genderfluid">Genderfluid</option>
          </select>
        ) : (
          gender
        )}
      </td>
      <td>
        {editable ? (
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        ) : (
          salary
        )}
      </td>
      <td>
        {editable ? (
          <button className="save" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="edit" onClick={handleEdit}>
            Edit
          </button>
        )}
        <button className="delete" onClick={() => handleDelete(employee.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default EmployeeRow;

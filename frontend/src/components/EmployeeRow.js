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

  const handleCancel = () => {
    setFirstName(employee.first_name);
    setLastName(employee.last_name);
    setEmail(employee.email);
    setGender(employee.gender);
    setSalary(employee.salary);
    setEditable(false);
  };

  const handleExport = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const fileName = `Employee_Data_${employee.id}_${year}-${month}-${day}.csv`;

    axios
      .get(`http://localhost:5000/employees/export/${employee.id}`, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/csv",
        },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Error exporting CSV:", error);
      });
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
      <td style={{ display: "flex", gap: "12px" }}>
        {!editable && (
          <button className="export" onClick={handleExport}>
            Export
          </button>
        )}
        {editable ? (
          <button className="save" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="edit" onClick={handleEdit}>
            Edit
          </button>
        )}
        {!editable ? (
          <button className="delete" onClick={() => handleDelete(employee.id)}>
            Delete
          </button>
        ) : (
          <button className="cancel" onClick={() => handleCancel()}>
            Cancel
          </button>
        )}
      </td>
    </tr>
  );
};

export default EmployeeRow;

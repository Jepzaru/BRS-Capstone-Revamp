import React, { useState, useEffect } from 'react';
import AdminHeader from '../Admin/AdminHeader';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './AdminNavbar';
import { FaUserGroup } from "react-icons/fa6";
import { MdGroupAdd } from "react-icons/md";
import '../../CSS/AdminCss/AdminModule.css';

const AdminDepartment = () => {
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:8080/department/getAll", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Failed to fetch departments.", error);
    }
  };

  const handleAddDepartment = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/department/post", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newDepartmentName }),
      });

      if (response.ok) {
        console.log("Department added successfully.");
        fetchDepartments();
        closeAddModal();
      } else {
        console.error("Failed to add department.");
      }
    } catch (error) {
      console.error("Failed to add department.", error);
    }
  };

  const handleUpdateDepartment = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/department/update/${selectedDepartment.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newDepartmentName }),
      });

      if (response.ok) {
        console.log("Department updated successfully.");
        fetchDepartments();
        closeUpdateModal();
      } else {
        console.error("Failed to update department.");
      }
    } catch (error) {
      console.error("Failed to update department.", error);
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      const response = await fetch(`http://localhost:8080/department/delete/${selectedDepartment.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        console.log("Department deleted successfully.");
        fetchDepartments();
        closeDeleteModal();
      } else {
        console.error("Failed to delete department.");
      }
    } catch (error) {
      console.error("Failed to delete department.", error);
    }
  };

  const openAddModal = () => {
    setNewDepartmentName("");
    setIsAddAccountModalOpen(true);
  };
  const closeAddModal = () => setIsAddAccountModalOpen(false);

  const openUpdateModal = (department) => {
    setSelectedDepartment(department);
    setNewDepartmentName(department.name);
    setIsUpdateAccountModalOpen(true);
  };
  const closeUpdateModal = () => setIsUpdateAccountModalOpen(false);

  const openDeleteModal = (department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  return (
    <div className="admin">
      <AdminHeader />
      <div className="admin-content1">
        <SideNavbar />
        <div className="admin1">
          <div className="header-with-search">
            <h1>
              <FaUserGroup style={{ marginRight: "15px", color: "#782324" }} />
              Department Management
            </h1>
            <input 
              type="text" 
              placeholder="Search Departments" 
              className="search-bar"
            />
            <button className="add-account-button" onClick={openAddModal}>
              <MdGroupAdd style={{ marginRight: "10px", fontSize: "18px", marginBottom: "-2px" }} />
              Add New Department
            </button>
          </div>
          <div className='accounts-container'>
            <table className="accounts-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Department Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {departments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="no-accounts">No Departments available</td>
                  </tr>
                ) : (
                  departments.map((department) => (
                    <tr key={department.id}>
                      <td>{department.id}</td>
                      <td>{department.name}</td>
                      <td className='action-td'>
                        <button
                          className="admin-update-button"
                          onClick={() => openUpdateModal(department)}
                        >
                          Update
                        </button>
                        <button
                          className="admin-delete-button"
                          onClick={() => openDeleteModal(department)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <img src={logoImage1} alt="Logo" className="admin-logo-image" />
        </div>
      </div>

      {isAddAccountModalOpen && (
        <div className="addacc-modal-overlay" onClick={closeAddModal}>
          <div className="addacc-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Department</h2>
            <form className="addacc-modal-form" onSubmit={handleAddDepartment}>
              <label>Department Name</label>
              <input
                type="text"
                name="name"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                required
              />
              <div className="addacc-modal-buttons">
                <button type="button" onClick={closeAddModal}>Cancel</button>
                <button type="submit">Add Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUpdateAccountModalOpen && (
        <div className="addacc-modal-overlay" onClick={closeUpdateModal}>
          <div className="addacc-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Update Department</h2>
            <form className="addacc-modal-form" onSubmit={handleUpdateDepartment}>
              <label>Department Name</label>
              <input
                type="text"
                name="name"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
              />
              <div className="addacc-modal-buttons">
                <button type="button" onClick={closeUpdateModal}>Cancel</button>
                <button type="submit">Update Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="delete-modal-overlay" onClick={closeDeleteModal}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
            <p>Are you sure you want to delete this Department?</p>
            <div className="delete-modal-buttons">
              <button type="button" onClick={closeDeleteModal}>Cancel</button>
              <button type="button" onClick={handleDeleteDepartment}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartment;

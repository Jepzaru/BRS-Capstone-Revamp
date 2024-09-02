import React, { useState } from 'react';
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

  const openAddModal = () => setIsAddAccountModalOpen(true);
  const closeAddModal = () => setIsAddAccountModalOpen(false);
  const closeUpdateModal = () => setIsUpdateAccountModalOpen(false);
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
              placeholder="Search Accounts" 
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
                <tr>
                  <td>1</td>
                  <td>Example Department</td>
                  <td className='action-td'>
                    <button className="admin-update-button" onClick={() => setIsUpdateAccountModalOpen(true)}>Update</button>
                    <button className="admin-delete-button" onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="no-accounts">No Departments available</td>
                </tr>
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
            <form className="addacc-modal-form">
              <label>Department Name</label>
              <input type="name" name="name" />
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
            <form className="addacc-modal-form">
              <label>Department Name</label>
              <input type="name" name="name" />
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
              <button type="button">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartment;

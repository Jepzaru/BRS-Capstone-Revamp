import React, { useState } from 'react';
import AdminHeader from '../Admin/AdminHeader';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './AdminNavbar';
import { FaUserGroup } from "react-icons/fa6";
import { MdGroupAdd } from "react-icons/md";
import '../../CSS/AdminCss/AdminModule.css';

const AdminModule = () => {
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] = useState(false);
  const accounts = []; 

  const openAddModal = () => setIsAddAccountModalOpen(true);
  const closeAddModal = () => setIsAddAccountModalOpen(false);

  const openUpdateModal = () => setIsUpdateAccountModalOpen(true);
  const closeUpdateModal = () => setIsUpdateAccountModalOpen(false);

  return (
    <div className="admin">
      <AdminHeader />
      <div className="admin-content1">
        <SideNavbar />
        <div className="admin1">
          <div className="header-with-search">
            <h1>
              <FaUserGroup style={{ marginRight: "15px", color: "#782324" }} />
              Account Management
            </h1>
            <input 
              type="text" 
              placeholder="Search Accounts" 
              className="search-bar"
            />
            <button className="add-account-button" onClick={openAddModal}>
              <MdGroupAdd style={{ marginRight: "10px", fontSize: "18px", marginBottom: "-2px" }} />
              Add New Account
            </button>
          </div>
          <div className='accounts-container'>
            <table className="accounts-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length > 0 ? (
                  accounts.map((account, index) => (
                    <tr key={index}>
                      <td>{account.firstName}</td>
                      <td>{account.lastName}</td>
                      <td>{account.department}</td>
                      <td>{account.email}</td>
                      <td>{account.password}</td>
                      <td>{account.role}</td>
                      <td>
                        <button className="admin-update-button" onClick={openUpdateModal}>Update</button>
                        <button className="admin-delete-button">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-accounts">No accounts available</td>
                  </tr>
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
            <h2>Add New Account</h2>
            <form className="addacc-modal-form">
              <label>First Name:</label>
              <input type="text" name="firstName" />
              <label>Last Name:</label>
              <input type="text" name="lastName" />
              <label>Department:</label>
              <input type="text" name="department" />
              <label>Email:</label>
              <input type="email" name="email" />
              <label>Password:</label>
              <input type="password" name="password" />
              <label>Role:</label>
              <input type="text" name="role" />
              <div className="addacc-modal-buttons">
                <button type="button" onClick={closeAddModal}>Cancel</button>
                <button type="submit">Add Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

{isUpdateAccountModalOpen && (
        <div className="addacc-modal-overlay" onClick={closeUpdateModal}>
          <div className="addacc-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Account</h2>
            <form className="addacc-modal-form">
              <label>First Name:</label>
              <input type="text" name="firstName" />
              <label>Last Name:</label>
              <input type="text" name="lastName" />
              <label>Department:</label>
              <input type="text" name="department" />
              <label>Email:</label>
              <input type="email" name="email" />
              <label>Password:</label>
              <input type="password" name="password" />
              <label>Role:</label>
              <input type="text" name="role" />
              <div className="addacc-modal-buttons">
                <button type="button" onClick={closeUpdateModal}>Cancel</button>
                <button type="submit">Update Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModule;

import React, { useEffect, useState } from 'react';
import AdminHeader from '../Admin/AdminHeader';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './AdminNavbar';
import { FaUserGroup } from "react-icons/fa6";
import { MdGroupAdd } from "react-icons/md";
import { departments } from '../Department';
import { user_roles } from '../Roles'; 
import '../../CSS/AdminCss/AdminModule.css';

const AdminModule = () => {
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] = useState(false);
  const [users, setUsers] = useState([]); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const openAddModal = () => setIsAddAccountModalOpen(true);
  const closeAddModal = () => setIsAddAccountModalOpen(false);
  const closeUpdateModal = () => setIsUpdateAccountModalOpen(false);

  const token = localStorage.getItem('token');

  const fetchUsers = async () =>{
    try {
      const response = await fetch("http://localhost:8080/admin/users/read",{
        headers: {"Authorization" : `Bearer ${token}`}
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() =>{
    fetchUsers();
  }, [token])

  const handleAddAccount = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newUser = {
      email: formData.get('email'),
      password: formData.get('password'),
      department: formData.get('department'),
      role: formData.get('role'),
    };
  
    try {
      const response = await fetch("http://localhost:8080/admin/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
  
      if (response.ok) {
        closeAddModal();
        fetchUsers();
      } else {
        console.error("Failed to add user");
      }
    } catch (error) {
      console.error("Failed to add user", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/admin/users/delete/${userToDelete.id}`, {
        method: "DELETE",
        headers: {"Authorization": `Bearer ${token}`}
      });
      if (response.ok) {
        closeDeleteModal();
        fetchUsers(); 
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };  

  const handleUpdateAccount = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedUser = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      department: formData.get('department'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role')
    };
  
    try {
      const response = await fetch(`http://localhost:8080/admin/users/update/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser)
      });
  
      if (response.ok) {
        closeUpdateModal();
        fetchUsers();  
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setIsUpdateAccountModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const getFirstName = (email) => {
    try {
      const [firstName] = email.split('@')[0].split('.');
      return firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : '';
    } catch {
      return '';
    }
  };
  
  const getLastName = (email) => {
    try {
      const [firstName, lastName] = email.split('@')[0].split('.');
      return lastName ? lastName.charAt(0).toUpperCase() + lastName.slice(1) : '';
    } catch {
      return '';
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${getFirstName(user.email)} ${getLastName(user.email)}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
              value={searchQuery}
              onChange={handleSearchChange}
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
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user  => (
                    <tr key={user.id}>
                      <td>{getFirstName(user.email)}</td>
                      <td>{getLastName(user.email)}</td>
                      <td>{user.department}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td className='action-td'>
                        <button className="admin-update-button" onClick={() => openUpdateModal(user)}>Update</button>
                        <button className="admin-delete-button" onClick={() => openDeleteModal(user)}>Delete</button>
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
            <form className="addacc-modal-form" onSubmit={handleAddAccount}>
              <label>Email:</label>
              <input type="email" name="email" />
              <label>Password:</label>
              <input type="password" name="password" />
              <label>Department:</label>
              <select name="department">
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>
              <label>Role:</label>
              <select name="role">
                {user_roles.map((role, index) => (
                  <option key={index} value={role}>{role}</option>
                ))}
              </select>
              <div className="addacc-modal-buttons">
                <button type="button" onClick={closeAddModal}>Cancel</button>
                <button type="submit">Add Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUpdateAccountModalOpen && selectedUser && (
        <div className="addacc-modal-overlay" onClick={closeUpdateModal}>
          <div className="addacc-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Update Account</h2>
            <form className="addacc-modal-form" onSubmit={handleUpdateAccount}>
              <label>First Name:</label>
              <input type="text" name="firstName" defaultValue={selectedUser.firstName} />
              <label>Last Name:</label>
              <input type="text" name="lastName" defaultValue={selectedUser.lastName} />
              <label>Department:</label>
              <select name="department" defaultValue={selectedUser.department}>
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>
              <label>Email:</label>
              <input type="email" name="email" defaultValue={selectedUser.email} />
              <label>Role:</label>
              <select name="role" defaultValue={selectedUser.role}>
                {user_roles.map((role, index) => (
                  <option key={index} value={`ROLE_${role}`}>{role}</option>
                ))}
              </select>
              <div className="addacc-modal-buttons">
                <button type="button" onClick={closeUpdateModal}>Cancel</button>
                <button type="submit">Update Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="delete-modal-overlay" onClick={closeDeleteModal}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete {userToDelete?.firstName} {userToDelete?.lastName}?</p>
            <div className="delete-modal-buttons">
              <button type="button" onClick={closeDeleteModal}>Cancel</button>
              <button type="button" onClick={handleDeleteAccount}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModule;

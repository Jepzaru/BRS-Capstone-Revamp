import React, { useState } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { FaBus } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
import { MdAddCircle, MdOutlineBusAlert } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import '../../CSS/OpcCss/VehicleManagement.css';

const VehicleManagement = () => {
  const vehicles = [];
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [vehicleName, setVehicleName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [maximumCapacity, setMaximumCapacity] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    // You can add any additional logic for search click here if needed
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortVehicle = (requests) => {
    switch (sortOption) {
      case "alphabetical":
        return requests.sort((a, b) => a.reason.localeCompare(b.reason));
      case "ascending":
        return requests.sort((a, b) => a.capacity - b.capacity);
      case "descending":
        return requests.sort((a, b) => b.capacity - a.capacity);
      default:
        return requests;
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsClosing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300); // Match the duration of the slideDown animation
  };

  const handleAddVehicle = () => {
    // Handle adding the new vehicle here
    console.log({ vehicleName, plateNumber, maximumCapacity });
    closeModal();
  };

  return (
    <div className="vehiclemanage">
      <Header />
      <div className={`vehicle-manage-content1 ${isModalOpen ? 'dimmed' : ''}`}>
        <SideNavbar />
        <div className="vehicle1">
          <div className="header-container">
            <h1><FaBus style={{ marginRight: "15px", color: "#782324" }} />Vehicle Management</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Vehicle"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button onClick={handleSearchClick} className="search-button"><IoSearch style={{ marginBottom: "-3px" }} /> Search</button>
              <FaSortAlphaDown style={{ color: "#782324" }} />
              <select onChange={handleSortChange} className="sort-dropdown">
                <option value="">Sort By</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="ascending">Capacity Ascending</option>
                <option value="descending">Capacity Descending</option>
              </select>
              <button className='add-vehicle-btn' onClick={openModal}><MdAddCircle style={{ marginRight: "10px", marginBottom: "-2px" }} />Add new Vehicle</button>
            </div>
          </div>
          <div className='vehicle-list-container'>
            <table className="vehicle-table">
              <thead>
                <tr>
                  <th>Vehicle Name</th>
                  <th>Plate Number</th>
                  <th>Maximum Capacity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-vehicles"><MdOutlineBusAlert style={{fontSize: "24px", marginBottom: "-2px"}}/> No Vehicle Registered</td>
                  </tr>
                ) : (
                  vehicles.map((vehicle, index) => (
                    <tr key={index}>
                      <td>{vehicle.name}</td>
                      <td>{vehicle.plateNumber}</td>
                      <td>{vehicle.capacity}</td>
                      <td>
                        <button className="update-button">Update</button>
                        <button className="delete-button">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <img src={logoImage1} alt="Logo" className="vehicle-logo-image" />
        </div>
      </div>

      {isModalOpen && (
        <div className={`vehicle-modal-overlay ${isClosing ? 'vehicle-modal-closing' : ''}`}>
          <div className={`vehicle-modal ${isClosing ? 'vehicle-modal-closing' : ''}`}>
            <h2>Add New Vehicle <button className="close-vehicle-btn" onClick={closeModal}><IoIosCloseCircle style={{fontSize: "32px", marginBottom: "-8px"}}/></button></h2>
            <div className='add-vehicle-input'>
              <label htmlFor='vehicle-name'>Vehicle Name</label>
            <input
              type="text"
              placeholder="Ex. Coaster"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              className="vehicle-input"
            />
             <label htmlFor='plate number'>Plate Number</label>
            <input
              type="text"
              placeholder="Ex. BYZ-32T"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="vehicle-input"
            />
             <label htmlFor='capacity'>Capacity</label>
            <input
              type="number"
              placeholder="Ex. 50"
              value={maximumCapacity}
              onChange={(e) => setMaximumCapacity(e.target.value)}
              className="vehicle-input"
            />
            <button className="add-vehicle-btn-modal"onClick={handleAddVehicle}>Add Vehicle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;

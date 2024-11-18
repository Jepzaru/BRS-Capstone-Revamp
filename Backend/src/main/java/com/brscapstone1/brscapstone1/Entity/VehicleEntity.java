package com.brscapstone1.brscapstone1.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

import com.brscapstone1.brscapstone1.Constants;

@Entity
@Table(name = Constants.DataAnnotations.VEHICLE)
public class VehicleEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;
  private String vehicleType;
  private String plateNumber;
  private int capacity;
  private String status;
  private LocalDate maintenanceStartDate;
  private LocalDate maintenanceEndDate;
  private String maintenanceDetails;

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getVehicleType() {
    return vehicleType;
  }

  public void setVehicleType(String vehicleType) {
    this.vehicleType = vehicleType;
  }

  public String getPlateNumber() {
    return plateNumber;
  }

  public void setPlateNumber(String plateNumber) {
    this.plateNumber = plateNumber;
  }

  public int getCapacity() {
    return capacity;
  }

  public void setCapacity(int capacity) {
    this.capacity = capacity;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDate getMaintenanceStartDate() {
    return maintenanceStartDate;
  }

  public void setMaintenanceStartDate(LocalDate maintenanceStartDate) {
    this.maintenanceStartDate = maintenanceStartDate;
  }

  public LocalDate getMaintenanceEndDate() {
    return maintenanceEndDate;
  }

  public void setMaintenanceEndDate(LocalDate maintenanceEndDate) {
    this.maintenanceEndDate = maintenanceEndDate;
  }

  public String getMaintenanceDetails() {
    return maintenanceDetails;
}

  public void setMaintenanceDetails(String maintenanceDetails) {
    this.maintenanceDetails = maintenanceDetails;
}

  public VehicleEntity(String vehicleType, String plateNumber, int capacity, String status, LocalDate maintenanceStartDate, LocalDate maintenanceEndDate, String maintenanceDetails) {
    this.vehicleType = vehicleType;
    this.plateNumber = plateNumber;
    this.capacity = capacity;
    this.status = status;
    this.maintenanceStartDate = maintenanceStartDate;
    this.maintenanceEndDate = maintenanceEndDate;
    this.maintenanceDetails = maintenanceDetails;
  }

  public VehicleEntity() {
    super();
  }
}
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
  private String vehicleType = "Unknown";
  private String plateNumber = "N/A";
  private int capacity = 1;
  private String status = "N/A";
  private LocalDate maintenanceStartDate = LocalDate.of(0001, 1, 1);
  private LocalDate maintenanceEndDate = LocalDate.of(0001, 1, 1);
  private String maintenanceDetails = "N/A";

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
    this.vehicleType = vehicleType != null ? vehicleType : "Unknown";
  }

  public String getPlateNumber() {
    return plateNumber;
  }

  public void setPlateNumber(String plateNumber) {
    this.plateNumber = plateNumber != null ? plateNumber : "N/A";
  }

  public int getCapacity() {
    return capacity;
  }

  public void setCapacity(int capacity) {
    this.capacity = capacity > 0 ? capacity : 1;
    ;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status != null ? status : "N/A";
  }

  public LocalDate getMaintenanceStartDate() {
    return maintenanceStartDate;
  }

  public void setMaintenanceStartDate(LocalDate maintenanceStartDate) {
    this.maintenanceStartDate = maintenanceStartDate != null ? maintenanceStartDate : LocalDate.of(0001, 1, 1);
  }

  public LocalDate getMaintenanceEndDate() {
    return maintenanceEndDate;
  }

  public void setMaintenanceEndDate(LocalDate maintenanceEndDate) {
    this.maintenanceEndDate = maintenanceEndDate != null ? maintenanceEndDate : LocalDate.of(1900, 1, 1);
  }

  public String getMaintenanceDetails() {
    return maintenanceDetails;
}

  public void setMaintenanceDetails(String maintenanceDetails) {
    this.maintenanceDetails = maintenanceDetails != null ? maintenanceDetails : "N/A";
  }

  public VehicleEntity(String vehicleType, String plateNumber, int capacity, String status, LocalDate maintenanceStartDate, LocalDate maintenanceEndDate, String maintenanceDetails) {
    this.vehicleType = vehicleType != null ? vehicleType : "Unknown";
    this.plateNumber = plateNumber != null ? plateNumber : "N/A";
    this.capacity = capacity > 0 ? capacity : 1;
    this.status = status != null ? status : "N/A";
    this.maintenanceStartDate = maintenanceStartDate != null ? maintenanceStartDate : LocalDate.of(0001, 1, 1);
    this.maintenanceEndDate = maintenanceEndDate != null ? maintenanceEndDate : LocalDate.of(0001, 1, 1);
    this.maintenanceDetails = maintenanceDetails != null ? maintenanceDetails : "N/A";
  }

  public VehicleEntity() {
    super();
  }
}
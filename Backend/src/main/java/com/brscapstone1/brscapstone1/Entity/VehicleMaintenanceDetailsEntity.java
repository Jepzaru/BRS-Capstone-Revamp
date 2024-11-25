package com.brscapstone1.brscapstone1.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.brscapstone1.brscapstone1.Constants;

@Entity
@Table(name = Constants.DataAnnotations.VEHICLE_MAINTENANCE_DETAILS)
public class VehicleMaintenanceDetailsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = Constants.DataAnnotations.VEHICLE_ID, nullable = false)
    private VehicleEntity vehicle;

    private String vehicleType = "Unknown";
    private String maintenanceDetails = "N/A";
    private String status = "Pending";
    private LocalDate maintenanceStartDate = LocalDate.of(0001, 1, 1);
    private LocalDate maintenanceEndDate = LocalDate.of(0001, 1, 1);
    private Boolean isCompleted = false;

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

    public VehicleEntity getVehicle() {
        return vehicle;
    }

    public void setVehicle(VehicleEntity vehicle) {
        this.vehicle = vehicle;
    }

    public String getMaintenanceDetails() {
        return maintenanceDetails;
    }

    public void setMaintenanceDetails(String maintenanceDetails) {
        this.maintenanceDetails = maintenanceDetails;
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

    public Boolean getIsCompleted() {
        return isCompleted;
    }
    
    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public VehicleMaintenanceDetailsEntity(VehicleEntity vehicle, String vehicleType, String maintenanceDetails, String status, LocalDate maintenanceStartDate, LocalDate maintenanceEndDate, Boolean isCompleted) {
        this.vehicle = vehicle;
        this.vehicleType = (vehicleType != null) ? vehicleType : "Unknown";
        this.maintenanceDetails = (maintenanceDetails != null) ? maintenanceDetails : "N/A";
        this.status = (status != null) ? status : "Pending";
        this.maintenanceStartDate = (maintenanceStartDate != null) ? maintenanceStartDate : LocalDate.of(0001, 1, 1);
        this.maintenanceEndDate = (maintenanceEndDate != null) ? maintenanceEndDate : LocalDate.of(0001, 1, 1);
        this.isCompleted = (isCompleted != null) ? isCompleted : false;
    }

    public VehicleMaintenanceDetailsEntity() {
        this.vehicleType = "Unknown";
        this.maintenanceDetails = "N/A";
        this.status = "Pending";
        this.maintenanceStartDate = LocalDate.of(0001, 1, 1);
        this.maintenanceEndDate = LocalDate.of(0001, 1, 1);
        this.isCompleted = false;
    }
}

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

    private String vehicleType;
    private String maintenanceDetails;
    private String status;
    private LocalDate maintenanceStartDate;
    private LocalDate maintenanceEndDate;
    private Boolean isCompleted = false;

    public VehicleMaintenanceDetailsEntity() {
        super();
    }

    public VehicleMaintenanceDetailsEntity(VehicleEntity vehicle, String vehicleType, String maintenanceDetails, String status, LocalDate maintenanceStartDate, LocalDate maintenanceEndDate, Boolean isCompleted) {
        this.vehicle = vehicle;
        this.vehicleType = vehicleType;
        this.maintenanceDetails = maintenanceDetails;
        this.status = status;
        this.maintenanceStartDate = maintenanceStartDate;
        this.maintenanceEndDate = maintenanceEndDate;
        this.isCompleted = isCompleted;
    }

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
}

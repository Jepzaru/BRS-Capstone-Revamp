package com.brscapstone1.brscapstone1.Entity;

import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "reservation")
public class ReservationEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String transactionId;
    private String typeOfTrip;
    private String destinationTo;
    private String destinationFrom;
    private int capacity;
    private String department;
    private LocalDate schedule;
    private LocalDate returnSchedule;  
    private String vehicleType;
    private String plateNumber;
    private String pickUpTime;
    private String departureTime;
    private String reason;
    private String fileUrl;
    private String status;
    private Boolean opcIsApproved; 
    private Boolean isRejected = false;
    private Boolean headIsApproved;
    private String userName;
    private String feedback;
    private int driverId;
    private String driverName;
    private String rejectedBy;
    
    @OneToMany(orphanRemoval = true)
    @JoinColumn(name = "reservation_id")
    private List<VehicleEntity> vehicles;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReservationVehicleEntity> reservedVehicles;

    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

     public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getTypeOfTrip() {
        return typeOfTrip;
    }

    public void setTypeOfTrip(String typeOfTrip) {
        this.typeOfTrip = typeOfTrip;
    }

    public String getDestinationTo() {
        return destinationTo;
    }

    public void setDestinationTo(String destinationTo) {
        this.destinationTo = destinationTo;
    }

    public String getDestinationFrom() {
        return destinationFrom;
    }

    public void setDestinationFrom(String destinationFrom) {
        this.destinationFrom = destinationFrom;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public LocalDate getSchedule() {
        return schedule;
    }

    public void setSchedule(LocalDate schedule) {
        this.schedule = schedule;
    }

    public LocalDate getReturnSchedule() {
        return returnSchedule;
    }

    public void setReturnSchedule(LocalDate returnSchedule) {
        this.returnSchedule = returnSchedule;
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

    public String getPickUpTime() {
        return pickUpTime;
    }

    public void setPickUpTime(String pickUpTime) {
        this.pickUpTime = pickUpTime;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        if ("Approved".equals(status) && reservedVehicles != null) {
            for (ReservationVehicleEntity vehicle : reservedVehicles) {
                vehicle.setStatus("Approved");
                vehicle.setSchedule(this.schedule);
                vehicle.setReturnSchedule(this.returnSchedule);
                vehicle.setPickUpTime(this.pickUpTime);
                vehicle.setDepartureTime(this.departureTime);
            }
        }
    }

    public Boolean isOpcIsApproved() {
        return opcIsApproved;
    }

    public void setOpcIsApproved(Boolean opcIsApproved) {
        this.opcIsApproved = opcIsApproved;
    }

    public Boolean isRejected() {
        return isRejected;
    }

    public void setRejected(Boolean isRejected) {
        this.isRejected = isRejected;
    }

    public Boolean isHeadIsApproved() {
        return headIsApproved;
    }

    public void setHeadIsApproved(Boolean headIsApproved) {
        this.headIsApproved = headIsApproved;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public int getDriverId() {
        return driverId;
    }

    public void setDriverId(int driverId) {
        this.driverId = driverId;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public List<ReservationVehicleEntity> getReservedVehicles() {
        return reservedVehicles;
    }

    public void setReservedVehicles(List<ReservationVehicleEntity> reservedVehicles) {
        this.reservedVehicles = reservedVehicles;
    }

    public String getRejectedBy() {
        return rejectedBy;
    }

    public void setRejectedBy(String rejectedBy) {
        this.rejectedBy = rejectedBy;
    }

    public ReservationEntity() {
        super();
    }

    public ReservationEntity(String transactionId, String typeOfTrip, String destinationTo, String destinationFrom,
            int capacity, String department, LocalDate schedule, LocalDate returnSchedule, String vehicleType,
            String plateNumber, String pickUpTime, String departureTime, String reason, String fileUrl, String status,
            Boolean opcIsApproved, Boolean isRejected, Boolean headIsApproved, String userName, String feedback,
            int driverId, String driverName, String rejectedBy) {
        this.transactionId = transactionId;
        this.typeOfTrip = typeOfTrip;
        this.destinationTo = destinationTo;
        this.destinationFrom = destinationFrom;
        this.capacity = capacity;
        this.department = department;
        this.schedule = schedule;
        this.returnSchedule = returnSchedule;
        this.vehicleType = vehicleType;
        this.plateNumber = plateNumber;
        this.pickUpTime = pickUpTime;
        this.departureTime = departureTime;
        this.reason = reason;
        this.fileUrl = fileUrl;
        this.status = status;
        this.opcIsApproved = opcIsApproved;
        this.isRejected = isRejected;
        this.headIsApproved = headIsApproved;
        this.userName = userName;
        this.feedback = feedback;
        this.driverId = driverId;
        this.driverName = driverName;
        this.rejectedBy = rejectedBy;
    }
}
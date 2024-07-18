package com.brscapstone1.brscapstone1.Entity;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reservation")
public class ReservationEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String typeOfTrip;
    private String destinationTo;
    private String destinationFrom;
    private int capacity;
    private String department;
    private Date schedule;
    private String vehicleType;
    private String pickUpTime;
    private String departureTime;
    private String reason;
    private String fileName;
    private String fileType;
    private long fileSize;
    private String status;
    private boolean opcIsApproved; 
    private boolean isRejected;
    private boolean headIsApproved;
    private String userName;
    private String feedback;
    private int driverId;
    private String driverName;
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public Date getSchedule() {
        return schedule;
    }

    public void setSchedule(Date schedule) {
        this.schedule = schedule;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
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

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isOpcIsApproved() {
        return opcIsApproved;
    }

    public void setOpcIsApproved(boolean opcIsApproved) {
        this.opcIsApproved = opcIsApproved;
    }

    public boolean isRejected() {
        return isRejected;
    }

    public void setRejected(boolean isRejected) {
        this.isRejected = isRejected;
    }

    public boolean isHeadIsApproved() {
        return headIsApproved;
    }

    public void setHeadIsApproved(boolean headIsApproved) {
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

    public ReservationEntity() {
        super();
    }

    public ReservationEntity(String typeOfTrip, String destinationTo, String 
                            destinationFrom, int capacity, String department, 
                            Date schedule, String vehicleType, String pickUpTime, 
                            String departureTime, String reason, String fileName, 
                            String fileType, long fileSize, String status, 
                            boolean opcIsApproved, boolean isRejected, boolean headIsApproved, 
                            String userName, String feedback, int driverId, String driverName) {
        this.typeOfTrip = typeOfTrip;
        this.destinationTo = destinationTo;
        this.destinationFrom = destinationFrom;
        this.capacity = capacity;
        this.department = department;
        this.schedule = schedule;
        this.vehicleType = vehicleType;
        this.pickUpTime = pickUpTime;
        this.departureTime = departureTime;
        this.reason = reason;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.status = status;
        this.opcIsApproved = opcIsApproved;
        this.isRejected = isRejected;
        this.headIsApproved = headIsApproved;
        this.userName = userName;
        this.feedback = feedback;
        this.driverId = driverId;
        this.driverName = driverName;
    }
}
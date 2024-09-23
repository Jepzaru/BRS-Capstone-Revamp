package com.brscapstone1.brscapstone1.DTO;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

public class ReservedDateDTO {

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate schedule;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate returnSchedule;

    private String pickUpTime;
    private String departureTime;
    private String status;
    private String plateNumber;

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPlateNumber() {
        return plateNumber;
    }

    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }

    public ReservedDateDTO() {
    }

    public ReservedDateDTO(LocalDate schedule, LocalDate returnSchedule, String pickUpTime, String departureTime, String status, String plateNumber) {
        this.schedule = schedule;
        this.returnSchedule = returnSchedule;
        this.pickUpTime = pickUpTime;
        this.departureTime = departureTime;
        this.status = status;
        this.plateNumber = plateNumber;
    }
}
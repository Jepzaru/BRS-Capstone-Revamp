package com.brscapstone1.brscapstone1.DTO;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ReservedDateDTO {

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate schedule;
    private String pickUpTime;
    private String departureTime;
    private String status;

    public LocalDate getSchedule() {
        return schedule;
    }

    public void setSchedule(LocalDate schedule) {
        this.schedule = schedule;
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

    public ReservedDateDTO() {
    }

    public ReservedDateDTO(LocalDate schedule, String pickUpTime, String departureTime, String status) {
        this.schedule = schedule;
        this.pickUpTime = pickUpTime;
        this.departureTime = departureTime;
        this.status = status;
    }

}

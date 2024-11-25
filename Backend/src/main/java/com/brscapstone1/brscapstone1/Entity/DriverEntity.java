package com.brscapstone1.brscapstone1.Entity;

import java.time.LocalDate;

import com.brscapstone1.brscapstone1.Constants;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = Constants.DataAnnotations.DRIVER)
public class DriverEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id; 
  private String driverName;
  private String contactNumber;
  private String status;
  private LocalDate leaveStartDate = LocalDate.of(1900, 1, 1);

  private LocalDate leaveEndDate = LocalDate.of(1900, 1, 1);

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getDriverName() {
    return driverName;
  }

  public void setDriverName(String driverName) {
    this.driverName = driverName;
  }

  public String getContactNumber() {
    return contactNumber;
  }

  public void setContactNumber(String contactNumber) {
    this.contactNumber = contactNumber;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDate getLeaveStartDate() {
    return leaveStartDate;
  }

  public void setLeaveStartDate(LocalDate leaveStartDate) {
    this.leaveStartDate = leaveStartDate;
  }

  public LocalDate getLeaveEndDate() {
    return leaveEndDate;
  }

  public void setLeaveEndDate(LocalDate leaveEndDate) {
    this.leaveEndDate = leaveEndDate;
  }

  public DriverEntity(String driverName, String contactNumber, String status, LocalDate leaveStartDate, LocalDate leaveEndDate) {
    this.driverName = driverName;
    this.contactNumber = contactNumber;
    this.status = status;
    this.leaveStartDate = (leaveStartDate != null) ? leaveStartDate : LocalDate.of(0001, 1, 1);
    this.leaveEndDate = (leaveEndDate != null) ? leaveEndDate : LocalDate.of(0001, 1, 1);
  }

  public DriverEntity() {
    this.leaveStartDate = LocalDate.of(0001, 1, 1);
    this.leaveEndDate = LocalDate.of(0001, 1, 1);
  }
}

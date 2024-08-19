package com.brscapstone1.brscapstone1.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicle")
public class VehicleEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;
  private String vehicleType;
  private String plateNumber;
  private int capacity;
  private String status;
  
  // Remove the vehicleImage field
  // @Lob
  // private byte[] vehicleImage;

  // Getters and Setters for all fields excluding vehicleImage

  // Other getters and setters
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

  // Remove the getter and setter for vehicleImage
  // public byte[] getVehicleImage() {
  //   return vehicleImage;
  // }

  // public void setVehicleImage(byte[] vehicleImage) {
  //   this.vehicleImage = vehicleImage;
  // }

  public VehicleEntity(String vehicleType, String plateNumber, int capacity, String status) {
    this.vehicleType = vehicleType;
    this.plateNumber = plateNumber;
    this.capacity = capacity;
    this.status = status;
  }

  public VehicleEntity() {
    super();
  }
}

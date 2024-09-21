package com.brscapstone1.brscapstone1.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.brscapstone1.brscapstone1.DTO.ReservedDateDTO;
import com.brscapstone1.brscapstone1.Entity.ReservationEntity;
import com.brscapstone1.brscapstone1.Entity.ReservationVehicleEntity;
import com.brscapstone1.brscapstone1.Entity.VehicleEntity;
import com.brscapstone1.brscapstone1.Repository.ReservationRepository;
import com.brscapstone1.brscapstone1.Repository.ReservationVehicleRepository;
import com.brscapstone1.brscapstone1.Repository.VehicleRepository;

@Service
public class ReservationService {
    
    @Autowired
    private ReservationRepository resRepo;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ReservationVehicleRepository reservationVehicleRepository;

    public String generateTransactionId() {
    return UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "-" +
           UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "-" +
           UUID.randomUUID().toString().substring(0, 6).toUpperCase();
}

    //[POST] approved reservations by HEAD
    public void headApproveReservation(int reservationId) {
        ReservationEntity reservation = resRepo.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        reservation.setHeadIsApproved(true); 
        resRepo.save(reservation);
    }

    //[POST] approved reservations by OPC
    public void opcApproveReservation(int reservationId, int driverId, String driverName) {
        ReservationEntity reservation = resRepo.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        
        if(reservation.getDriverName() == null || reservation.getDriverName().isEmpty()) {
            reservation.setDriverName("No driver assign");
        }
        reservation.setStatus("Approved");
        reservation.setOpcIsApproved(true); 
        reservation.setDriverId(driverId);
        reservation.setDriverName(driverName);
        resRepo.save(reservation);
    }

    //[isRejected] rejects a reservation and returns boolean output
    public void rejectReservation(int reservationId, String feedback) {
        ReservationEntity reservation = resRepo.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        reservation.setStatus("Rejected");
        reservation.setRejected(true); 
        reservation.setFeedback(feedback);
        resRepo.save(reservation);
    }
    //save reservation || with multiple vehicle
   public ReservationEntity saveReservation(String userName, ReservationEntity reservation, List<Integer> vehicleIds, MultipartFile file) throws IOException {
    
        if (file != null && !file.isEmpty()) {
            reservation.setFileUrl(reservation.getFileUrl());
        } else {
            reservation.setFileUrl("No file(s) attached");
        }

        if (reservation.getStatus() == null || reservation.getStatus().isEmpty()) {
            reservation.setStatus("Pending");
        }
        if (reservation.getFeedback() == null || reservation.getFeedback().isEmpty()) {
            reservation.setFeedback("No feedback");
        }
        reservation.setUserName(userName);
        reservation.setTransactionId(generateTransactionId());

        ReservationEntity savedReservation = resRepo.save(reservation);

        List<VehicleEntity> vehicles = vehicleRepository.findAllById(vehicleIds);

        for (VehicleEntity vehicle : vehicles) {
            ReservationVehicleEntity reservationVehicle = new ReservationVehicleEntity();
            reservationVehicle.setReservation(savedReservation);
            reservationVehicle.setVehicleType(vehicle.getVehicleType());
            reservationVehicle.setPlateNumber(vehicle.getPlateNumber()); 
            reservationVehicle.setCapacity(vehicle.getCapacity());
            reservationVehicleRepository.save(reservationVehicle);
        }


        return savedReservation;
    }

    //[GET] all Reservations
    public List<ReservationEntity> getAllReservations() {
        return resRepo.findAll();
    }

    //[GET] all Reservations by their ID
    public ReservationEntity getReservationById(int id) {
        return resRepo.findById(id).orElse(null);
    }

    //[GET] all user's reservations
    public List<ReservationEntity> getUserReservations(String userName) {
        return resRepo.findByUserName(userName);
    }

    //[POST] || add assigned driver
    public void updateAssignedDriver(int reservationId, int driverId, String assignedDriverName) {
        ReservationEntity reservation = resRepo.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        reservation.setDriverId(driverId);
        reservation.setDriverName(assignedDriverName);
        resRepo.save(reservation);
    }

    //[PUT] || update reservations
    public ReservationEntity updateReservation(int reservationId, ReservationEntity updatedReservation, MultipartFile file) throws IOException {
        ReservationEntity existingReservation = resRepo.findById(reservationId)
            .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        
        if (updatedReservation.getTypeOfTrip() != null) existingReservation.setTypeOfTrip(updatedReservation.getTypeOfTrip());
        if (updatedReservation.getDestinationTo() != null) existingReservation.setDestinationTo(updatedReservation.getDestinationTo());
        if (updatedReservation.getDestinationFrom() != null) existingReservation.setDestinationFrom(updatedReservation.getDestinationFrom());
        if (updatedReservation.getCapacity() > 0) existingReservation.setCapacity(updatedReservation.getCapacity()); 
        if (updatedReservation.getDepartment() != null) existingReservation.setDepartment(updatedReservation.getDepartment());
        if (updatedReservation.getSchedule() != null) existingReservation.setSchedule(updatedReservation.getSchedule());
        if (updatedReservation.getVehicleType() != null) existingReservation.setVehicleType(updatedReservation.getVehicleType());
        if (updatedReservation.getPickUpTime() != null) existingReservation.setPickUpTime(updatedReservation.getPickUpTime());
        if (updatedReservation.getDepartureTime() != null) existingReservation.setDepartureTime(updatedReservation.getDepartureTime());
        if (updatedReservation.getReason() != null) existingReservation.setReason(updatedReservation.getReason());
        if (updatedReservation.getStatus() != null) existingReservation.setStatus(updatedReservation.getStatus());
        if (updatedReservation.isOpcIsApproved() != null) existingReservation.setOpcIsApproved(updatedReservation.isOpcIsApproved());
        if (updatedReservation.isRejected() != null) existingReservation.setRejected(updatedReservation.isRejected());
        if (updatedReservation.isHeadIsApproved() != null) existingReservation.setHeadIsApproved(updatedReservation.isHeadIsApproved());
        if (updatedReservation.getUserName() != null) existingReservation.setUserName(updatedReservation.getUserName());
        if (updatedReservation.getFeedback() != null) existingReservation.setFeedback(updatedReservation.getFeedback());
        if (updatedReservation.getDriverId() > 0) existingReservation.setDriverId(updatedReservation.getDriverId()); 
        if (updatedReservation.getDriverName() != null) existingReservation.setDriverName(updatedReservation.getDriverName());
    
        return resRepo.save(existingReservation);
    }

    //[GET] all OPC approved
    public List<ReservationEntity> getOpcApprovedReservation() {
        return resRepo.findByOpcIsApproved(true);
    }

    //[GET] all reservations that is approved by HEAD
    public List<ReservationEntity> getHeadApprovedReservations() {
        return resRepo.findByHeadIsApproved(true);
    }
    
    //fetchinge reserved dates and time
    public List<ReservedDateDTO> getAllReservedDatesByPlateNumber(String plateNumber) {
        List<ReservationEntity> reservations = resRepo.findByPlateNumber(plateNumber);
        return reservations.stream()
            .filter(res -> "Approved".equals(res.getStatus()))
            .map(res -> new ReservedDateDTO(
                res.getSchedule(),
                res.getReturnSchedule(),
                res.getPickUpTime(),
                res.getDepartureTime(),
                res.getStatus(),
                res.getPlateNumber()
            ))
            .collect(Collectors.toList());
    }

    public List<ReservedDateDTO> getReservationsByPlateAndDate(String plateNumber, LocalDate date) {
        List<ReservationEntity> reservations = resRepo.findByPlateNumberAndDate(plateNumber, date);
        return reservations.stream()
            .filter(res -> "Approved".equals(res.getStatus()))
            .map(res -> new ReservedDateDTO(
                res.getSchedule(),
                res.getReturnSchedule(),
                res.getPickUpTime(),
                res.getDepartureTime(),
                res.getStatus(),
                res.getPlateNumber()
            ))
            .collect(Collectors.toList());
    }

    //[DELETE] a reservation
    public String delete(int id){
        String msg = "";

        if(resRepo.findById(id).isPresent()){
            resRepo.deleteById(id);
            
            msg = "Reservation with id " +id+ " is successfully deleted.";
        }else{
            msg = "Reservation with id " +id+ " does not exist.";
        }
        return msg;
    }


    
}
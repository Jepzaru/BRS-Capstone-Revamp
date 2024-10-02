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
        ReservationEntity reservation = resRepo.findById(reservationId)
            .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
    
        // Check if driver name is set
        if (reservation.getDriverName() == null || reservation.getDriverName().isEmpty()) {
            reservation.setDriverName("No driver assigned");
        }
    
        // Set the reservation status to "Approved"
        reservation.setStatus("Approved");
        reservation.setOpcIsApproved(true);
        reservation.setDriverId(driverId);
        reservation.setDriverName(driverName);
    
        // Fetch associated ReservationVehicleEntities
        List<ReservationVehicleEntity> reservationVehicles = reservationVehicleRepository.findByReservation(reservation);
        for (ReservationVehicleEntity vehicle : reservationVehicles) {
            vehicle.setStatus("Approved");  // Update vehicle status to "Approved"
            reservationVehicleRepository.save(vehicle);  // Save each vehicle with updated status
        }
    
        resRepo.save(reservation);  // Save the reservation
    }
    
    //[POST] approved reservations
    public void assignDriverToAddedVehicles(int reservationId, String plateNumber, int driverId, String driverName) {
        // Find the vehicle by reservation ID and plate number
        ReservationVehicleEntity vehicle = reservationVehicleRepository
                .findByReservationIdAndPlateNumber(reservationId, plateNumber)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    
        vehicle.setDriverId(driverId);
        vehicle.setDriverName(driverName);
    
        // Save the updated vehicle entity
        reservationVehicleRepository.save(vehicle);
    }
    
    //[isRejected] rejects a reservation and returns boolean output
    public void rejectReservation(int reservationId, String feedback) {
        ReservationEntity reservation = resRepo.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        reservation.setStatus("Rejected");
        reservation.setRejected(true); 
        reservation.setFeedback(feedback);
        resRepo.save(reservation);
    }

    public ReservationEntity saveReservation(String userName, ReservationEntity reservation, List<Integer> vehicleIds, String fileUrl) throws IOException {
        if (fileUrl != null && !fileUrl.isEmpty()) {
            reservation.setFileUrl(fileUrl); 
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
    
            // Inherit scheduling details from the reservation
            reservationVehicle.setSchedule(reservation.getSchedule());
            reservationVehicle.setReturnSchedule(reservation.getReturnSchedule());
            reservationVehicle.setPickUpTime(reservation.getPickUpTime());
            reservationVehicle.setDepartureTime(reservation.getDepartureTime());
            reservationVehicle.setStatus(reservation.getStatus());
    
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

    //[PUT] update a reservation
    public ReservationEntity updateReservation(int reservationId, ReservationEntity updatedReservation, MultipartFile file, boolean isResending) throws IOException {
        ReservationEntity existingReservation = resRepo.findById(reservationId)
            .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
    
        if (isResending) {
            existingReservation.setRejected(false);
            existingReservation.setStatus("Pending");
    
            if ("OPC".equals(existingReservation.getRejectedBy())) {
                existingReservation.setOpcIsApproved(false);
            } else if ("Head".equals(existingReservation.getRejectedBy())) {
                existingReservation.setHeadIsApproved(false);
            }
        } else {
            if (updatedReservation.isRejected() != null && updatedReservation.isRejected()) {
                if (updatedReservation.isOpcIsApproved() != null && !updatedReservation.isOpcIsApproved()) {
                    existingReservation.setRejectedBy("OPC");
                } else if (updatedReservation.isHeadIsApproved() != null && !updatedReservation.isHeadIsApproved()) {
                    existingReservation.setRejectedBy("Head");
                }
            }
            updateFields(existingReservation, updatedReservation);
            
            if (updatedReservation.getDriverId() > 0) {
                existingReservation.setDriverId(updatedReservation.getDriverId());
                existingReservation.setDriverName(updatedReservation.getDriverName());
            }

            if (updatedReservation.getReservedVehicles() != null) {
                for (ReservationVehicleEntity updatedVehicle : updatedReservation.getReservedVehicles()) {
                    for (ReservationVehicleEntity existingVehicle : existingReservation.getReservedVehicles()) {
                        if (existingVehicle.getId() == updatedVehicle.getId()) {
                            existingVehicle.setDriverId(updatedVehicle.getDriverId());
                            existingVehicle.setDriverName(updatedVehicle.getDriverName());
                        }
                    }
                }
            }
        }
        return resRepo.save(existingReservation);
    }
    
    //Update method to be call in the update reservation
    private void updateFields(ReservationEntity existingReservation, ReservationEntity updatedReservation) {
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
    }    

    //[GET] all OPC approved
    public List<ReservationEntity> getOpcApprovedReservation() {
        return resRepo.findByOpcIsApproved(true);
    }

    //[GET] all reservations that is approved by HEAD
    public List<ReservationEntity> getHeadApprovedReservations() {
        return resRepo.findByHeadIsApproved(true);
    }
    
    //fetchinge reserved dates of the multiple availability
    public List<ReservedDateDTO> getAllReservedDatesByPlateNumber(String plateNumber) {
        List<ReservationVehicleEntity> reservedVehicles = reservationVehicleRepository.findByPlateNumber(plateNumber);
        return reservedVehicles.stream()
        .filter(vehicle -> "Approved".equals(vehicle.getStatus()))
            .map(vehicle -> new ReservedDateDTO(
                vehicle.getSchedule(),
                vehicle.getReturnSchedule(),
                vehicle.getPickUpTime(),
                vehicle.getDepartureTime(),
                vehicle.getReservation().getStatus(),
                vehicle.getPlateNumber()
            ))
            .collect(Collectors.toList());
    }

    //fetchinge reserved dates of reserved vehicle on reservation
    public List<ReservedDateDTO> getAllReservationDatesByPlateNumber(String plateNumber) {
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

    //fetching time of the main vehicle
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

    public List<ReservedDateDTO> getReservedByPlateAndDate(String plateNumber, LocalDate date) {
        List<ReservationVehicleEntity> reservedVehicles = reservationVehicleRepository.findByPlateNumberAndSchedule(plateNumber, date);
        return reservedVehicles.stream()
            .filter(vehicle -> "Approved".equals(vehicle.getStatus()) && vehicle.getSchedule().equals(date))
            .map(vehicle -> new ReservedDateDTO(
                vehicle.getSchedule(),
                vehicle.getReturnSchedule(),
                vehicle.getPickUpTime(),
                vehicle.getDepartureTime(),
                vehicle.getReservation().getStatus(),
                vehicle.getPlateNumber()
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

    //Fetch the platenumbers of the multiple vehicles being reserved
    public List<ReservedDateDTO> getPlateNumbersByScheduleOrReturnSchedule(LocalDate schedule, LocalDate returnSchedule) {
        List<ReservationVehicleEntity> reservedVehicles = reservationVehicleRepository.findByScheduleOrReturnSchedule(schedule, returnSchedule);
    
        return reservedVehicles.stream()
            .map(vehicle -> new ReservedDateDTO(
                vehicle.getSchedule(),
                vehicle.getReturnSchedule(),
                vehicle.getPickUpTime(),
                vehicle.getDepartureTime(),
                vehicle.getReservation().getStatus(), 
                vehicle.getPlateNumber()
            ))
            .collect(Collectors.toList());
    }
    
    public List<ReservedDateDTO> getMainPlateNumbersByScheduleOrReturnSchedule(LocalDate schedule, LocalDate returnSchedule) {
        List<ReservationEntity> reservations = resRepo.findByMainScheduleOrReturnSchedule(schedule, returnSchedule); 
        
        return reservations.stream()
            .map(reservation -> new ReservedDateDTO(
                reservation.getSchedule(),
                reservation.getReturnSchedule(),
                reservation.getPickUpTime(),
                reservation.getDepartureTime(),
                reservation.getStatus(), 
                reservation.getPlateNumber()
            ))
            .collect(Collectors.toList());
    } 

    //Resend Reservation
    public ReservationEntity resendReservation(int reservationId, ReservationEntity updatedReservation, MultipartFile file, boolean isResending) throws IOException {
        ReservationEntity existingReservation = resRepo.findById(reservationId)
            .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
    
        if (isResending) {
            existingReservation.setRejected(false);
            existingReservation.setStatus("Pending");  
    
            if ("OPC".equals(existingReservation.getRejectedBy())) {
                existingReservation.setOpcIsApproved(false);
                existingReservation.setRejectedBy(null);  
            } else if ("Head".equals(existingReservation.getRejectedBy())) {
                existingReservation.setHeadIsApproved(false);
                existingReservation.setRejectedBy(null);  
            }
        } else {
            if (updatedReservation.isRejected() != null && updatedReservation.isRejected()) {
                if (updatedReservation.isOpcIsApproved() != null && !updatedReservation.isOpcIsApproved()) {
                    existingReservation.setRejectedBy("OPC");
                } else if (updatedReservation.isHeadIsApproved() != null && !updatedReservation.isHeadIsApproved()) {
                    existingReservation.setRejectedBy("Head");
                }
            }
            updateFields(existingReservation, updatedReservation);  
    
            if (updatedReservation.getDriverId() > 0) {
                existingReservation.setDriverId(updatedReservation.getDriverId());
                existingReservation.setDriverName(updatedReservation.getDriverName());
            }
    
            if (updatedReservation.getReservedVehicles() != null) {
                for (ReservationVehicleEntity updatedVehicle : updatedReservation.getReservedVehicles()) {
                    for (ReservationVehicleEntity existingVehicle : existingReservation.getReservedVehicles()) {
                        if (existingVehicle.getId() == updatedVehicle.getId()) {
                            existingVehicle.setDriverId(updatedVehicle.getDriverId());
                            existingVehicle.setDriverName(updatedVehicle.getDriverName());
                        }
                    }
                }
            }
        }
        return resRepo.save(existingReservation);
    }
}
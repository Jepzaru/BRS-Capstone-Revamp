package com.brscapstone1.brscapstone1.Controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.brscapstone1.brscapstone1.Constants;
import com.brscapstone1.brscapstone1.DTO.ReservedDateDTO;
import com.brscapstone1.brscapstone1.Entity.ReservationEntity;
import com.brscapstone1.brscapstone1.Entity.ReservationVehicleEntity;
import com.brscapstone1.brscapstone1.Service.ReservationService;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.persistence.EntityNotFoundException;

@RestController
@CrossOrigin
public class ReservationController {

    @Autowired
    private ReservationService resServ;

    //[POST] approved reservations by HEAD
    @PostMapping(Constants.ApiRoutes.APPROVED_BY_HEAD)
    public ResponseEntity<String> headApproveReservation(@PathVariable int reservationId) {
        try {
            resServ.headApproveReservation(reservationId);
            return ResponseEntity.ok(Constants.ResponseMessages.HEAD_APPROVED_SUCCESS);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ResponseMessages.INVALID_RESERVATION + e.getMessage());
        }
    }

    //[POST] approved reservations by OPC
    @PostMapping(Constants.ApiRoutes.APPROVED_BY_OPC)
    public ResponseEntity<String> opcApproveReservation(@PathVariable int reservationId, @RequestParam int driverId, @RequestParam String driverName) {
        try {
            resServ.opcApproveReservation(reservationId, driverId, driverName);
            return ResponseEntity.ok(Constants.ResponseMessages.OPC_APPROVED_SUCCESS);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ResponseMessages.INVALID_RESERVATION + e.getMessage());
        }
    }

    @PutMapping(Constants.ApiRoutes.ASSIGN_DRIVER)
    public ResponseEntity<String> assignDriverToReservation(
        @PathVariable int reservationId,
        @PathVariable String plateNumber,  
        @RequestBody ReservationVehicleEntity vehicleDetails) {
        try {
            resServ.assignDriverToAddedVehicles(reservationId, plateNumber, vehicleDetails.getDriverId(), vehicleDetails.getDriverName());
            return ResponseEntity.ok(Constants.ResponseMessages.DRIVER_ASSIGN_SUCCESS);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Constants.ResponseMessages.INVALID_DRIVER_ASSIGNMENT + e.getMessage());
        }
    }   

    //[isRejected] rejects a reservation and returns boolean output
    @PostMapping(Constants.ApiRoutes.REJECT_RESERVATION)
    public ResponseEntity<String> rejectReservation(@PathVariable int reservationId, @RequestBody String feedback) {
        try {
            resServ.rejectReservation(reservationId, feedback);
            return ResponseEntity.ok(Constants.ResponseMessages.RESERVATION_REJECT_SUCCESS);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ResponseMessages.INVALID_RESERVATION_REJECTION + e.getMessage());
        }
    }

    //[POST] || submits a reservation
    @PostMapping(Constants.ApiRoutes.ADD_RESERVATION)
    public ReservationEntity addReservation(
        @RequestParam(Constants.Annotation.USERNAME) String userName, 
        @RequestParam(value = Constants.Annotation.FILE_URLS, required = false) String fileUrl, 
        @RequestParam(Constants.Annotation.RESERVATION) String reservationJson, 
        @RequestParam(Constants.Annotation.VEHICLE_ID) List<Integer> vehicleIds
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false); 
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false); 
        objectMapper.registerModule(new JavaTimeModule());

        ReservationEntity reservation = objectMapper.readValue(reservationJson, ReservationEntity.class);

        return resServ.saveReservation(userName, reservation, vehicleIds, fileUrl);
    }

    //[GET] all Reservations
    @GetMapping(Constants.ApiRoutes.GET_ALL_RESERVATION)
    public List<ReservationEntity> getAllReservations() {
        return resServ.getAllReservations();
    }

    //[GET] Reservation by ID
    @GetMapping(Constants.ApiRoutes.GET_BY_ID_RESERVATION)
    public ReservationEntity getReservationById(@PathVariable(Constants.Annotation.ID) int id) {
        return resServ.getReservationById(id);
    }

    //[GET] all user's reservations
    @GetMapping(Constants.ApiRoutes.GET_BY_USER_RESERVATION)
    public ResponseEntity<List<ReservationEntity>> getUserReservations(@PathVariable String userName) {
      try {
        List<ReservationEntity> userReservations = resServ.getUserReservations(userName);
        return ResponseEntity.ok(userReservations);
      } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
      }
    }

     //[POST] || update assigned driver
     @PostMapping(Constants.ApiRoutes.UPDATE_ASSIGNED_DRIVER)
     public ResponseEntity<String> updateAssignedDriver(@PathVariable int reservationId, @RequestParam int driverId, @RequestParam String assignedDriverName) {
         try {
             resServ.updateAssignedDriver(reservationId, driverId, assignedDriverName);
             return ResponseEntity.ok(Constants.ResponseMessages.DRIVER_ASSIGN_UPDATE_SUCCESS);
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ResponseMessages.INVALID_ASSIGN_DRIVER_UPDATE + e.getMessage());
         }
     }
     
     // [PUT] update reservation
     @PutMapping(Constants.ApiRoutes.UPDATE_RESERVATION)
     public ResponseEntity<ReservationEntity> updateReservation(@PathVariable int reservationId,
                                                                 @RequestBody ReservationEntity updatedReservation,
                                                                 @RequestParam(value = Constants.Annotation.FILE, required = false) MultipartFile file,
                                                                 @RequestParam(value = Constants.Annotation.RESENDING, defaultValue = Constants.Annotation.FALSE) boolean isResending) {
         try {
             ReservationEntity updatedEntity = resServ.updateReservation(reservationId, updatedReservation, file, isResending);
             return ResponseEntity.ok(updatedEntity);
         } catch (IOException e) {
             e.printStackTrace();
             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
         } catch (IllegalArgumentException e) {
             e.printStackTrace();
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
         } catch (Exception e) {
             e.printStackTrace();
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
         }
     }

    //[GET] all OPC approved
    @GetMapping(Constants.ApiRoutes.GET_OPC_APPROVED)
    public List<ReservationEntity> getOpcApprovedReservations() {
        return resServ.getOpcApprovedReservation();
    }

    //[GET] all reservations that is approved by HEAD
    @GetMapping(Constants.ApiRoutes.GET_HEAD_APPROVED)
    public List<ReservationEntity> getApprovedReservations() {
        return resServ.getHeadApprovedReservations();
    }

    //Availability date of vehicles
    @GetMapping(Constants.ApiRoutes.VEHICLE_AVAILABILITY)
    public ResponseEntity<List<ReservedDateDTO>> checkVehicleReservation(
        @RequestParam String plateNumber) {

        List<ReservedDateDTO> filteredDates = resServ.getAllReservationDatesByPlateNumber(plateNumber);
        return ResponseEntity.ok(filteredDates);
    }

    //Availability date of multiple vehicles
    @GetMapping(Constants.ApiRoutes.MULTIPLE_VEHICLE_AVAILABILITY)
    public ResponseEntity<List<ReservedDateDTO>> checkMultipleVehicleReservation(
        @RequestParam String plateNumber) {

        List<ReservedDateDTO> filteredDates = resServ.getAllReservedDatesByPlateNumber(plateNumber);
        return ResponseEntity.ok(filteredDates);
    }

    //GET reserve date and time
    @GetMapping(Constants.ApiRoutes.SINGLE_RESERVED_DATE_AND_TIME)
    public ResponseEntity<List<ReservedDateDTO>> getReservationsByPlateAndDate(
        @RequestParam String plateNumber,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<ReservedDateDTO> reservations = resServ.getReservationsByPlateAndDate(plateNumber, date);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping(Constants.ApiRoutes.MULTIPLE_RESERVED_DATE_AND_TIME)
    public ResponseEntity<List<ReservedDateDTO>> getReservedByPlateAndDate(
        @RequestParam String plateNumber,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<ReservedDateDTO> reservations = resServ.getReservedByPlateAndDate(plateNumber, date);
        return ResponseEntity.ok(reservations);
    }
    
    //DELETE
    @DeleteMapping(Constants.ApiRoutes.DELETE_RESERVATION)
    public ResponseEntity<String> delete(@PathVariable int id){
        return ResponseEntity.ok((resServ.delete(id)));
    }
    
    //Fetches multiple platenumbers 
    @GetMapping(Constants.ApiRoutes.PMULTIPLE_PLATE_NUMBER)
    public List<ReservedDateDTO> getPlateNumbersByScheduleOrReturnSchedule(
            @RequestParam LocalDate schedule,
            @RequestParam(required = false) LocalDate returnSchedule) {
        return resServ.getPlateNumbersByScheduleOrReturnSchedule(schedule, returnSchedule);
    }

    //Fetches main platenumbers
    @GetMapping(Constants.ApiRoutes.MAIN_PLATE_NUMBER)
    public List<ReservedDateDTO> getMainPlateNumbersByScheduleOrReturnSchedule(
            @RequestParam LocalDate schedule,
            @RequestParam(required = false) LocalDate returnSchedule) {
        return resServ.getMainPlateNumbersByScheduleOrReturnSchedule(schedule, returnSchedule);
    } 

    //Resend Reservation
    @PutMapping(Constants.ApiRoutes.RESEND_RESERVATION)
    public ResponseEntity<ReservationEntity> resendReservationRequest(
            @PathVariable int reservationId,
            @RequestBody ReservationEntity updatedReservation,
            @RequestParam(value = Constants.Annotation.FILE_URLS, required = false) String fileUrl) {
        try {
            ReservationEntity updatedEntity = resServ.resendReservationStatus(reservationId, updatedReservation, fileUrl);
            return ResponseEntity.ok(updatedEntity);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // [PUT] Complete a reservation
    @PutMapping(Constants.ApiRoutes.COMPLETE_RESERVATION)
    public ResponseEntity<String> completeReservation(@PathVariable int reservationId) {
        try {
            ReservationEntity completedReservation = resServ.completeReservation(reservationId);
            
            return ResponseEntity.ok(Constants.ResponseMessages.RESERVATION_COMPLETE_SUCCESS + completedReservation.getId());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Constants.ResponseMessages.NOT_FOUND_RESERVATION + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Constants.ResponseMessages.INVALID_COMPELTE_RESERVATION + e.getMessage());
        }
    }
}
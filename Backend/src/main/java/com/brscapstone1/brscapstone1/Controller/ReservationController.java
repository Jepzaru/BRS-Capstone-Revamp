package com.brscapstone1.brscapstone1.Controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.brscapstone1.brscapstone1.DTO.ReservedDateDTO;
import com.brscapstone1.brscapstone1.Entity.ReservationEntity;
import com.brscapstone1.brscapstone1.Entity.ReservationVehicleEntity;
import com.brscapstone1.brscapstone1.Service.ReservationService;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@RestController
@CrossOrigin
public class ReservationController {

    @Autowired
    private ReservationService resServ;

    //[POST] approved reservations by HEAD
    @PostMapping("/user/reservations/head-approve/{reservationId}")
    public ResponseEntity<String> headApproveReservation(@PathVariable int reservationId) {
        try {
            resServ.headApproveReservation(reservationId);
            return ResponseEntity.ok("Reservation approved by Head of the Department successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to approve reservation: " + e.getMessage());
        }
    }

    //[POST] approved reservations by OPC
    @PostMapping("/user/reservations/opc-approve/{reservationId}")
    public ResponseEntity<String> opcApproveReservation(@PathVariable int reservationId, @RequestParam int driverId, @RequestParam String driverName) {
        try {
            resServ.opcApproveReservation(reservationId, driverId, driverName);
            return ResponseEntity.ok("Reservation approved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to approve reservation: " + e.getMessage());
        }
    }

    @PutMapping("/user/reservations/assign-driver/{reservationId}/{plateNumber}")
    public ResponseEntity<String> assignDriverToReservation(
        @PathVariable int reservationId,
        @PathVariable String plateNumber,  
        @RequestBody ReservationVehicleEntity vehicleDetails) {
    try {
        // Call your service method to assign the driver
        resServ.assignDriverToAddedVehicles(reservationId, plateNumber, vehicleDetails.getDriverId(), vehicleDetails.getDriverName());
        return ResponseEntity.ok("Driver assigned successfully");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to assign driver: " + e.getMessage());
    }
}

    //[isRejected] rejects a reservation and returns boolean output
    @PostMapping("/user/reservations/reject/{reservationId}")
    public ResponseEntity<String> rejectReservation(@PathVariable int reservationId, @RequestBody String feedback) {
        try {
            resServ.rejectReservation(reservationId, feedback);
            return ResponseEntity.ok("Reservation rejected successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reject reservation: " + e.getMessage());
        }
    }

    //[POST] || submits a reservation
    @PostMapping("/user/reservations/add")
    public ReservationEntity addReservation(
        @RequestParam("userName") String userName, 
        @RequestParam(value = "fileUrl", required = false) String fileUrl, 
        @RequestParam("reservation") String reservationJson, 
        @RequestParam("vehicleIds") List<Integer> vehicleIds
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false); 
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false); 
        objectMapper.registerModule(new JavaTimeModule());

        ReservationEntity reservation = objectMapper.readValue(reservationJson, ReservationEntity.class);

        return resServ.saveReservation(userName, reservation, vehicleIds, fileUrl);
    }

    //[GET] all Reservations
    @GetMapping("/reservations/getAll")
    public List<ReservationEntity> getAllReservations() {
        return resServ.getAllReservations();
    }

    //[GET] Reservation by ID
    @GetMapping("/user/reservations/id/{id}")
    public ReservationEntity getReservationById(@PathVariable("id") int id) {
        return resServ.getReservationById(id);
    }

    //[GET] all user's reservations
    @GetMapping("/user/reservations/{userName}")
    public ResponseEntity<List<ReservationEntity>> getUserReservations(@PathVariable String userName) {
      try {
        List<ReservationEntity> userReservations = resServ.getUserReservations(userName);
        return ResponseEntity.ok(userReservations);
      } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
      }
    }

     //[POST] || update assigned driver
     @PostMapping("/user/reservations/update-driver/{reservationId}")
     public ResponseEntity<String> updateAssignedDriver(@PathVariable int reservationId, @RequestParam int driverId, @RequestParam String assignedDriverName) {
         try {
             resServ.updateAssignedDriver(reservationId, driverId, assignedDriverName);
             return ResponseEntity.ok("Assigned driver updated successfully");
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update assigned driver: " + e.getMessage());
         }
     }
     
     // [PUT] update reservation
     @PutMapping("/reservations/update/{reservationId}")
     public ResponseEntity<ReservationEntity> updateReservation(@PathVariable int reservationId,
                                                                 @RequestBody ReservationEntity updatedReservation,
                                                                 @RequestParam(value = "file", required = false) MultipartFile file,
                                                                 @RequestParam(value = "isResending", defaultValue = "false") boolean isResending) {
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
    @GetMapping("/reservations/opc-approved")
    public List<ReservationEntity> getOpcApprovedReservations() {
        return resServ.getOpcApprovedReservation();
    }

    //[GET] all reservations that is approved by HEAD
    @GetMapping("/reservations/head-approved")
    public List<ReservationEntity> getApprovedReservations() {
        return resServ.getHeadApprovedReservations();
    }

    //Availability date of vehicles
    @GetMapping("/reservations/vehicle-availability")
    public ResponseEntity<List<ReservedDateDTO>> checkVehicleReservation(
        @RequestParam String plateNumber) {

        List<ReservedDateDTO> filteredDates = resServ.getAllReservationDatesByPlateNumber(plateNumber);
        return ResponseEntity.ok(filteredDates);
    }

    //Availability date of multiple vehicles
    @GetMapping("/reservations/multiple-vehicle-availability")
    public ResponseEntity<List<ReservedDateDTO>> checkMultipleVehicleReservation(
        @RequestParam String plateNumber) {

        List<ReservedDateDTO> filteredDates = resServ.getAllReservedDatesByPlateNumber(plateNumber);
        return ResponseEntity.ok(filteredDates);
    }

    //GET reserve date and time
    @GetMapping("/reservations/by-plate-and-date")
    public ResponseEntity<List<ReservedDateDTO>> getReservationsByPlateAndDate(
        @RequestParam String plateNumber,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<ReservedDateDTO> reservations = resServ.getReservationsByPlateAndDate(plateNumber, date);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("multiple/reservations/by-plate-and-date")
    public ResponseEntity<List<ReservedDateDTO>> getReservedByPlateAndDate(
        @RequestParam String plateNumber,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<ReservedDateDTO> reservations = resServ.getReservedByPlateAndDate(plateNumber, date);
        return ResponseEntity.ok(reservations);
    }
    
    //DELETE
    @DeleteMapping("/reservations/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable int id){
        return ResponseEntity.ok((resServ.delete(id)));
    }
    
    //fetches multiple platenumbers 
    @GetMapping("/reservations/multiple-reserved/plate-numbers")
    public List<ReservedDateDTO> getPlateNumbersByScheduleOrReturnSchedule(
            @RequestParam LocalDate schedule,
            @RequestParam(required = false) LocalDate returnSchedule) {
        return resServ.getPlateNumbersByScheduleOrReturnSchedule(schedule, returnSchedule);
    }

    //fetches main platenumbers
    @GetMapping("/reservations/main-plate-numbers")
    public List<ReservedDateDTO> getMainPlateNumbersByScheduleOrReturnSchedule(
            @RequestParam LocalDate schedule,
            @RequestParam(required = false) LocalDate returnSchedule) {
        return resServ.getMainPlateNumbersByScheduleOrReturnSchedule(schedule, returnSchedule);
    } 

    //Resend Reservation
    @PutMapping("/reservations/resend/{reservationId}")
    public ResponseEntity<ReservationEntity> resendReservation(@PathVariable int reservationId,
                                                                @RequestBody ReservationEntity updatedReservation,
                                                                @RequestParam(value = "file", required = false) MultipartFile file,
                                                                @RequestParam(value = "isResending", defaultValue = "false") boolean isResending) {
        try {
            ReservationEntity updatedEntity = resServ.resendReservation(reservationId, updatedReservation, file, isResending);
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
}
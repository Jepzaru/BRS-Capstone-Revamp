package com.brscapstone1.brscapstone1.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;

import com.brscapstone1.brscapstone1.Entity.ReservationEntity;
import com.brscapstone1.brscapstone1.Entity.ReservationVehicleEntity;

public interface ReservationVehicleRepository extends JpaRepository<ReservationVehicleEntity, Integer> {

    @Query("SELECT rv FROM ReservationVehicleEntity rv WHERE rv.plateNumber = :plateNumber")
    List<ReservationVehicleEntity> findByPlateNumber(@Param("plateNumber") String plateNumber);

    List<ReservationVehicleEntity> findByReservation(ReservationEntity reservation);

    @Query("SELECT rv FROM ReservationVehicleEntity rv WHERE rv.plateNumber = :plateNumber AND (rv.schedule = :date OR rv.returnSchedule = :date)")
    List<ReservationVehicleEntity> findByPlateNumberAndSchedule(@Param("plateNumber") String plateNumber, @Param("date") LocalDate date);

    @Query("SELECT rv FROM ReservationVehicleEntity rv WHERE rv.reservation.id = :reservationId")
    List<ReservationVehicleEntity> findByReservationId(@Param("reservationId") int reservationId);
    
    // New method to find by both reservation ID and plate number
    @Query("SELECT rv FROM ReservationVehicleEntity rv WHERE rv.reservation.id = :reservationId AND rv.plateNumber = :plateNumber")
    Optional<ReservationVehicleEntity> findByReservationIdAndPlateNumber(@Param("reservationId") int reservationId, @Param("plateNumber") String plateNumber);

    @Query("SELECT rv FROM ReservationVehicleEntity rv WHERE (rv.schedule = :schedule OR rv.returnSchedule = :returnSchedule) AND rv.status = 'Approved'")
    List<ReservationVehicleEntity> findByScheduleOrReturnSchedule(@Param("schedule") LocalDate schedule, @Param("returnSchedule") LocalDate returnSchedule);
    

}

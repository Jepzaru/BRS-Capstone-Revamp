package com.brscapstone1.brscapstone1.Repository;
import java.util.List;

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


}

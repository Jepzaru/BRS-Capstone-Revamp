package com.brscapstone1.brscapstone1.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.brscapstone1.brscapstone1.Constants;
import com.brscapstone1.brscapstone1.Entity.ReservationEntity;
import com.brscapstone1.brscapstone1.Entity.ReservationVehicleEntity;

public interface ReservationVehicleRepository extends JpaRepository<ReservationVehicleEntity, Integer> {

    @Query(Constants.RepositoryQuery.FIND_BY_PLATENUMBER)
    List<ReservationVehicleEntity> findByPlateNumber(@Param(Constants.Annotation.PLATENUMBER) String plateNumber);

    @Query(Constants.RepositoryQuery.FIND_BY_PLATENUMBER_SCHEDULE)
    List<ReservationVehicleEntity> findByPlateNumberAndSchedule(@Param(Constants.Annotation.PLATENUMBER) String plateNumber, @Param(Constants.Annotation.DATE) LocalDate date);

    @Query(Constants.RepositoryQuery.FIND_RESERVATION_ID)
    List<ReservationVehicleEntity> findByReservationId(@Param(Constants.Annotation.RESERVATION_ID) int reservationId);
    
    @Query(Constants.RepositoryQuery.FIND_RESERVATION_ID_AND_PLATENUMBER)
    Optional<ReservationVehicleEntity> findByReservationIdAndPlateNumber(@Param(Constants.Annotation.RESERVATION_ID) int reservationId, @Param(Constants.Annotation.PLATENUMBER) String plateNumber);

    @Query(Constants.RepositoryQuery.FIND_SCHEDULE_OR_RETURN_SCHEDULE)
    List<ReservationVehicleEntity> findByScheduleOrReturnSchedule(@Param(Constants.Annotation.SCHEDULE) LocalDate schedule, @Param(Constants.Annotation.RETURN_SCHEDULE) LocalDate returnSchedule);

    List<ReservationVehicleEntity> findByReservation(ReservationEntity reservation);
}

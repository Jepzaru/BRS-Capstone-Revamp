package com.brscapstone1.brscapstone1.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.brscapstone1.brscapstone1.Constants;
import com.brscapstone1.brscapstone1.Entity.ReservationEntity;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Integer> {
    List<ReservationEntity> findByStatus(String status);
    List<ReservationEntity> findByHeadIsApproved(boolean headIsApproved);
    List<ReservationEntity> findByUserName(String userName);
    List<ReservationEntity> findByOpcIsApproved(boolean opcIsApproved);
    List<ReservationEntity> findByScheduleBetween(LocalDate startDate, LocalDate endDate);
    List<ReservationEntity> findByPlateNumber(String plateNumber);
    
    @Query(Constants.RepositoryQuery.FIND_PLATENUMBER_AND_DATE)
    List<ReservationEntity> findByPlateNumberAndDate(
        @Param(Constants.Annotation.PLATENUMBER) String plateNumber, 
        @Param(Constants.Annotation.DATE) LocalDate date);

    @Query(Constants.RepositoryQuery.FIND_MAIN_SCHEDULE_OR_RETURN)
    List<ReservationEntity> findByMainScheduleOrReturnSchedule(
        @Param(Constants.Annotation.SCHEDULE) LocalDate schedule,
        @Param(Constants.Annotation.RETURN_SCHEDULE) LocalDate returnSchedule);
}
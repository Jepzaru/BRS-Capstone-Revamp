package com.brscapstone1.brscapstone1.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.brscapstone1.brscapstone1.Entity.ReservationEntity;


public interface ReservationRepository extends JpaRepository<ReservationEntity, Integer> {
    List<ReservationEntity> findByStatus(String status);
    List<ReservationEntity> findByHeadIsApproved(boolean headIsApproved);
    List<ReservationEntity> findByUserName(String userName);
    List<ReservationEntity> findByOpcIsApproved(boolean opcIsApproved);
    List<ReservationEntity> findByScheduleBetween(LocalDate startDate, LocalDate endDate);
    List<ReservationEntity> findByPlateNumber(String plateNumber);
    @Query("SELECT r FROM ReservationEntity r WHERE r.plateNumber = :plateNumber AND (r.schedule = :date OR r.returnSchedule = :date)")
List<ReservationEntity> findByPlateNumberAndDate(@Param("plateNumber") String plateNumber, @Param("date") LocalDate date);

@Query("SELECT r FROM ReservationEntity r WHERE r.schedule = :schedule OR r.returnSchedule = :returnSchedule")
List<ReservationEntity> findByMainScheduleOrReturnSchedule(@Param("schedule") LocalDate schedule,
                                                            @Param("returnSchedule") LocalDate returnSchedule);

}
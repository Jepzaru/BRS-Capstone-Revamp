package com.brscapstone1.brscapstone1.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.brscapstone1.brscapstone1.Entity.DriverEntity;
import java.time.LocalDate;
import java.util.List;

public interface DriverRepository extends JpaRepository<DriverEntity, Long> {

    // Query to find drivers whose leave end date is before the given date
    @Query("SELECT d FROM DriverEntity d WHERE d.leaveEndDate IS NOT NULL AND d.leaveEndDate < :today")
    List<DriverEntity> findDriversOnLeave(@Param("today") LocalDate today);
    

}

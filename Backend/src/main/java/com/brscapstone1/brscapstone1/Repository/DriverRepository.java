package com.brscapstone1.brscapstone1.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.brscapstone1.brscapstone1.Constants;
import com.brscapstone1.brscapstone1.Entity.DriverEntity;

public interface DriverRepository extends JpaRepository<DriverEntity, Long> {
    @Query(Constants.RepositoryQuery.DRIVER_ON_LEAVE)
    List<DriverEntity> findDriversOnLeave(@Param(Constants.Annotation.TODAY) LocalDate today);
}

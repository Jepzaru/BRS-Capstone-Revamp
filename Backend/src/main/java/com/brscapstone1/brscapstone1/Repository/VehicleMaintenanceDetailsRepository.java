package com.brscapstone1.brscapstone1.Repository;

import com.brscapstone1.brscapstone1.Entity.VehicleEntity; 
import java.util.List;
import com.brscapstone1.brscapstone1.Entity.VehicleMaintenanceDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleMaintenanceDetailsRepository extends JpaRepository<VehicleMaintenanceDetailsEntity, Integer> {
    
    Optional<VehicleMaintenanceDetailsEntity> findByVehicle(VehicleEntity vehicle); 
    List<VehicleMaintenanceDetailsEntity> findAll();
}

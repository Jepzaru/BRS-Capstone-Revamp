package com.brscapstone1.brscapstone1.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brscapstone1.brscapstone1.Entity.VehicleEntity;

public interface VehicleRepository extends JpaRepository<VehicleEntity, Integer>{
  
}

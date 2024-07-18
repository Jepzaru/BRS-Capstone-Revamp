package com.brscapstone1.brscapstone1.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.brscapstone1.brscapstone1.Entity.ReservationEntity;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Integer>{
  List<ReservationEntity> findByStatus(String status);
  List<ReservationEntity> findByHeadIsApproved(boolean headIsApproved);
  List<ReservationEntity> findByUserName(String userName);
}

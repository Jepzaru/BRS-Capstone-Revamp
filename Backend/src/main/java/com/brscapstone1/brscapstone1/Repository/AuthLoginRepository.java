package com.brscapstone1.brscapstone1.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brscapstone1.brscapstone1.Entity.AuthLoginEntity;

public interface AuthLoginRepository extends JpaRepository<AuthLoginEntity, Integer>{
  AuthLoginEntity findByEmailAndPassword(String email, String password);
  AuthLoginEntity findByEmail(String email);
}

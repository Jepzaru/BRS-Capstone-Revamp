package com.brscapstone1.brscapstone1.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.brscapstone1.brscapstone1.Entity.UserEntity;


public interface UserRepository extends JpaRepository<UserEntity, Integer>{
	Optional<UserEntity> findByEmail(String email);
}

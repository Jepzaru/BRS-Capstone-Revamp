package com.brscapstone1.brscapstone1.Repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brscapstone1.brscapstone1.Entity.EventsEntity;

public interface EventsRepository extends JpaRepository<EventsEntity, Integer> {
    List<EventsEntity> findByEventDate(Date eventDate);
}

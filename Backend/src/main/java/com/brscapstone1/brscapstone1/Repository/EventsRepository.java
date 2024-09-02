package com.brscapstone1.brscapstone1.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brscapstone1.brscapstone1.Entity.EventsEntity;

	public interface EventsRepository extends JpaRepository <EventsEntity, Integer>{
		  
}

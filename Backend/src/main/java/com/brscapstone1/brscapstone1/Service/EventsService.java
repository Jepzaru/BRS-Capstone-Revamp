package com.brscapstone1.brscapstone1.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.brscapstone1.brscapstone1.Entity.EventsEntity;
import com.brscapstone1.brscapstone1.Repository.EventsRepository;

@Service
public class EventsService {
	
	@Autowired
	EventsRepository eventsRepo;

	public List<EventsEntity> events() {
	    return eventsRepo.findAll();
	}

    // Create a new event
    public EventsEntity post(EventsEntity event) {
        return eventsRepo.save(event);
    }

    // Update an existing event
    public EventsEntity update(int id, EventsEntity updatedEvent) {
        Optional<EventsEntity> existingEventOpt = eventsRepo.findById(id);
        if (existingEventOpt.isPresent()) {
            EventsEntity existingEvent = existingEventOpt.get();
            existingEvent.setEventDate(updatedEvent.getEventDate());
            existingEvent.setEventDescription(updatedEvent.getEventDescription());
            existingEvent.setEventTitle(updatedEvent.getEventTitle());
            return eventsRepo.save(existingEvent);
        } else {
            return null;  // Or throw an exception if preferred
        }
    }

    //soft delete
    public String delete(int id) {
        String msg = "";

        Optional<EventsEntity> existingEventOpt = eventsRepo.findById(id);

        if (existingEventOpt.isPresent()) {
            EventsEntity existingEvent = existingEventOpt.get();
            if (!existingEvent.isDeleted()) {
                existingEvent.setDeleted(true);  // Mark as deleted
                eventsRepo.save(existingEvent);
                msg = "Event with id " + id + " is successfully soft deleted.";
            } else {
                msg = "Event with id " + id + " was already deleted.";
            }
        } else {
            msg = "Event with id " + id + " does not exist.";
        }
        return msg;
    }

}

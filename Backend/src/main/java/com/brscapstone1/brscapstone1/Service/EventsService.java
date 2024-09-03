package com.brscapstone1.brscapstone1.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.brscapstone1.brscapstone1.Entity.EventsEntity;
import com.brscapstone1.brscapstone1.Repository.EventsRepository;

@Service
public class EventsService {

    @Autowired
    private EventsRepository eventsRepo;

    public List<EventsEntity> events() {
        return eventsRepo.findAll();
    }

    public List<EventsEntity> findByDate(Date date) {
        return eventsRepo.findByEventDate(date);
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
            throw new RuntimeException("Event with id " + id + " not found.");
        }
    }

    // Soft delete
    public String delete(int id) {
        Optional<EventsEntity> existingEventOpt = eventsRepo.findById(id);

        if (existingEventOpt.isPresent()) {
            EventsEntity existingEvent = existingEventOpt.get();
            if (!existingEvent.isDeleted()) {
                existingEvent.setDeleted(true);  // Mark as deleted
                eventsRepo.save(existingEvent);
                return "Event with id " + id + " is successfully soft deleted.";
            } else {
                return "Event with id " + id + " was already deleted.";
            }
        } else {
            return "Event with id " + id + " does not exist.";
        }
    }
}

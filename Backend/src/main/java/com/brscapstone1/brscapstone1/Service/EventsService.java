package com.brscapstone1.brscapstone1.Service;

import java.sql.Date;
import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.brscapstone1.brscapstone1.Constants;
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

    public EventsEntity post(EventsEntity event) {
        return eventsRepo.save(event);
    }

    public EventsEntity update(int id, EventsEntity updatedEvent) {
        Optional<EventsEntity> existingEventOpt = eventsRepo.findById(id);
        if (existingEventOpt.isPresent()) {
            EventsEntity existingEvent = existingEventOpt.get();
            existingEvent.setEventDate(updatedEvent.getEventDate());
            existingEvent.setEventDescription(updatedEvent.getEventDescription());
            existingEvent.setEventTitle(updatedEvent.getEventTitle());
            return eventsRepo.save(existingEvent);
        } else {
            throw new RuntimeException(MessageFormat.format(Constants.ResponseMessages.EVENT_NOT_EXISTS, id));
        }
    }

    public String delete(int id) {
        Optional<EventsEntity> existingEventOpt = eventsRepo.findById(id);

        if (existingEventOpt.isPresent()) {
            EventsEntity existingEvent = existingEventOpt.get();
            if (!existingEvent.isDeleted()) {
                existingEvent.setDeleted(true); 
                eventsRepo.save(existingEvent);
                return (MessageFormat.format(Constants.ResponseMessages.EVENT_DELETE_SUCCESS, id));
            } else {
                return (MessageFormat.format(Constants.ResponseMessages.EVENT_DELETE_ERROR, id));
            }
        } else {
            return MessageFormat.format(Constants.ResponseMessages.EVENT_NOT_EXISTS, id);
        }
    }
}

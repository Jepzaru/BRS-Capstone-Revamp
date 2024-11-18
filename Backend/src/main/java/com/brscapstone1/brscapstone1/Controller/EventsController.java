package com.brscapstone1.brscapstone1.Controller;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brscapstone1.brscapstone1.Constants;
import com.brscapstone1.brscapstone1.Entity.EventsEntity;
import com.brscapstone1.brscapstone1.Service.EventsService;

@RestController
@CrossOrigin
@RequestMapping(Constants.ApiRoutes.EVENT_BASE)
public class EventsController {

    @Autowired
    private EventsService eventsService;

    @GetMapping(Constants.ApiRoutes.GET_ALL)
    public ResponseEntity<List<EventsEntity>> getAllEvents() {
        List<EventsEntity> events = eventsService.events();
        return ResponseEntity.ok(events);
    }

    @PostMapping(Constants.ApiRoutes.POST)
    public ResponseEntity<EventsEntity> post(@RequestBody EventsEntity post) {
        EventsEntity createdEvent = eventsService.post(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PutMapping(Constants.ApiRoutes.UPDATE)
    public ResponseEntity<EventsEntity> update(@PathVariable int id, @RequestBody EventsEntity newEvent) {
        EventsEntity updatedEvent = eventsService.update(id, newEvent);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping(Constants.ApiRoutes.DELETE)
    public ResponseEntity<String> delete(@PathVariable int id) {
        String result = eventsService.delete(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping(Constants.ApiRoutes.EVENT_BY_DATE)
    public ResponseEntity<List<EventsEntity>> getEventsByDate(@PathVariable(Constants.Annotation.DATE) String dateStr) {
        System.out.println(Constants.ResponseMessages.GET_DATE_SUCCESS + dateStr);
        try {
            Date date = Date.valueOf(dateStr);
            List<EventsEntity> events = eventsService.findByDate(date);
            return ResponseEntity.ok(events);
        } catch (IllegalArgumentException e) {
            System.err.println(Constants.ResponseMessages.INVALID_DATE_FORMAT + dateStr);
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}

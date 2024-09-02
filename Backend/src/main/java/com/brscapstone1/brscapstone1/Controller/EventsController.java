package com.brscapstone1.brscapstone1.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.brscapstone1.brscapstone1.Entity.EventsEntity;
import com.brscapstone1.brscapstone1.Service.EventsService;

@RestController
@CrossOrigin
@RequestMapping("/opc/events")
public class EventsController {

	@Autowired
	EventsService eventsService;
	
	  @GetMapping("/getAll")
	  public List<EventsEntity> events(){
	    return eventsService.events();
	  }

	  @PostMapping("/post")
	  public EventsEntity post(@RequestBody EventsEntity post){
	    return eventsService.post(post);
	  }

	  @PutMapping("/update/{id}")
	  public EventsEntity update (@PathVariable int id, @RequestBody EventsEntity newDriver){
	    return eventsService.update(id, newDriver);
	  }
	  
	  @DeleteMapping("/delete/{id}")
	  public String delete(@PathVariable int id){
	    return eventsService.delete(id);
	  }
}

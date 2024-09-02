package com.brscapstone1.brscapstone1.Entity;

import java.sql.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name= "events")
public class EventsEntity {

	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private int eventId;
	  private Date eventDate;
	  private String eventDescription;
	  private String eventTitle;
	  private boolean isDeleted = false; 
	  
	public int getEventId() {
		return eventId;
	}
	public void setEventId(int eventId) {
		this.eventId = eventId;
	}
	public Date getEventDate() {
		return eventDate;
	}
	public void setEventDate(Date eventDate) {
		this.eventDate = eventDate;
	}
	public String getEventDescription() {
		return eventDescription;
	}
	public void setEventDescription(String eventDescription) {
		this.eventDescription = eventDescription;
	}
	public String getEventTitle() {
		return eventTitle;
	}
	public void setEventTitle(String eventTitle) {
		this.eventTitle = eventTitle;
	}
	  public boolean isDeleted() {
		return isDeleted;
	}
	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}
	public EventsEntity(int eventId, Date eventDate, String eventDescription, String eventTitle) {
		    this.eventId = eventId;
		    this.eventDate = eventDate;
		    this.eventDescription = eventDescription;
		    this.eventTitle = eventTitle;
		  }
		  public EventsEntity() {
		    super();
		  }
	
	  
}

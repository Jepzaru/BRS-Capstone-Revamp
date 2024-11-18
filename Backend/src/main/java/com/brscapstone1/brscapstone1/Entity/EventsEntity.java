package com.brscapstone1.brscapstone1.Entity;

import java.util.Date;

import com.brscapstone1.brscapstone1.Constants;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = Constants.DataAnnotations.EVENT)
public class EventsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int eventId;

    @Column(name = Constants.DataAnnotations.EVENT_DATE) 
    private Date eventDate;

    @Column(name = Constants.DataAnnotations.EVENT_DESCRIPTION) 
    private String eventDescription;

    @Column(name = Constants.DataAnnotations.EVENT_TITLE)
    private String eventTitle;

    @Column(name = Constants.DataAnnotations.IS_DELETED)
    private boolean isDeleted = false;

    public EventsEntity() {
    }

    public EventsEntity(int eventId, Date eventDate, String eventDescription, String eventTitle) {
        this.eventId = eventId;
        this.eventDate = eventDate;
        this.eventDescription = eventDescription;
        this.eventTitle = eventTitle;
    }

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

    @Override
    public String toString() {
        return "EventsEntity{" +
                "eventId=" + eventId +
                ", eventDate=" + eventDate +
                ", eventDescription='" + eventDescription + '\'' +
                ", eventTitle='" + eventTitle + '\'' +
                ", isDeleted=" + isDeleted +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EventsEntity that = (EventsEntity) o;

        return eventId == that.eventId;
    }

    @Override
    public int hashCode() {
        return eventId;
    }
}

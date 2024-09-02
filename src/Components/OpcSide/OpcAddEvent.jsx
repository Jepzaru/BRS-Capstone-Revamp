import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../CSS/OpcCss/OpcAddEvent.css';

const OpcAddEvent = ({ show, handleClose, handleSave }) => {
  const [eventDate, setEventDate] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    
    const today = new Date();
    const minDate = new Date(today.setDate(today.getDate() + 2)).toISOString().split('T')[0];
    setMinDate(minDate);
  }, []);

  const onSave = () => {
    const eventData = {
      date: eventDate,
      title: eventTitle,
      description: eventDescription,
    };
    handleSave(eventData);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventDate">
              <Form.Label className="form-label">Event Date</Form.Label>
              <Form.Control 
                type="date" 
                value={eventDate}
                min={minDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="form-control"
              />
            </Form.Group>

            <Form.Group controlId="formEventTitle">
              <Form.Label className="form-label">Event Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter event title" 
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="form-control"
              />
            </Form.Group>

            <Form.Group controlId="formEventDescription">
              <Form.Label className="form-label">Event Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Enter event description" 
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="form-control"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleClose} 
            className="modal-close-btn"
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={onSave} 
            className="modal-save-btn"
          >
            Save Event
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx="true">{`
        .modal-backdrop.show {
          opacity: 0.5;
        }
      `}</style>
    </>
  );
};

export default OpcAddEvent;

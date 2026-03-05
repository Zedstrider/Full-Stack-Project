import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddJobModal = ({ show, handleClose, handleAddJob }) => {
  // 1. Add 'status' to the initial state, defaulting to 'wishlist'
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    location: '',
    status: 'wishlist' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault(); 
    
    if (!formData.role || !formData.company) return;

    handleAddJob(formData);
    
    // Reset form to default values upon closing
    setFormData({ role: '', company: '', location: '', status: 'wishlist' });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Application</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Job Role</Form.Label>
            <Form.Control 
              type="text" 
              name="role"
              placeholder="e.g., Frontend Developer" 
              value={formData.role}
              onChange={handleChange}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCompany">
            <Form.Label>Company Name</Form.Label>
            <Form.Control 
              type="text" 
              name="company"
              placeholder="e.g., Tech Startup Inc." 
              value={formData.company}
              onChange={handleChange}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control 
              type="text" 
              name="location"
              placeholder="e.g., Remote, Bengaluru, etc." 
              value={formData.location}
              onChange={handleChange}
            />
          </Form.Group>

          {/* 2. NEW: Add a Select dropdown for the Column/Status */}
          <Form.Group className="mb-3" controlId="formStatus">
            <Form.Label>Current Status</Form.Label>
            <Form.Select 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
            >
              <option value="wishlist">Wishlist</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Application
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddJobModal;
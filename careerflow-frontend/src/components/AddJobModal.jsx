import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

// Added editingJob prop
const AddJobModal = ({ show, handleClose, handleSaveJob, editingJob }) => {
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    location: '',
    status: 'wishlist' 
  });

  // Pre-fill the form if we are editing an existing job
  useEffect(() => {
    if (editingJob) {
      setFormData(editingJob); // Populate with existing data
    } else {
      // Reset to default for a new job
      setFormData({ role: '', company: '', location: '', status: 'wishlist' });
    }
  }, [editingJob, show]); // Re-run when the modal opens or the editingJob changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault(); 
    if (!formData.role || !formData.company) return;

    // Send the data back up to the KanbanBoard
    handleSaveJob(formData);
  };

  // Determine if we are in edit mode for dynamic text
  const isEditing = !!editingJob;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        {/* Dynamic Title */}
        <Modal.Title>{isEditing ? 'Edit Application' : 'Add New Application'}</Modal.Title>
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

          <Form.Group className="mb-3" controlId="formStatus">
            <Form.Label>Current Status</Form.Label>
            <Form.Select name="status" value={formData.status} onChange={handleChange}>
              <option value="wishlist">Wishlist</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          {/* Dynamic Button Text */}
          <Button variant="primary" type="submit">
            {isEditing ? 'Save Changes' : 'Save Application'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddJobModal;
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

// Added editingJob prop
const AddJobModal = ({ show, handleClose, handleSaveJob, editingJob }) => {
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    location: '',
    status: 'applied',
    interviewDate: '',
    applicationLink: '', 
    resumeFile: null,
  });

  const [showPreview, setShowPreview] = useState(false);

  // Pre-fill the form if we are editing an existing job
  useEffect(() => {
    if (editingJob) {
      setFormData(editingJob); // Populate with existing data
    } else {
      // Reset to default for a new job
      setFormData({ role: '', company: '', location: '', status: 'applied' });
    }
  }, [editingJob, show]); // Re-run when the modal opens or the editingJob changes

  // Helper function to convert MongoDB UTC dates back to local time for the input
  const formatForDateTimeInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Get the local timezone offset in minutes, convert to milliseconds
    const tzOffset = date.getTimezoneOffset() * 60000;
    // Subtract the offset to force the ISO string to output your local time
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, resumeFile: e.target.files[0] });
  };

  const onSubmit = (e) => {
    e.preventDefault(); 
    if (!formData.role || !formData.company) return;

    const cleanedRole = formData.role.trim();
    const cleanedCompany = formData.company.trim();
    const cleanedLocation = formData.location.trim();

    // Validate Empty Strings: Check if they are empty AFTER removing spaces
    if (!cleanedRole || !cleanedCompany) {
      alert("Role and Company cannot be empty or just spaces.");
      return; 
    }

    // Validate Length: Prevent insanely long garbage strings that break the UI
    if (cleanedRole.length > 50 || cleanedCompany.length > 50 || cleanedLocation.length > 50) {
      alert("Please keep Role, Company, and Location under 50 characters.");
      return;
    }

    // Send the data back up to the KanbanBoard
    handleSaveJob({...formData,
      role: cleanedRole,
      company: cleanedCompany,
      location: cleanedLocation});

    handleClose();
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
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
          </Form.Group>

          {/* SMART INTERVIEW DATE INPUT */}
        {/* This entire block only renders if the status is exactly 'interviewing' */}
        {formData.status === 'interviewing' && (
          <Form.Group className="mb-3" controlId="interviewDate">
            <Form.Label className="text-secondary small fw-bold">Interview Date & Time</Form.Label>
            <Form.Control 
              type="datetime-local" 
              name="interviewDate" 
              // Pro-Tip: MongoDB saves dates as long ISO strings (2026-04-10T15:30:00.000Z).
              // The datetime-local input requires exactly 16 characters (YYYY-MM-DDThh:mm).
              // The .slice(0, 16) prevents the input box from breaking when editing an existing date!
              value={formatForDateTimeInput(formData.interviewDate)}
              onChange={handleChange} 
            />
          </Form.Group>
        )}
          
         {/* Smart URL Input */}
        <Form.Group className="mb-3" controlId="applicationLink">
          <Form.Label className="text-secondary small fw-bold">Application URL</Form.Label>
          <InputGroup>
            <Form.Control 
              type="url" 
              name="applicationLink" 
              placeholder="https://company.com/careers/..." 
              value={formData.applicationLink || ''}
              onChange={handleChange} 
            />
            
            {/* Only show the clickable button if there is actually text in the box */}
            {formData.applicationLink && (
              <Button 
                as="a" /* This magic prop turns the Bootstrap Button into a real <a> tag */
                variant="outline-primary"
                // Failsafe: If the user forgot 'https://', add it automatically so the link doesn't break
                href={formData.applicationLink.startsWith('http') ? formData.applicationLink : `https://${formData.applicationLink}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="fw-bold px-3"
              >
                ↗ Visit
              </Button>
            )}
          </InputGroup>
        </Form.Group>

        {/* Smart Resume Upload Section */}
        <Form.Group className="mb-4">
          <Form.Label className="text-secondary small fw-bold">Resume (PDF)</Form.Label>
          
          {formData.resumeFile && typeof formData.resumeFile !== 'string' && formData.resumeFile !== 'REMOVE' ? (
            <div className="p-3 bg-light border border-primary border-opacity-50 rounded d-flex align-items-center justify-content-between">
              <span className="text-primary small fw-bold mb-0">
                📄 {formData.resumeFile.name}
              </span>
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => setFormData({ ...formData, resumeFile: null })}
              >
                Remove
              </Button>
            </div>
          ) : (editingJob && editingJob.resumeFile && formData.resumeFile !== 'REMOVE') ? (
            <div className="p-3 bg-light border rounded">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-secondary small fw-bold mb-0">Attached File:</span>
                
                {/* BUTTON CONTROLS */}
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Hide Preview' : '👁️ Preview'}
                  </Button>
                  
                  {/* The 'download' attribute forces the browser to download instead of opening it */}
                  <a 
                    href={`http://localhost:5000/api/download?path=${editingJob.resumeFile}`} 
                    className="btn btn-sm btn-outline-success fw-bold"
                  >
                    ⬇️ Download
                  </a>

                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => {
                      setFormData({ ...formData, resumeFile: 'REMOVE' });
                      setShowPreview(false); // Close preview if they remove the file
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {/* INLINE VIEWER (Only shows if Preview is clicked) */}
              {showPreview && (
                <div className="mt-3">
                  {/* Check if it's a PDF before trying to render it in an iframe */}
                  {editingJob.resumeFile.toLowerCase().endsWith('.pdf') ? (
                    <iframe 
                      src={`http://localhost:5000/${editingJob.resumeFile.replace(/\\/g, '/')}`} 
                      width="100%" 
                      height="400px" 
                      className="border rounded"
                      title="Resume Preview"
                    />
                  ) : (
                    /* Fallback for .docx files */
                    <div className="p-4 text-center bg-white border rounded text-secondary">
                      <p className="mb-0">📄 <em>Preview is only available for PDF files.</em></p>
                      <p className="small mt-1 mb-0">Please use the <strong>Download</strong> button above to view this Word document.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Form.Control 
              type="file" 
              name="resumeFile" 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileChange} 
            />
          )}
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
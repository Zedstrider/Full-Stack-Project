import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import AddJobModal from './AddJobModal';

const API_URL = 'http://localhost:5000/api/jobs';

// Mock initial data - this will eventually come from your MongoDB backend
const initialData = {
  jobs: {
    'job-1': { id: 'job-1', role: 'Frontend React Eng', company: 'TechCorp', location: 'Remote' },
    'job-2': { id: 'job-2', role: 'Full Stack Dev', company: 'Innovate LLC', location: 'On-site' },
    'job-3': { id: 'job-3', role: 'Software Engineer', company: 'CloudNet', location: 'Hybrid' },
  },
  columns: {
    'wishlist': { id: 'wishlist', title: 'Wishlist', jobIds: ['job-1', 'job-2'] },
    'applied': { id: 'applied', title: 'Applied', jobIds: ['job-3'] },
    'interviewing': { id: 'interviewing', title: 'Interviewing', jobIds: [] },
    'rejected': { id: 'rejected', title: 'Rejected', jobIds: [] }
  },
  columnOrder: ['wishlist', 'applied', 'interviewing', 'rejected']
};

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddJob = async (newJobData) => {
    try {
      // 1. Send POST request to backend
      // Assuming your backend expects { role, company, location, status }
      // and defaults the status to 'wishlist' if not provided.
      const response = await axios.post(API_URL, {
        ...newJobData,
        status: 'wishlist' 
      });

      const savedJob = response.data; // The newly created document from MongoDB
      const newJobId = savedJob._id.toString();
      
      const formattedNewJob = { ...savedJob, id: newJobId };

      // 2. Update frontend state immediately
      const startColumn = data.columns['wishlist'];
      const newJobIds = Array.from(startColumn.jobIds);
      newJobIds.push(newJobId); // Add to the bottom of the wishlist

      const newColumn = { ...startColumn, jobIds: newJobIds };

      setData(prevData => ({
        ...prevData,
        jobs: {
          ...prevData.jobs,
          [newJobId]: formattedNewJob
        },
        columns: {
          ...prevData.columns,
          ['wishlist']: newColumn
        }
      }));

    } catch (err) {
      console.error("Failed to add job:", err);
      alert("Failed to add the new job. Please try again.");
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        const fetchedJobs = response.data; // Assuming this returns an array of job objects

        // Transform the array from MongoDB into our structured state
        const formattedJobs = {};
        const formattedColumns = {
          wishlist: { id: 'wishlist', title: 'Wishlist', jobIds: [] },
          applied: { id: 'applied', title: 'Applied', jobIds: [] },
          interviewing: { id: 'interviewing', title: 'Interviewing', jobIds: [] },
          rejected: { id: 'rejected', title: 'Rejected', jobIds: [] }
        };

        fetchedJobs.forEach(job => {
          // Use the MongoDB _id as the primary key
          const jobId = job._id.toString(); 
          formattedJobs[jobId] = { ...job, id: jobId };
          
          // Push the ID into the correct column based on the job's status
          if (formattedColumns[job.status]) {
             formattedColumns[job.status].jobIds.push(jobId);
          }
        });

        setData({
          jobs: formattedJobs,
          columns: formattedColumns,
          columnOrder: ['wishlist', 'applied', 'interviewing', 'rejected']
        });
        
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load your jobs. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []); // Empty dependency array means this runs once on mount
  // This function fires the moment the user drops a card
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = data.columns[source.droppableId];
    const finishColumn = data.columns[destination.droppableId];

    // ... (Keep the exact same state update logic from the previous step here) ...
    // ... (Updating startColumn, finishColumn, and calling setData) ...

    // NEW: If the card moved to a DIFFERENT column, update the database
    if (startColumn !== finishColumn) {
      const newStatus = finishColumn.id; // e.g., 'interviewing'
      
      try {
        // Send the PUT request to your Express backend
        await axios.put(`${API_URL}/${draggableId}`, {
          status: newStatus
        });
        console.log(`Successfully updated job ${draggableId} to ${newStatus}`);
      } catch (err) {
        console.error("Failed to update job status:", err);
        
        // TODO (Advanced): If the API call fails, you should ideally revert 
        // the state back to what it was before the drag happened so the UI 
        // matches the database. 
        alert("Failed to save changes to the server.");
      }
    }
  };

  if (loading) return <Container className="py-5 text-center">Loading your CareerFlow...</Container>;
  if (error) return <Container className="py-5 text-center text-danger">{error}</Container>;
  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <h2>CareerFlow Tracker</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add New Job
        </Button>
      </div>
      {/* Wrap everything that handles drag-and-drop in the Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Row className="flex-nowrap overflow-auto pb-3">
          {data.columnOrder.map(columnId => {
            const column = data.columns[columnId];
            const jobs = column.jobIds.map(jobId => data.jobs[jobId]);

            return (
              <Col xs={12} md={6} lg={3} key={column.id}>
                <Column column={column} jobs={jobs} />
              </Col>
            );
          })}
        </Row>
      </DragDropContext>
      <AddJobModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        handleAddJob={handleAddJob} 
      />
    </Container>
    
  );
};

export default KanbanBoard;
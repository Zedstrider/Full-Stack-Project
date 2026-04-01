import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import AddJobModal from './AddJobModal';
import axios from 'axios'; 

const emptyBoard = {
  jobs: {},
  columns: {
    'wishlist': { id: 'wishlist', title: 'Wishlist', jobIds: [] },
    'applied': { id: 'applied', title: 'Applied', jobIds: [] },
    'interviewing': { id: 'interviewing', title: 'Interviewing', jobIds: [] },
    'rejected': { id: 'rejected', title: 'Rejected', jobIds: [] }
  },
  columnOrder: ['wishlist', 'applied', 'interviewing', 'rejected']
};

// Helper function to turn the MongoDB array into our Kanban format
const buildBoardData = (jobsArray) => {
  // Start with a fresh, empty board
  const newBoard = JSON.parse(JSON.stringify(emptyBoard));

  jobsArray.forEach(job => {
    // MongoDB uses '_id', but our drag-and-drop uses 'id', so we map it over
    const formattedJob = { ...job, id: job._id }; 
    
    // 1. Add the job to the jobs dictionary
    newBoard.jobs[job._id] = formattedJob;
    
    // 2. Add the job's ID to the correct column's array
    if (newBoard.columns[job.status]) {
      newBoard.columns[job.status].jobIds.push(job._id);
    }
  });

  return newBoard;
};

const KanbanBoard = () => {
  // State Initialization
  const [data, setData] = useState(emptyBoard);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  //Fetch jobs from MongoDB when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        // Pass the MongoDB array through our helper function
        const formattedData = buildBoardData(response.data);
        // Update the React state with the database data!
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []); // The empty array ensures this only runs once on load

  const openAddModal = () => {
    setEditingJob(null);
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const handleSaveJob = async (jobData) => {
    try {
      if (editingJob) {
        // --- 1. EDIT EXISTING JOB IN DATABASE ---
        await axios.put(`http://localhost:5000/api/jobs/${jobData.id}`, jobData);

        setData(prevData => {
          const originalJob = prevData.jobs[jobData.id];
          let newColumns = { ...prevData.columns };

          if (originalJob.status !== jobData.status) {
            const oldColumn = newColumns[originalJob.status];
            const newColumn = newColumns[jobData.status];

            newColumns[originalJob.status] = {
              ...oldColumn,
              jobIds: oldColumn.jobIds.filter(id => id !== jobData.id)
            };
            
            newColumns[jobData.status] = {
              ...newColumn,
              jobIds: [...newColumn.jobIds, jobData.id]
            };
          }

          return {
            ...prevData,
            jobs: { ...prevData.jobs, [jobData.id]: jobData },
            columns: newColumns
          };
        });
      } else {
        // --- 2. SAVE NEW JOB TO DATABASE ---
        // We POST to the backend, and MongoDB creates the real _id
        const response = await axios.post('http://localhost:5000/api/jobs', jobData);
        const newJob = response.data; 
        
        // Use the real MongoDB _id instead of our fake Date.now() ID
        const newJobId = newJob._id; 
        const formattedNewJob = { ...newJob, id: newJobId };
        const selectedStatus = newJob.status; 
        const targetColumn = data.columns[selectedStatus];
        
        const newJobIds = Array.from(targetColumn.jobIds);
        newJobIds.push(newJobId); 

        setData(prevData => ({
          ...prevData,
          jobs: { ...prevData.jobs, [newJobId]: formattedNewJob },
          columns: {
            ...prevData.columns,
            [selectedStatus]: { ...targetColumn, jobIds: newJobIds }
          }
        }));
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job to the database.");
    }
  };

  // Delete Job Logic (Local State)
  const handleDeleteJob = async (jobId, columnId) => {
    if (!window.confirm("Are you sure you want to delete this job entry?")) return;

    try {
      // --- DELETE FROM DATABASE ---
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);

      // --- DELETE FROM UI ---
      setData(prevData => {
        const newJobs = { ...prevData.jobs };
        delete newJobs[jobId]; 

        const column = prevData.columns[columnId];
        const newJobIds = column.jobIds.filter(id => id !== jobId); 

        return {
          ...prevData,
          jobs: newJobs,
          columns: {
            ...prevData.columns,
            [columnId]: { ...column, jobIds: newJobIds }
          }
        };
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete the job from the database.");
    }
  };

  // Drag and Drop Logic (Local State)
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a valid area, do nothing
    if (!destination) return;
    
    // If dropped in the exact same spot, do nothing
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = data.columns[source.droppableId];
    const finishColumn = data.columns[destination.droppableId];

    // --- Moving within the SAME column ---
    if (startColumn === finishColumn) {
      const newJobIds = Array.from(startColumn.jobIds);
      newJobIds.splice(source.index, 1);
      newJobIds.splice(destination.index, 0, draggableId);

      setData({
        ...data,
        columns: {
          ...data.columns,
          [startColumn.id]: { ...startColumn, jobIds: newJobIds }
        }
      });
      return;
    }

    // --- Moving to a DIFFERENT column ---
    const startJobIds = Array.from(startColumn.jobIds);
    startJobIds.splice(source.index, 1);
    
    const finishJobIds = Array.from(finishColumn.jobIds);
    finishJobIds.splice(destination.index, 0, draggableId);

    // Update the status property on the job object itself
    const updatedJob = {
      ...data.jobs[draggableId],
      status: finishColumn.id // e.g., updates 'wishlist' to 'interviewing'
    };

    axios.put(`http://localhost:5000/api/jobs/${draggableId}`, { status: finishColumn.id })
      .catch(err => console.error("Database update failed:", err));

    // Save everything back to state
    setData({
      ...data,
      jobs: {
        ...data.jobs,
        [draggableId]: updatedJob // Overwrite the old job with the updated one
      },
      columns: {
        ...data.columns,
        [startColumn.id]: { ...startColumn, jobIds: startJobIds },
        [finishColumn.id]: { ...finishColumn, jobIds: finishJobIds }
      }
    });
  };

  // The UI
  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <h2>Job Application Tracker</h2>
        <Button variant="primary" onClick={openAddModal}>
          + Add New Job
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Row className="flex-nowrap overflow-auto pb-3">
          {data.columnOrder.map(columnId => {
            const column = data.columns[columnId];
            const jobs = column.jobIds.map(jobId => data.jobs[jobId]);

            return (
              <Col xs={12} md={6} lg={3} key={column.id}>
                <Column 
                  column={column} 
                  jobs={jobs} 
                  handleDeleteJob={handleDeleteJob} 
                  openEditModal={openEditModal}
                />
              </Col>
            );
          })}
        </Row>
      </DragDropContext>

      <AddJobModal 
        show={showModal} 
        handleClose={() => { setShowModal(false); setEditingJob(null); }} 
        handleSaveJob={handleSaveJob} 
        editingJob={editingJob}
      />
    </Container>
  );
};

export default KanbanBoard;
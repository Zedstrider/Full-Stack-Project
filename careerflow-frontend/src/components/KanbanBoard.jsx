import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import AddJobModal from './AddJobModal';

// 1. Our Mock Data
const initialData = {
  jobs: {
    'job-1': { id: 'job-1', role: 'Frontend React Eng', company: 'TechCorp', location: 'Remote', status: 'wishlist' },
    'job-2': { id: 'job-2', role: 'Full Stack Dev', company: 'Innovate LLC', location: 'On-site', status: 'wishlist' },
    'job-3': { id: 'job-3', role: 'Software Engineer', company: 'CloudNet', location: 'Hybrid', status: 'applied' },
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
  // 2. State Initialization
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);

  // 3. Add Job Logic (Local State)
  const handleAddJob = (newJobData) => {
    const newJobId = `job-${Date.now()}`; 
    
    // 1. The status is now coming directly from the modal's newJobData
    const selectedStatus = newJobData.status; 
    const formattedNewJob = { ...newJobData, id: newJobId };

    // 2. Dynamically select the target column based on the user's input
    const targetColumn = data.columns[selectedStatus];
    
    const newJobIds = Array.from(targetColumn.jobIds);
    newJobIds.push(newJobId); // Add the job ID to the bottom of the selected column

    // 3. Update the state with the dynamic target column
    setData(prevData => ({
      ...prevData,
      jobs: { ...prevData.jobs, [newJobId]: formattedNewJob },
      columns: {
        ...prevData.columns,
        [selectedStatus]: { ...targetColumn, jobIds: newJobIds }
      }
    }));
    
    setShowModal(false);
  };

  // 4. Delete Job Logic (Local State)
  const handleDeleteJob = (jobId, columnId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

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
  };

  // 5. Drag and Drop Logic (Local State)
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = data.columns[source.droppableId];
    const finishColumn = data.columns[destination.droppableId];

    // Moving within the SAME column
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

    // Moving to a DIFFERENT column
    const startJobIds = Array.from(startColumn.jobIds);
    startJobIds.splice(source.index, 1);
    
    const finishJobIds = Array.from(finishColumn.jobIds);
    finishJobIds.splice(destination.index, 0, draggableId);

    setData({
      ...data,
      columns: {
        ...data.columns,
        [startColumn.id]: { ...startColumn, jobIds: startJobIds },
        [finishColumn.id]: { ...finishColumn, jobIds: finishJobIds }
      }
    });
  };

  // 6. The UI
  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <h2>CareerFlow Tracker</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
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
                />
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
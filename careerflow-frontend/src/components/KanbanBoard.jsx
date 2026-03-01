import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Column from './Column';
// import { DragDropContext } from '@hello-pangea/dnd';

const KanbanBoard = () => {
  // Example state structure
  const [columns, setColumns] = useState({
    wishlist: { id: 'wishlist', title: 'Wishlist', jobIds: [] },
    applied: { id: 'applied', title: 'Applied', jobIds: [] },
    interviewing: { id: 'interviewing', title: 'Interviewing', jobIds: [] },
    rejected: { id: 'rejected', title: 'Rejected', jobIds: [] }
  });
  const [jobs, setJobs] = useState({});

  useEffect(() => {
    // TODO: Fetch initial data via GET request to your Express backend
  }, []);

  const onDragEnd = (result) => {
    // TODO: Handle drag logic and PUT request to update status
  };

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      <h2 className="mb-4 text-center">CareerFlow Tracker</h2>
      {/* <DragDropContext onDragEnd={onDragEnd}> */}
        <Row className="flex-nowrap overflow-auto pb-3">
          {Object.values(columns).map(column => (
            <Col xs={12} md={6} lg={3} key={column.id}>
              <Column 
                column={column} 
                jobs={column.jobIds.map(jobId => jobs[jobId])} 
              />
            </Col>
          ))}
        </Row>
      {/* </DragDropContext> */}
    </Container>
  );
};

export default KanbanBoard;
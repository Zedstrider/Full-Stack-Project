import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';

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

  // This function fires the moment the user drops a card
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // 1. If dropped outside a droppable area, do nothing
    if (!destination) return;

    // 2. If dropped in the exact same spot it started, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = data.columns[source.droppableId];
    const finishColumn = data.columns[destination.droppableId];

    // 3. Moving within the SAME column
    if (startColumn === finishColumn) {
      const newJobIds = Array.from(startColumn.jobIds);
      newJobIds.splice(source.index, 1); // Remove from old index
      newJobIds.splice(destination.index, 0, draggableId); // Insert at new index

      const newColumn = { ...startColumn, jobIds: newJobIds };
      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn }
      });
      return;
    }

    // 4. Moving from ONE column to ANOTHER
    const startJobIds = Array.from(startColumn.jobIds);
    startJobIds.splice(source.index, 1); // Remove from source
    const newStart = { ...startColumn, jobIds: startJobIds };

    const finishJobIds = Array.from(finishColumn.jobIds);
    finishJobIds.splice(destination.index, 0, draggableId); // Insert into destination
    const newFinish = { ...finishColumn, jobIds: finishJobIds };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    });

    // TODO: Right here is where you will eventually fire your PUT request 
    // using axios to update the job's status in your Node/Express backend!
  };

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      <h2 className="mb-4 text-center">CareerFlow Tracker</h2>
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
    </Container>
  );
};

export default KanbanBoard;
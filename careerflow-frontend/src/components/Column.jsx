import React from 'react';
import { Card } from 'react-bootstrap';
import { Droppable } from '@hello-pangea/dnd';
import JobCard from './JobCard';

const Column = ({ column, jobs }) => {
  return (
    <Card className="h-100 bg-white border-0 shadow-sm">
      <Card.Header className="bg-transparent border-0 pt-3 pb-0">
        <h5 className="mb-0">{column.title}</h5>
      </Card.Header>
      
      <Card.Body className="p-2">
        {/* droppableId must match the column id from our state */}
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              // innerRef links the DOM element to the library
              ref={provided.innerRef}
              // droppableProps supplies necessary aria-attributes
              {...provided.droppableProps}
              // Optional: Change background color slightly when a card is dragged over it
              className={`min-vh-50 p-2 rounded ${snapshot.isDraggingOver ? 'bg-light' : ''}`}
              style={{ minHeight: '200px' }} // Ensure empty columns have drop space
            >
              {jobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}
              
              {/* placeholder is required! It takes up space so the list doesn't collapse when an item is dragged out */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Card.Body>
    </Card>
  );
};

export default Column;
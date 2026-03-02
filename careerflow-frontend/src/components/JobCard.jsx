import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Draggable } from '@hello-pangea/dnd';

const JobCard = ({ job, index }) => {
  return (
    // draggableId must be a string and completely unique
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // Optional: Add a subtle styling change when the card is actively being picked up
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1
          }}
        >
          <Card className="mb-3 shadow-sm border-0 bg-white">
            <Card.Body className="p-3">
              <Card.Title className="h6 mb-1">{job.role}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
                {job.company}
              </Card.Subtitle>
              <Badge bg="secondary" className="fw-normal">
                {job.location}
              </Badge>
            </Card.Body>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default JobCard;
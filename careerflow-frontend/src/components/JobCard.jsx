import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap'; 
import { Draggable } from '@hello-pangea/dnd';

const JobCard = ({ job, index, columnId, handleDeleteJob }) => { 
  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1
          }}
        >
          {/* Add position-relative so the absolute delete button positions correctly */}
          <Card className="mb-3 shadow-sm border-0 bg-white position-relative">
            
            {/* 3. FIXED: Wrapped the comment in curly braces */}
            <Button 
              variant="link" 
              className="text-danger position-absolute top-0 end-0 p-2" 
              style={{ textDecoration: 'none', zIndex: 10 }}
              onClick={() => handleDeleteJob(job.id, columnId)}
            >
              <i className="bi bi-trash"></i>
            </Button>

            {/* Added pe-4 to the Card.Body so the text doesn't overlap the trash icon */}
            <Card.Body className="p-3 pe-4"> 
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
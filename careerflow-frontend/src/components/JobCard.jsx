import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap'; 
import { Draggable } from '@hello-pangea/dnd';

const JobCard = ({ job, index, columnId, handleDeleteJob, openEditModal }) => { 
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
            
            <div className="position-absolute top-0 end-0 p-2 d-flex gap-2" style={{ zIndex: 10 }}>
              <Button 
                variant="link" 
                className="text-secondary p-0" 
                style={{ textDecoration: 'none' }}
                onClick={() => openEditModal(job)}
              >
                <i className="bi bi-pencil-square"></i>
              </Button>
              <Button 
                variant="link" 
                className="text-danger p-0" 
                style={{ textDecoration: 'none' }}
                onClick={() => handleDeleteJob(job.id, columnId)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </div>

            {/* Added pe-4 to the Card.Body so the text doesn't overlap the trash icon */}
            <Card.Body className="p-3 pe-5"> 
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
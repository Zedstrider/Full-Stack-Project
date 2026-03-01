import React from 'react';
import { Card, Badge } from 'react-bootstrap';
// import { Draggable } from '@hello-pangea/dnd';

const JobCard = ({ job, index }) => {
  if (!job) return null;

  return (
    // <Draggable draggableId={job.id} index={index}>
    //   {(provided) => (
        <Card 
          className="mb-3 shadow-sm"
          // ref={provided.innerRef}
          // {...provided.draggableProps}
          // {...provided.dragHandleProps}
        >
          <Card.Body>
            <Card.Title className="h6">{job.role}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted text-sm">
              {job.company}
            </Card.Subtitle>
            <Badge bg="secondary">{job.location}</Badge>
          </Card.Body>
        </Card>
    //   )}
    // </Draggable>
  );
};

export default JobCard;
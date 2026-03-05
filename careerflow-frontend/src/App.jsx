import React from 'react';
import KanbanBoard from './components/KanbanBoard'; // Import your new board!

function App() {
  return (
    // We wrap it in a div, but KanbanBoard handles the layout
    <div className="App">
      <KanbanBoard />
    </div>
  );
}

export default App;
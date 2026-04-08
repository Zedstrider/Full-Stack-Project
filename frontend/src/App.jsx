import React, { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import AuthScreen from './components/AuthScreen';
import { Button } from 'react-bootstrap'; // Make sure this is imported

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if they are already logged in when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          {/* A simple logout button at the top right of your app */}
          <div className="d-flex justify-content-end bg-light p-3">
            <span className="me-3 mt-2 fw-bold text-secondary">
              Hi, {localStorage.getItem('username')}
            </span>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <KanbanBoard />
        </>
      ) : (
        <AuthScreen setAuthStatus={setIsAuthenticated} />
      )}
    </div>
  );
}

export default App;
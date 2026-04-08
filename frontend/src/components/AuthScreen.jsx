import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../api'; // Import custom Axios instance

const AuthScreen = ({ setAuthStatus }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await api.post(endpoint, payload);

      // Save the token and username to the browser's local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      
      // Tell the main App component that we are logged in!
      setAuthStatus(true);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card className="shadow-sm border-0 rounded-lg mt-5">
          <Card.Body className="p-5">
            <h2 className="text-center mb-4 fw-bold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text"                  
                  name="username"              
                  placeholder="Enter username" 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="password" 
                  placeholder="Enter your password" 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
                {isLogin ? 'Log In' : 'Sign Up'}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <span className="text-muted">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <Button 
                variant="link" 
                className="p-0 text-decoration-none" 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default AuthScreen;
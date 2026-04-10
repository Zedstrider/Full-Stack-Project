import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../api';
import './AuthScreen.css'; // Import our new custom styles

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

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      
      setAuthStatus(true);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Container fluid className="p-0 auth-container">
      <Row className="g-0 min-vh-100">
        
        {/* LEFT COLUMN: Branding/Hero (Hidden on mobile devices) */}
        <Col lg={5} className="d-none d-lg-flex flex-column justify-content-center p-5 auth-hero shadow">
          <div className="ps-xl-5">
            <h1 className="display-4 fw-bolder mb-4">Job Application Tracker</h1>
            <p className="lead fw-normal mb-5" style={{ opacity: 0.9 }}>
              Stop using spreadsheets. Start tracking your software engineering applications the right way.
            </p>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-white bg-opacity-25 rounded-circle p-2 me-3">
                {/* A simple SVG checkmark */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span className="fs-5">Seamless Drag & Drop Pipeline</span>
            </div>
            <div className="d-flex align-items-center">
              <div className="bg-white bg-opacity-25 rounded-circle p-2 me-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <span className="fs-5">Secure JWT Authentication</span>
            </div>
          </div>
        </Col>

        {/* RIGHT COLUMN: The Form */}
        <Col lg={7} className="d-flex align-items-center justify-content-center p-4 p-sm-5">
          <div className="w-100" style={{ maxWidth: '420px' }}>
            
            {/* Mobile Title (Only shows on small screens) */}
            <div className="d-lg-none text-center mb-5">
              <h1 className="fw-bolder text-primary">CareerFlow</h1>
            </div>

            <Card className="auth-card p-4 p-sm-5">
              <h2 className="fw-bold mb-1">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-muted mb-4">
                {isLogin ? 'Enter your details to access your board.' : 'Start tracking your applications today.'}
              </p>
              
              {error && <Alert variant="danger" className="border-0 rounded">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="username">
                  <Form.Label className="fw-semibold text-secondary small text-uppercase tracking-wider">Username</Form.Label>
                  <Form.Control 
                    type="text"                  
                    name="username"              
                    placeholder="Enter username" 
                    onChange={handleChange} 
                    className="auth-input"
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="fw-semibold text-secondary small text-uppercase tracking-wider">Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="password" 
                    placeholder="••••••••" 
                    onChange={handleChange} 
                    className="auth-input"
                    required 
                  />
                </Form.Group>

                <Button type="submit" className="w-100 auth-btn mt-2">
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </Button>
              </Form>

              <div className="text-center mt-4 pt-3 border-top">
                <span className="text-muted small">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <Button 
                  variant="link" 
                  className="p-0 auth-link-btn small" 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                >
                  {isLogin ? 'Sign up for free' : 'Log in here'}
                </Button>
              </div>
            </Card>
          </div>
        </Col>

      </Row>
    </Container>
  );
};

export default AuthScreen;
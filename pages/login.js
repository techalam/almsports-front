import { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/slices/authSlice';
import { useRouter } from 'next/router';
import { endpoint } from '@/utils/factory';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.post(`${endpoint?.baseUrl}/api/auth/login`, {
        email,
        password,
      });
  
      // On success, store user info and tokens in Redux (redux-persist will handle persisting)
      const { user, accessToken, refreshToken } = response.data;
  
      // Save user and tokens to Redux
      dispatch(setUser({
        user,
        accessToken,
        refreshToken
      }));
  
      // Redirect to dashboard
      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };
 

  return (
    <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h3>Login</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
    </Container>
  );
}

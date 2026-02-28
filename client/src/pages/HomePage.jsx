import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // You'll need to install @mui/icons-material
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
    }
    setIsSubmitting(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      bgcolor: '#f5f5f5' // Light grey background makes the white card pop
    }}>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Welcome Back
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ py: 1.5, textTransform: 'none', fontSize: '1.1rem', borderRadius: 2 }}
            >
              {isSubmitting ? <CircularProgress size={26} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
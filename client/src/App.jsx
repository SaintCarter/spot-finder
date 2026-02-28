import { Outlet, useNavigate, Link as RouterLink } from 'react-router';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  CircularProgress,
  Link
} from '@mui/material';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated, logout, loading, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Send them home after logging out
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Modern Navigation Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 700 
            }}
          >
            MY APP
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" component={RouterLink} to="/">
              Home
            </Button>

            {isAuthenticated ? (
              <>
                <Button color="inherit" component={RouterLink} to="/dashboard">
                  Dashboard
                </Button>
                
                {/* Optional: Show user email/name in the nav */}
                <Typography variant="body2" sx={{ opacity: 0.8, ml: 1 }}>
                  {user?.email}
                </Typography>

                <Button 
                  variant="outlined" 
                  color="inherit" 
                  onClick={handleLogout}
                  sx={{ ml: 1, borderColor: 'rgba(255,255,255,0.5)' }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={RouterLink} to="/">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>

      {/* Optional Footer */}
      <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: 'background.paper', mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} My App Inc.
        </Typography>
      </Box>
    </Box>
  );
}
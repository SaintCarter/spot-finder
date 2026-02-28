import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

export default function DashboardPage() {
const apiUrl = import.meta.env.API_URL || 'http://localhost:10000';
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${apiUrl}/api/userData/dashboard-data`, {
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        // If the server says NO, we clear the local state and redirect
        logout(); 
        navigate('/');
      }
    };

    fetchData();
  }, [logout, navigate]);

  if (!data) return <p>Loading secure data...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Secure Dashboard</h1>
      <p>Secret Stats: {data.message}</p>
    </div>
  );
}
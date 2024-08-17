import { useState, useEffect } from 'react';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import axiosInstance from './axiosInstance';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the access token is available in session storage
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      setIsLoggedIn(true);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      <h1>Authentication App</h1>
      {!isLoggedIn ? (
        <>
          <Register />
          <Login onLogin={handleLogin} />
        </>
      ) : (
        <Logout onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;

import { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

const User2 = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/user2', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        setError('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>User Data</h2>
      {error && <p>{error}</p>}
      {userData ? (
        <div>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Phone: {userData.phone_number}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default User2;

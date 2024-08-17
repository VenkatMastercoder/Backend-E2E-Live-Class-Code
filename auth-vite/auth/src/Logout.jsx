/* eslint-disable react/prop-types */

const Logout = ({ onLogout }) => {
  const handleLogout = () => {
    // Remove tokens from session storage
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');

    // Call the onLogout callback to update the parent component's state
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;

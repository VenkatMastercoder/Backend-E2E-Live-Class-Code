/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
                      // <User/>
const RequireAuth = ({ children }) => {
  const accessToken = sessionStorage.getItem('accessToken');
  if (!accessToken) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};


// <RequireAuth name="sd"/>

// <RequireAuth> <User/> </RequireAuth>

// {RequireAuth(dfvdffdvfd)}
export default RequireAuth;
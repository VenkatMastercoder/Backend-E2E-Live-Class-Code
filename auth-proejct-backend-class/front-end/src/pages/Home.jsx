import { useState, useEffect } from "react";
import Register from "../component/Register";
import Login from "../component/Login";
import Logout from "../component/Logout";
import { axiosInstance } from "../Interceptor/AxiosInstance";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the access token is available in session storage
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    }
  }, [isLoggedIn]);

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
          <div className="border border-red-500">
            <Register />
          </div>
          <div className="border border-green-500">
            <Login onLogin={handleLogin} />
            <Logout onLogout={handleLogout} />
          </div>
        </>
      ) : (
        <Logout onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;

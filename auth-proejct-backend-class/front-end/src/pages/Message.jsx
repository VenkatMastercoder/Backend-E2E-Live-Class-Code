
import { useNavigate } from "react-router-dom";


function Message() {

  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Remove tokens from session storage
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/login")
  };

  return (
    <>
      <p>User Login in Scessfully</p>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default Message;

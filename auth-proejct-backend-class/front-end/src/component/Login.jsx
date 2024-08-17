/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../Interceptor/AxiosInstance";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      if (response.data.token) {
        // Save tokens in session storage
        sessionStorage.setItem("accessToken", response.data.token.accessToken);
        sessionStorage.setItem(
          "refreshToken",
          response.data.token.refreshToken
        );

        if (onLogin) {
          onLogin();
        }

        setMessage("Login successful");
        navigate("/");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("An error occurred during login.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
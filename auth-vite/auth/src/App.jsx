import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4001",
  withCredentials: true,
});

const loginFunction = () => {
  console.log("sgvfrd");

  axiosInstance.post("/login", {
    email: "venkatesangunaraj@gmail.com",
    password: "fvdfd",
  });
};

const logoutFunction = () => {
  console.log("sgvfrd");

  axiosInstance.post("/logout");
};

const App = () => {
  return (
    <>
      <button onClick={loginFunction}>Login</button>

      <button>Renew</button>

      <button onClick={logoutFunction}>Logout</button>
    </>
  );
};

export default App;

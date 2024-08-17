import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Message from "./pages/Message";
import Register from "./component/Register";
import Login from "./component/Login";
import User from "./pages/User";
import RequireAuth from "./component/RequireAuth";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route path="/message" element={<Message />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/user"
            element={
              <RequireAuth>
                <User />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

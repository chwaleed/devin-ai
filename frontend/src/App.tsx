import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Project from "./pages/Project";
import { context } from "./context/context";
import ProtectedRoutes from "./pages/components/ProtectedRoutes";
import PublicRoutes from "./pages/components/PublicRoutes";
import { useContext, useEffect } from "react";
function App() {
  const { methods } = useContext(context);
  useEffect(() => {
    methods.verifyToken();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="*" element={<Login />} /> */}
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Project />} />
          {/* <Route path="*" element={<Home />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

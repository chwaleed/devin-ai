import { useContext } from "react";
import { context } from "../../context/context";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes() {
  const { state } = useContext(context);

  return state.user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;

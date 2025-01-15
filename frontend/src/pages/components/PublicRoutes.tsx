import { useContext } from "react";
import { context } from "../../context/context";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoutes() {
  const { state } = useContext(context);

  return state.user ? <Navigate to="/" /> : <Outlet />;
}

export default PublicRoutes;

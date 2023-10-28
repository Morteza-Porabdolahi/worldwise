import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }) => {
  const { isAuth } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(!isAuth) navigate('/login', { replace: true });
  }, [isAuth, navigate])
  
  return isAuth ? children : null;
}

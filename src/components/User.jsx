import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

import styles from "./User.module.css";

export function User() {
  const navigate = useNavigate();
  const { logout, user } = useUserContext();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

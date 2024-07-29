import { logout } from "../../features/auth/authSlice";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import "./Header.css";
import LoginForm from "../LoginForm/LoginForm";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const userData = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleNavigateSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="header">
      {userData ? (
        <p>Welcome back {userData.username}</p>
      ) : (
        <button onClick={handleNavigateSignup}>Create an account</button>
      )}
      {userData ? (
        <div>
          <button>Create QCM</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

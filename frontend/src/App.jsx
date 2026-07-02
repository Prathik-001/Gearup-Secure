import "./App.css";
import { useEffect } from "react";
import Navbar from "./components/Navbar/nav";
import { Outlet } from "react-router-dom";
import authService from "./appright/auth";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser().then((userData) => {
      if (userData) {
        const isAdmin =userData.prefs?.isAdmin === true || userData.prefs?.isAdmin === "true";
        dispatch(
          login({
            userData,
            userId: userData.$id,
            isAdmin,
          })
        );
      } else {
        dispatch(logout());
      }
    });
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;

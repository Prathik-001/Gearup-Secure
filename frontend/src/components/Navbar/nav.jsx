import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiMenu, FiX } from "react-icons/fi";
import authService from "../../appright/auth";
import { logout as authLogout } from "../../store/authSlice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = async () => {
    // Show SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Blue button
      cancelButtonColor: '#d33', // Red cancel button
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const res = await authService.logout();
        if (res) {
          dispatch(authLogout());
                toast.success("Logout Successful.", {
                    position: "top-center",
                    className: "bg-red-600 text-white font-bold rounded-lg shadow-lg",
                    bodyClassName: "text-sm",
                    progressClassName: "bg-white",
                    theme: "light",
                  });
          navigate("/");
        }
      } catch (err) {
        console.error(err.message);
      }
    }
  };


  return (
    <header className="bg-white shadow-md w-full z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-blue-600">GearUp</div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 font-semibold hover:text-blue-600">Home</Link>
            <Link to="/about" className="text-gray-600 font-semibold hover:text-blue-600">About</Link>

            {!authStatus ? (
              <>
                <Link to="/login" className="text-gray-600 font-semibold hover:text-blue-600">Login</Link>
                <Link to="/singup" className="text-gray-600 font-semibold hover:text-blue-600">Signup</Link>
              </>
            ) : (
              <>
                {isAdmin ? (<>
                  <Link to="/FY5675ytrytavytf6gvyvhCXt" className="text-gray-600 font-semibold hover:text-blue-600">Admin</Link>
                  </>
                )
                :(<>
                 <Link to="/userdash" className="text-gray-600 font-semibold hover:text-blue-600">Dashboard</Link>
                </>)}
                <button onClick={logoutUser} className="text-red-600">Logout</button>
              </>
            )}
          </nav>

          <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
            {!authStatus ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                <Link to="/singup" className="text-gray-600 hover:text-blue-600">Signup</Link>
              </>
            ) : (
              <>
                {isAdmin ? (
                  <Link to="/FY5675ytrytavytf6gvyvhCXt" className="text-blue-600 hover:text-blue-600">Admin</Link>
                ):(
                <Link to="/userdash" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                )
                }
                
                <button onClick={logoutUser} className="text-red-600">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

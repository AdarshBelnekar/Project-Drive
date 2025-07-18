import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow flex justify-between items-center px-6 py-3 ">
      <div className="flex items-center gap-3">
        <img src="/drive-icon.png" alt="logo" className="w-8 h-8" />
        <h1 className="text-xl font-semibold text-gray-800">My Drive</h1>
      </div>
      <div className="space-x-4">
        {isAuth ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link to="/signup" className="text-gray-600 hover:text-blue-600">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

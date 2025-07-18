// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./components/AuthContext"; // adjust path

function App() {
  const { isAuth } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuth ? <Navigate to="/dash" replace /> : <Signup />}
      />
      <Route
        path="/dash"
        element={isAuth ? <Dashboard /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to={isAuth ? "/dash" : "/"} replace />} />
    </Routes>
  );
}

export default App;

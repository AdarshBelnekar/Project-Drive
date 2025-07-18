// src/components/AuthContext.jsx (or src/contexts/AuthContext.jsx)
import React, { createContext, useContext, useState } from "react";

// Create the context
const AuthContext = createContext();

// Create the provider
export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the context
export function useAuth() {
  return useContext(AuthContext);
}

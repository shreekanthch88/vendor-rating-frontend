import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      let stored = sessionStorage.getItem("user");
      if (!stored) {
        stored = localStorage.getItem("user");
        if (stored) {
          sessionStorage.setItem("user", stored);
          const legacyToken = localStorage.getItem("token");
          if (legacyToken) {
            sessionStorage.setItem("token", legacyToken);
          }
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, token) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
import { createContext, useState } from "react";

// Define the user type
type User = { name: string; role: string } | null;

// Define the context type
type AuthContextType = {
  user: User;
  role: string | undefined;
  login: (role: string) => void;
  logout: () => void;
};

// context/AuthContext.tsx
const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  role: undefined, 
  login: () => {}, 
  logout: () => {} 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const login = (role: string) => setUser({ name: 'IT Manager', role });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, role: user?.role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

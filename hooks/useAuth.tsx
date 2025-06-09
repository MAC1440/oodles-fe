"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  role: "IT Manager" | "Employee";
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<any>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<any>;
  logout: () => void;
  loading: boolean;
  isLoggingIn?: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true); // load until local storage loads
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // done loading after checking localStorage
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoggingIn(true);
    const res = await fetch("/api/users?action=login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setIsLoggingIn(false);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
    }
    return data;
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    const res = await fetch("/api/users?action=signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, loading, isLoggingIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

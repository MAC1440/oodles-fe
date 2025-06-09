"use client";
import store from "@/redux/store";
import { AuthProvider } from "@/hooks/useAuth";
import React from "react";
import { Provider } from "react-redux";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
};

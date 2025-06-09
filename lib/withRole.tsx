"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withRole(Component: React.FC, allowedRoles: string[]) {
  return function WrappedComponent(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace("/login");
        } else if (!allowedRoles.includes(user.role)) {
          router.replace("/unauthorized");
        }
      }
    }, [user, loading, router]);

    // Optional: render loading spinner here
    if (loading) return null;

    // Avoid rendering the component if redirect is about to happen
    if (!user || !allowedRoles.includes(user.role)) return null;

    return <Component {...props} />;
  };
}

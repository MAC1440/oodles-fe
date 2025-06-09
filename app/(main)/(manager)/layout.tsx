"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  Laptop,
  User,
  LayoutDashboard,
  LogOut,
  FlaskConical,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Devices", href: "/devices", icon: Laptop },
  { label: "Employees", href: "/employees", icon: User },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-emerald-900 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-4 border-b border-emerald-700">
            <h1 className="text-xl font-bold tracking-wide flex justify-center w-100 gap-3">
              <FlaskConical />
              Easyfill
            </h1>
            <button
              className="lg:hidden text-emerald-400 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex gap-2 px-4 py-2 rounded-md transition-colors ${
                  pathname.startsWith(item.href)
                    ? "bg-emerald-700 text-white"
                    : "text-emerald-400 hover:bg-emerald-800 hover:text-white"
                }`}
                onClick={() => setOpen(false)}
              >
                {<item.icon />}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto px-4 py-4">
            <button
              onClick={handleLogout}
              className="flex gap-3 justify-center w-full rounded-md bg-amber-600 px-4 py-2 text-sm font-medium hover:bg-amber-700 cursor-pointer"
            >
              <LogOut /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-30 p-2 text-emerald-800 lg:hidden bg-white shadow rounded-md"
      >
        <Menu />
      </button>
      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <div className="capitalize bg-gray-200 text-center text-emerald-900 text-4xl p-3 font-bold shadow-lg">
          {path.replace("/", "")}
        </div>
        {children}
      </div>
    </div>
  );
}

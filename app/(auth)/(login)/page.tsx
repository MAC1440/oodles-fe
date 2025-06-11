"use client";

import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import bg from "../../../public/bg.jpg";
export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("alice@company.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.error) {
      setError(res.error);
    } else {
      router.push(
        res.user.role === "IT Manager" ? "/dashboard" : "/employee-dashboard"
      );
    }
  };

  return (
    <>
      <Head>Login</Head>
      <div
        className="min-h-screen flex items-center justify-center bg-emerald-100 px-4 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg.src})`,
        }}
      >
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-emerald-600">
            Login
          </h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="cursor-pointer w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Loading . . ." : "Login"}
          </button>

          <p className="text-sm mt-4 text-center text-black ">
            Dummy login:
            <p className="text-sm mt-4 text-center text-black">
              Email: alice@company.com
              <br />
              Password: password123
            </p>
          </p>
        </form>
      </div>
    </>
  );
}

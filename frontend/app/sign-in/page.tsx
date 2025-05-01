"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";
import { Layers, Mail, Lock, AlertCircle } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const SERVER_URL = "http://localhost:3001/api/login";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
  
    try {
      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Invalid credentials");
        return;
      }
  
      const data = await response.json();
  
      // 👇 Use signIn from context with received user/token info
      await signIn(email, password); // Pass email and password as separate arguments
  
      console.log("Login success:", data);
      router.push("/"); // Redirect to protected page
    } catch (error) {
      console.error("Login error:", error);
      setError("Could not connect to the server");
    }
  };
  

  return (
    <div className="min-h-screen bg-[#18191A] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="mr-1 bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:shadow-blue-500/40">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">FUND</span>
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                CHAIN
              </span>
            </span>
          </Link>
        </div>

        <div className="bg-[#242526] rounded-xl border border-[#3A3B3C] shadow-xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            Sign In
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm text-[#B0B3B8] font-medium flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-[#3A3B3C] border border-[#4E4F50] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm text-[#B0B3B8] font-medium flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-[#3A3B3C] border border-[#4E4F50] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#B0B3B8]">
              {"Don't have an account? "}
              <Link href="/sign-up" className="text-blue-400 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

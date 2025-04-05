"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Layers, Mail, Lock, User, AlertCircle } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const success = await signUp(email, password, name);

    if (success) {
      router.push("/projects");
    } else {
      setError("Failed to create account. Email may already be in use.");
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
            Create Account
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm text-[#B0B3B8] font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-[#3A3B3C] border border-[#4E4F50] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

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
                placeholder="Create a password"
                className="w-full px-4 py-3 rounded-lg bg-[#3A3B3C] border border-[#4E4F50] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm text-[#B0B3B8] font-medium flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#B0B3B8]">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-400 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

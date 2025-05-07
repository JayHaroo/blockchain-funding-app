"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const userId = user?.id || null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut();
    router.push("/sign-in");
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[#3A3B3C] bg-black/90 backdrop-blur-md shadow-lg"
          : "bg-black/70 backdrop-blur-sm"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">FUND</span>
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                CHAIN
              </span>
            </span>
          </Link>

          <div className="relative ml-4 hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="h-10 w-64 rounded-full bg-[#3A3B3C] border border-[#4E4F50] pl-10 pr-4 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder:text-gray-500"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="ml-2 bg-transparent text-white hover:bg-[#3A3B3C] transition-colors duration-200 flex items-center gap-1 font-medium px-3 py-1.5"
              >
                Fund{" "}
                <ChevronDown className="h-4 w-4 text-white/70 transition-transform duration-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 bg-[#242526] backdrop-blur-md border border-[#3A3B3C] text-white rounded-xl overflow-hidden shadow-xl"
            >
              <DropdownMenuItem className="py-3 px-4 hover:bg-[#3A3B3C] cursor-pointer transition-colors duration-200 focus:bg-[#3A3B3C]">
                <Link href="/fundraiser/create" className="w-full block">
                  Create Fundraiser
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3 px-4 hover:bg-[#3A3B3C] cursor-pointer transition-colors duration-200 focus:bg-[#3A3B3C]">
                <Link href="/projects" className="w-full block">
                  Browse Projects
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3 px-4 hover:bg-[#3A3B3C] cursor-pointer transition-colors duration-200 focus:bg-[#3A3B3C]">
                <Link href="/donations" className="w-full block">
                  My Donations
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-gray-600"></div>
              <div className="h-4 w-20 rounded bg-gray-600"></div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white hover:bg-[#3A3B3C] w-[120px]"
                  >
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                    <span className="text-sm text-white">
                      {user.name || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-[#242526] text-white border border-[#3A3B3C] rounded-xl">
                  <DropdownMenuItem className="py-2 px-4 hover:bg-[#3A3B3C] cursor-pointer">
                    <Link href='/profile' className="w-full block">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="py-2 px-4 hover:bg-[#3A3B3C] cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="bg-transparent hover:bg-[#3A3B3C] text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Connect Wallet Button */}
          <div className="ml-4">
            <div className="bg-transparent text-white hover:bg-[#3A3B3C] focus:ring-2 focus:ring-blue-500 rounded-full">
              <ConnectButton
                accountStatus="address"
                showBalance={false}
                chainStatus="icon"
                label="Connect Wallet"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

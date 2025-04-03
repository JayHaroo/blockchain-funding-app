"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Search, ChevronDown, Layers } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-blue-500/20 bg-black/90 backdrop-blur-md shadow-lg shadow-blue-900/10"
          : "bg-black/70 backdrop-blur-sm"
      }`}
    >
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-6">
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

          <div className="relative ml-4 hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="h-10 w-64 rounded-full bg-gray-900/70 border border-blue-900/30 pl-10 pr-4 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder:text-gray-500"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="ml-2 bg-transparent hover:bg-blue-900/20 text-gray-200 hover:text-white transition-colors duration-300 flex items-center gap-1 font-medium"
              >
                Fund{" "}
                <ChevronDown className="h-4 w-4 text-blue-400 transition-transform duration-300 ease-in-out group-open:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 bg-gray-900/95 backdrop-blur-md border border-blue-900/30 text-white rounded-xl overflow-hidden shadow-xl shadow-blue-900/20"
            >
              <DropdownMenuItem className="py-3 px-4 hover:bg-blue-900/30 cursor-pointer transition-colors duration-200 focus:bg-blue-900/40">
                <Link href="/fundraiser/create" className="w-full block">
                  Create Fundraiser
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3 px-4 hover:bg-blue-900/30 cursor-pointer transition-colors duration-200 focus:bg-blue-900/40">
                <Link href="/projects" className="w-full block">
                  Browse Projects
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3 px-4 hover:bg-blue-900/30 cursor-pointer transition-colors duration-200 focus:bg-blue-900/40">
                <Link href="/donations" className="w-full block">
                  My Donations
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/how-it-works"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 relative group"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="bg-gradient-to-r from-blue-900/50 to-blue-700/50 p-[1px] rounded-lg">
            <div className="bg-gray-900/80 rounded-lg">
              <ConnectButton
                accountStatus="address"
                showBalance={false}
                chainStatus="icon"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

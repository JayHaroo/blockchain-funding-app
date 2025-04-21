"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  Download
} from "lucide-react";

type Donation = {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  token: string;
  date: string;
  transactionHash: string;
  type: "one-time" | "recurring";
  status: "completed" | "pending" | "failed";
  donor: string;
  network: string;
};

export default function MyDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "completed" | "pending">("all");

  useEffect(() => {
    // Load donations from localStorage
    const loadedDonations = JSON.parse(localStorage.getItem("donations") || "[]");
    setDonations(loadedDonations);
    setFilteredDonations(loadedDonations);
  }, []);

  useEffect(() => {
    let result = [...donations];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (donation) =>
          donation.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.transactionHash.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilter !== "all") {
      result = result.filter((donation) => donation.status === activeFilter);
    }

    // Sort by date descending by default
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredDonations(result);
  }, [donations, searchTerm, activeFilter]);

  const getTotalDonated = () => {
    return donations.reduce((total, donation) => total + donation.amount, 0);
  };

  const getLastDonationDate = () => {
    if (donations.length === 0) return null;
    const dates = donations.map(d => new Date(d.date));
    const lastDate = new Date(Math.max(...dates.map(d => d.getTime())));
    return lastDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "pending":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "failed":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <div className="max-w-[1400px] mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8">My Donations</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#131B2F] rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Donated</p>
            <p className="text-2xl font-bold">${getTotalDonated()}</p>
          </div>
          <div className="bg-[#131B2F] rounded-lg p-4">
            <p className="text-gray-400 text-sm">Projects Supported</p>
            <p className="text-2xl font-bold">
              {new Set(donations.map((d) => d.projectId)).size}
            </p>
          </div>
          <div className="bg-[#131B2F] rounded-lg p-4">
            <p className="text-gray-400 text-sm">Last Donation</p>
            <p className="text-2xl font-bold">{getLastDonationDate() || "N/A"}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#131B2F] border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-lg ${
                activeFilter === "all"
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:bg-[#131B2F]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("completed")}
              className={`px-4 py-2 rounded-lg ${
                activeFilter === "completed"
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:bg-[#131B2F]"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveFilter("pending")}
              className={`px-4 py-2 rounded-lg ${
                activeFilter === "pending"
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:bg-[#131B2F]"
              }`}
            >
              Pending
            </button>
            <button
              className="ml-2 p-2 text-gray-400 hover:bg-[#131B2F] rounded-lg"
              title="Export donations"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-[#131B2F] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 text-gray-400 font-medium">Project</th>
                <th className="text-right p-4 text-gray-400 font-medium">Amount</th>
                <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                <th className="text-left p-4 text-gray-400 font-medium">Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center">
                        <Image
                          src="/placeholder.svg"
                          alt={donation.projectName}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{donation.projectName}</p>
                        <p className="text-sm text-gray-400">ID: {donation.projectId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <p className="font-medium">${donation.amount}</p>
                    <p className="text-sm text-gray-400">{donation.token}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{formatDate(donation.date)}</p>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full border ${getStatusClass(
                        donation.status
                      )}`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-gray-400">
                        {donation.transactionHash.slice(0, 8)}...
                      </span>
                      <Link
                        href={`https://etherscan.io/tx/${donation.transactionHash}`}
                        target="_blank"
                        className="text-blue-500 hover:text-blue-400"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDonations.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              <p>No donations found</p>
              <Link
                href="/projects"
                className="text-blue-500 hover:text-blue-400 mt-2 inline-block"
              >
                Explore projects to donate
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
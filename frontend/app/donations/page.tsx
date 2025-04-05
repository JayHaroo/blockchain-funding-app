"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Download, ArrowUpRight } from "lucide-react";

type Donation = {
  id: string;
  projectId: string;
  projectName: string;
  projectImage: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  txHash: string;
};

export default function DonationsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Generate mock donations data
  useEffect(() => {
    if (user) {
      const mockDonations: Donation[] = [
        {
          id: "d1",
          projectId: "p1",
          projectName: "Medical Support for Children",
          projectImage: "/placeholder.svg?height=40&width=40",
          amount: 50,
          date: "Apr 3, 2025",
          status: "completed",
          txHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
        },
        {
          id: "d2",
          projectId: "p2",
          projectName: "Mental Health Support Network",
          projectImage: "/placeholder.svg?height=40&width=40",
          amount: 25,
          date: "Mar 28, 2025",
          status: "completed",
          txHash: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a",
        },
        {
          id: "d3",
          projectId: "p3",
          projectName: "Blockchain Education Initiative",
          projectImage: "/placeholder.svg?height=40&width=40",
          amount: 100,
          date: "Mar 15, 2025",
          status: "completed",
          txHash: "0xz1y2x3w4v5u6t7s8r9q0p1o2n3m4l5k6j7i8h9g",
        },
        {
          id: "d4",
          projectId: "p4",
          projectName: "Sustainable Energy Project",
          projectImage: "/placeholder.svg?height=40&width=40",
          amount: 75,
          date: "Feb 22, 2025",
          status: "completed",
          txHash: "0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t",
        },
        {
          id: "d5",
          projectId: "p5",
          projectName: "Community Garden Initiative",
          projectImage: "/placeholder.svg?height=40&width=40",
          amount: 30,
          date: "Feb 10, 2025",
          status: "completed",
          txHash: "0x1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l",
        },
      ];

      setDonations(mockDonations);
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-150"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-300"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Filter and search donations
  const filteredDonations = donations.filter((donation) => {
    const matchesFilter = filter === "all" || donation.status === filter;
    const matchesSearch = donation.projectName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate total donated
  const totalDonated = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-xl p-4 sticky top-24">
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  <span>Home</span>
                </Link>

                <Link
                  href="/projects"
                  className="flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>Search Projects</span>
                </Link>

                <Link
                  href="/donations"
                  className="flex items-center gap-3 text-white bg-gray-800 p-3 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>My Donations</span>
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>My Profile</span>
                </Link>

                <Link
                  href="/communities"
                  className="flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                  <span>Communities</span>
                </Link>
              </nav>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {[
                    "Community",
                    "Medical",
                    "Education",
                    "Environment",
                    "Technology",
                  ].map((category) => (
                    <Link
                      key={category}
                      href={`/category/${category.toLowerCase()}`}
                      className="block text-gray-300 hover:text-white p-2 hover:bg-gray-800 rounded transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <h1 className="text-2xl font-bold mb-6">My Donations</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Donated</p>
                  <p className="text-2xl font-bold text-white">
                    ${totalDonated}
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Projects Supported</p>
                  <p className="text-2xl font-bold text-white">
                    {donations.length}
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Last Donation</p>
                  <p className="text-2xl font-bold text-white">
                    {donations[0]?.date || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search donations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      filter === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("completed")}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      filter === "completed"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setFilter("pending")}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      filter === "pending"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Pending
                  </button>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>

              {/* Donations Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Project
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Transaction
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.length > 0 ? (
                      filteredDonations.map((donation) => (
                        <tr
                          key={donation.id}
                          className="border-b border-gray-800 hover:bg-gray-800/50"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                <Image
                                  src={
                                    donation.projectImage || "/placeholder.svg"
                                  }
                                  alt={donation.projectName}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {donation.projectName}
                                </p>
                                <p className="text-xs text-gray-400">
                                  ID: {donation.projectId}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-medium text-green-400">
                              ${donation.amount}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-300">
                            {donation.date}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                donation.status === "completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : donation.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {donation.status.charAt(0).toUpperCase() +
                                donation.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400 truncate max-w-[100px]">
                                {donation.txHash.substring(0, 10)}...
                              </span>
                              <a
                                href={`https://etherscan.io/tx/${donation.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-full hover:bg-gray-700"
                              >
                                <ArrowUpRight className="h-3 w-3 text-blue-400" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-gray-400"
                        >
                          {searchQuery
                            ? "No donations match your search"
                            : "No donations found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommended Projects */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Recommended Projects</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Clean Water Initiative",
                    category: "Environment",
                    raised: "$3,450",
                    goal: "$10,000",
                    progress: 34,
                  },
                  {
                    name: "Tech Education for Kids",
                    category: "Education",
                    raised: "$5,280",
                    goal: "$8,000",
                    progress: 66,
                  },
                  {
                    name: "Homeless Shelter Support",
                    category: "Community",
                    raised: "$7,650",
                    goal: "$12,000",
                    progress: 63,
                  },
                ].map((project, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg overflow-hidden"
                  >
                    <div className="h-32 bg-gray-700"></div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{project.name}</h3>
                        <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                          {project.category}
                        </span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">
                            Raised: {project.raised}
                          </span>
                          <span className="text-gray-400">
                            Goal: {project.goal}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-700 rounded-full">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">
                        Donate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

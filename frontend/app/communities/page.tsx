"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, Users, Calendar, MessageCircle } from "lucide-react";

type Community = {
  id: string;
  name: string;
  image: string;
  members: number;
  description: string;
  category: string;
  joined: boolean;
};

export default function CommunitiesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Generate mock communities data
  useEffect(() => {
    const mockCommunities: Community[] = [
      {
        id: "c1",
        name: "Web3 Developers",
        image: "/placeholder.svg?height=80&width=80",
        members: 1250,
        description:
          "A community for blockchain and Web3 developers to share knowledge and collaborate on projects.",
        category: "Technology",
        joined: true,
      },
      {
        id: "c2",
        name: "Medical Fundraisers",
        image: "/placeholder.svg?height=80&width=80",
        members: 850,
        description:
          "Supporting medical causes and healthcare initiatives around the world.",
        category: "Medical",
        joined: false,
      },
      {
        id: "c3",
        name: "Education Innovators",
        image: "/placeholder.svg?height=80&width=80",
        members: 620,
        description:
          "Transforming education through technology and innovative teaching methods.",
        category: "Education",
        joined: true,
      },
      {
        id: "c4",
        name: "Environmental Champions",
        image: "/placeholder.svg?height=80&width=80",
        members: 1100,
        description:
          "Working together to protect our planet and promote sustainable practices.",
        category: "Environment",
        joined: false,
      },
      {
        id: "c5",
        name: "Community Builders",
        image: "/placeholder.svg?height=80&width=80",
        members: 780,
        description:
          "Creating stronger communities through local initiatives and support networks.",
        category: "Community",
        joined: false,
      },
      {
        id: "c6",
        name: "Crypto Enthusiasts",
        image: "/placeholder.svg?height=80&width=80",
        members: 1500,
        description:
          "Discussing cryptocurrency trends, investments, and blockchain technology.",
        category: "Technology",
        joined: true,
      },
    ];

    setCommunities(mockCommunities);
  }, []);

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

  // Filter communities based on search and active tab
  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "joined" && community.joined) ||
      (activeTab === "category" &&
        community.category.toLowerCase() === "technology");

    return matchesSearch && matchesTab;
  });

  // Toggle join community
  const toggleJoin = (id: string) => {
    setCommunities((prev) =>
      prev.map((community) =>
        community.id === id
          ? { ...community, joined: !community.joined }
          : community
      )
    );
  };

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
                  className="flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
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
                  href="/communities"
                  className="flex items-center gap-3 text-white bg-gray-800 p-3 rounded-lg transition-colors"
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
                    <button
                      key={category}
                      onClick={() =>
                        setActiveTab(
                          category.toLowerCase() === "technology"
                            ? "category"
                            : "all"
                        )
                      }
                      className={`block w-full text-left p-2 rounded transition-colors ${
                        activeTab === "category" && category === "Technology"
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Communities</h1>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search communities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">
                    <Plus className="h-4 w-4" />
                    Create Community
                  </button>
                </div>
              </div>

              <div className="flex border-b border-gray-800 mb-6">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 font-medium text-sm border-b-2 ${
                    activeTab === "all"
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  All Communities
                </button>
                <button
                  onClick={() => setActiveTab("joined")}
                  className={`px-4 py-2 font-medium text-sm border-b-2 ${
                    activeTab === "joined"
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Joined
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCommunities.length > 0 ? (
                  filteredCommunities.map((community) => (
                    <div
                      key={community.id}
                      className="bg-gray-800 rounded-lg p-4 flex gap-4"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                        <Image
                          src={community.image || "/placeholder.svg"}
                          alt={community.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{community.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {community.members.toLocaleString()} members
                              </span>
                              <span className="bg-gray-700 px-2 py-0.5 rounded">
                                {community.category}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleJoin(community.id)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              community.joined
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {community.joined ? "Joined" : "Join"}
                          </button>
                        </div>

                        <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                          {community.description}
                        </p>

                        <div className="flex gap-3 mt-3">
                          <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400">
                            <Calendar className="h-3 w-3" />
                            Events
                          </button>
                          <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400">
                            <MessageCircle className="h-3 w-3" />
                            Discussions
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center text-gray-400">
                    {searchQuery
                      ? "No communities match your search"
                      : "No communities found"}
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Community Events */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">
                Upcoming Community Events
              </h2>

              <div className="space-y-4">
                {[
                  {
                    month: "APR",
                    day: "15",
                    title: "Fundraising Workshop",
                    desc: "Learn how to create successful campaigns",
                    community: "Web3 Developers",
                    attendees: 24,
                  },
                  {
                    month: "APR",
                    day: "22",
                    title: "Community Meetup",
                    desc: "Connect with other fundraisers",
                    community: "Community Builders",
                    attendees: 42,
                  },
                  {
                    month: "MAY",
                    day: "05",
                    title: "Charity Gala",
                    desc: "Annual fundraising event",
                    community: "Medical Fundraisers",
                    attendees: 120,
                  },
                ].map((event, index) => (
                  <div
                    key={index}
                    className="flex gap-4 bg-gray-800 p-4 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-16 h-20 bg-blue-600/20 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs text-blue-400">
                        {event.month}
                      </span>
                      <span className="text-2xl font-bold text-blue-400">
                        {event.day}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{event.desc}</p>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                            {event.community}
                          </span>
                          <span className="text-xs text-gray-400">
                            {event.attendees} attending
                          </span>
                        </div>

                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded">
                          RSVP
                        </button>
                      </div>
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

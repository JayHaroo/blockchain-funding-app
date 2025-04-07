"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import {
  Heart,
  MessageCircle,
  Share2,
  ArrowUpRight,
  Home,
  Search,
  Users,
  Bookmark,
  Settings,
  TrendingUp,
  Calendar,
  HelpCircle,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the fundraiser type
type Fundraiser = {
  id: string;
  title: string;
  organizer: string;
  organizerAvatar: string;
  description: string;
  category: string;
  goal: number;
  raised: number;
  daysLeft: number;
  coverImage: string;
  isLiked: boolean;
  likes: number;
  comments: number;
  shares: number;
  createdAt?: string;
};

export default function ProjectsPage() {
  const router = useRouter();
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const observer = useRef<IntersectionObserver | null>(null);

  // Generate mock fundraiser data
  const generateMockFundraisers = (pageNum: number) => {
    const newFundraisers: Fundraiser[] = [];
    const startIndex = (pageNum - 1) * 5;

    for (let i = 0; i < 5; i++) {
      const id = `f${startIndex + i + 1}`;
      const raised = Math.floor(Math.random() * 10000);
      const goal = raised + Math.floor(Math.random() * 15000) + 5000;

      const categories = [
        "Community",
        "Medical",
        "Education",
        "Environment",
        "Technology",
        "Arts",
      ];
      const titles = [
        "Community Garden Project",
        "Medical Support for Children",
        "Educational Resources for Schools",
        "Clean Ocean Initiative",
        "Blockchain Innovation Hub",
        "Public Art Installation",
        "Renewable Energy Project",
        "Wildlife Conservation Effort",
        "Coding Bootcamp Scholarships",
        "Mental Health Support Network",
      ];

      // Generate a random date within the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      newFundraisers.push({
        id,
        title: titles[Math.floor(Math.random() * titles.length)],
        organizer: `Organizer ${startIndex + i + 1}`,
        organizerAvatar: `/placeholder.svg?height=40&width=40&text=${
          startIndex + i + 1
        }`,
        description:
          "This fundraiser aims to make a positive impact in our community through innovative solutions and collaborative efforts.",
        category: categories[Math.floor(Math.random() * categories.length)],
        goal,
        raised,
        daysLeft: Math.floor(Math.random() * 30) + 1,
        coverImage: `/placeholder.svg?height=300&width=600&text=Project ${
          startIndex + i + 1
        }`,
        isLiked: false,
        likes: Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 30),
        createdAt: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      });
    }

    return newFundraisers;
  };

  // Load initial data
  useEffect(() => {
    // Check if there are any saved fundraisers in localStorage
    const savedFundraisers = JSON.parse(
      localStorage.getItem("fundraisers") || "[]"
    );

    // Add timestamps to saved fundraisers if they don't have one
    const processedSavedFundraisers = savedFundraisers.map(
      (fundraiser: Fundraiser) => {
        if (!fundraiser.createdAt) {
          return {
            ...fundraiser,
            createdAt: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          };
        }
        return fundraiser;
      }
    );

    // Combine saved fundraisers with generated ones
    const initialFundraisers = [
      ...processedSavedFundraisers,
      ...generateMockFundraisers(1),
    ];

    setFundraisers(initialFundraisers);
  }, []);

  // Handle like fundraiser
  const handleLikeFundraiser = (id: string) => {
    setFundraisers((prev) =>
      prev.map((fundraiser) =>
        fundraiser.id === id
          ? {
              ...fundraiser,
              isLiked: !fundraiser.isLiked,
              likes: fundraiser.isLiked
                ? fundraiser.likes - 1
                : fundraiser.likes + 1,
            }
          : fundraiser
      )
    );
  };

  // Load more fundraisers
  const loadMoreFundraisers = useCallback(() => {
    if (loading) return;

    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const nextPage = page + 1;
      const newFundraisers = generateMockFundraisers(nextPage);

      setFundraisers((prev) => [...prev, ...newFundraisers]);
      setPage(nextPage);
      setLoading(false);

      // Stop after 5 pages for demo purposes
      if (nextPage >= 5) {
        setHasMore(false);
      }
    }, 1000);
  }, [loading, page]);

  // Set up intersection observer for infinite scroll
  const lastFundraiserRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreFundraisers();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMoreFundraisers]
  );

  // Filter fundraisers by category
  const filteredFundraisers =
    activeCategory === "all"
      ? fundraisers
      : fundraisers.filter(
          (f) => f.category.toLowerCase() === activeCategory.toLowerCase()
        );

  // Get trending fundraisers (top 3 by likes)
  const trendingFundraisers = [...fundraisers]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <div className="space-y-1">
                <Link
                  href="/projects"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-blue-600 font-medium"
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link
                  href="/search"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <Search className="h-5 w-5" />
                  <span>Search Projects</span>
                </Link>
                <Link
                  href="/my-donations"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <Bookmark className="h-5 w-5" />
                  <span>My Donations</span>
                </Link>
                <Link
                  href="/communities"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <Users className="h-5 w-5" />
                  <span>Communities</span>
                </Link>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <h3 className="font-medium text-gray-500 px-3 mb-2">
                Categories
              </h3>
              <div className="space-y-1">
                {[
                  "Community",
                  "Medical",
                  "Education",
                  "Environment",
                  "Technology",
                  "Arts",
                ].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category.toLowerCase())}
                    className={`flex items-center gap-3 p-3 rounded-lg w-full text-left ${
                      activeCategory === category.toLowerCase()
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span>{category}</span>
                  </button>
                ))}
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`flex items-center gap-3 p-3 rounded-lg w-full text-left ${
                    activeCategory === "all"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span>All Categories</span>
                </button>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="space-y-1">
                <Link
                  href="/settings"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/help"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Help & Support</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            {/* Create Fundraiser Card */}
            <div className="bg-white rounded-lg shadow mb-4 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden relative">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Your profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => router.push("/fundraiser/create")}
                  className="bg-gray-100 hover:bg-gray-200 rounded-full py-2 px-4 text-gray-600 flex-1 text-left"
                >
                  Start a new fundraiser...
                </button>
              </div>
              <div className="flex mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => router.push("/fundraiser/create")}
                  className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                  <Plus className="h-5 w-5 text-blue-500" />
                  <span>Create Fundraiser</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-4 p-2">
              <div className="flex overflow-x-auto hide-scrollbar">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeCategory === "all"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All Projects
                </button>
                <button
                  onClick={() => setActiveCategory("trending")}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeCategory === "trending"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Trending
                </button>
                {[
                  "Community",
                  "Medical",
                  "Education",
                  "Environment",
                  "Technology",
                  "Arts",
                ].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category.toLowerCase())}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                      activeCategory === category.toLowerCase()
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Fundraiser Posts */}
            <div className="space-y-4">
              {filteredFundraisers.map((fundraiser, index) => {
                const isLastItem = index === filteredFundraisers.length - 1;

                // Calculate progress percentage
                const progressPercentage = Math.min(
                  Math.round((fundraiser.raised / fundraiser.goal) * 100),
                  100
                );

                return (
                  <div
                    key={fundraiser.id}
                    ref={isLastItem ? lastFundraiserRef : null}
                    className="bg-white rounded-lg shadow overflow-hidden"
                  >
                    {/* Post Header */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden relative">
                            <Image
                              src={
                                fundraiser.organizerAvatar || "/placeholder.svg"
                              }
                              alt={fundraiser.organizer}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">
                              {fundraiser.organizer}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>{fundraiser.createdAt}</span>
                              <span className="mx-1">•</span>
                              <span className="flex items-center">
                                <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
                                {fundraiser.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>

                      <Link href={`/fundraiser/${fundraiser.id}`}>
                        <h2 className="text-lg font-bold mt-2 hover:text-blue-600 transition-colors">
                          {fundraiser.title}
                        </h2>
                      </Link>

                      <p className="text-gray-600 mt-1 mb-3">
                        {fundraiser.description}
                      </p>
                    </div>

                    {/* Post Image */}
                    <Link href={`/fundraiser/${fundraiser.id}`}>
                      <div className="relative h-64 w-full">
                        <Image
                          src={fundraiser.coverImage || "/placeholder.svg"}
                          alt={fundraiser.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Progress Bar */}
                    <div className="px-4 py-3">
                      <div className="flex justify-between text-sm mb-1">
                        <p className="font-bold">
                          ${fundraiser.raised.toLocaleString()}
                        </p>
                        <p className="text-gray-500">
                          raised of ${fundraiser.goal.toLocaleString()}
                        </p>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {progressPercentage}% Complete
                        </p>
                        <p className="text-xs text-gray-500">
                          {fundraiser.daysLeft} days left
                        </p>
                      </div>
                    </div>

                    {/* Post Stats */}
                    <div className="px-4 py-1 border-t border-gray-100 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                            {fundraiser.likes}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{fundraiser.comments} comments</span>
                          <span>•</span>
                          <span>{fundraiser.shares} shares</span>
                        </div>
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="px-2 py-1 border-t border-gray-100 flex">
                      <button
                        onClick={() => handleLikeFundraiser(fundraiser.id)}
                        className={`flex items-center justify-center gap-1 flex-1 py-2 rounded-md ${
                          fundraiser.isLiked
                            ? "text-blue-600"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            fundraiser.isLiked
                              ? "fill-blue-600 text-blue-600"
                              : ""
                          }`}
                        />
                        <span>Like</span>
                      </button>

                      <Link
                        href={`/fundraiser/${fundraiser.id}`}
                        className="flex items-center justify-center gap-1 flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>Comment</span>
                      </Link>

                      <button className="flex items-center justify-center gap-1 flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                        <Share2 className="h-5 w-5" />
                        <span>Share</span>
                      </button>

                      <Link
                        href={`/fundraiser/${fundraiser.id}`}
                        className="flex items-center justify-center gap-1 flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        <ArrowUpRight className="h-5 w-5" />
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-center my-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-300"></div>
                </div>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && !loading && (
              <div className="text-center my-6 text-gray-500 bg-white rounded-lg shadow p-4">
                {"You've reached the end of the projects list."}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              {/* Trending Projects */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Trending Projects</h3>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>

                <div className="space-y-3">
                  {trendingFundraisers.map((fundraiser) => (
                    <Link
                      key={fundraiser.id}
                      href={`/fundraiser/${fundraiser.id}`}
                      className="flex items-start gap-3 group"
                    >
                      <div className="h-12 w-12 rounded-lg overflow-hidden relative flex-shrink-0">
                        <Image
                          src={fundraiser.coverImage || "/placeholder.svg"}
                          alt={fundraiser.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-blue-600 line-clamp-2">
                          {fundraiser.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          ${fundraiser.raised.toLocaleString()} raised
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/trending"
                  className="block text-blue-600 text-sm text-center mt-4 hover:underline"
                >
                  See More Trending Projects
                </Link>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Upcoming Events</h3>
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-lg p-2 text-center flex-shrink-0 w-12">
                      <div className="text-xs">APR</div>
                      <div className="font-bold">15</div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">
                        Fundraising Workshop
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Learn how to create successful campaigns
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-lg p-2 text-center flex-shrink-0 w-12">
                      <div className="text-xs">APR</div>
                      <div className="font-bold">22</div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Community Meetup</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Connect with other fundraisers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-lg p-2 text-center flex-shrink-0 w-12">
                      <div className="text-xs">MAY</div>
                      <div className="font-bold">05</div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Charity Gala</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Annual fundraising event
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Fundraiser CTA */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-4 text-white">
                <h3 className="font-medium mb-2">Start Your Own Fundraiser</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Create a campaign and start raising funds for your cause
                  today.
                </p>
                <button
                  onClick={() => router.push("/fundraiser/create")}
                  className="bg-white text-blue-600 font-medium py-2 px-4 rounded-lg w-full hover:bg-blue-50 transition-colors"
                >
                  Create Fundraiser
                </button>
              </div>

              {/* Footer Links */}
              <div className="text-xs text-gray-500 p-4">
                <div className="flex flex-wrap gap-2">
                  <Link href="/about" className="hover:underline">
                    About
                  </Link>
                  <Link href="/privacy" className="hover:underline">
                    Privacy
                  </Link>
                  <Link href="/terms" className="hover:underline">
                    Terms
                  </Link>
                  <Link href="/cookies" className="hover:underline">
                    Cookies
                  </Link>
                  <Link href="/careers" className="hover:underline">
                    Careers
                  </Link>
                  <Link href="/help" className="hover:underline">
                    Help Center
                  </Link>
                </div>
                <p className="mt-2">© 2025 FundChain. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

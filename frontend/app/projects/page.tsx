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
  BookOpen,
  Lightbulb,
  Target,
  Coins,
  Shield,
  ArrowRight,
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
  endDate?: string;
  blockchain?: {
    network: string;
    contractAddress: string;
  };
};

// Define categories
const CATEGORIES = [
  { id: "all", name: "All Categories" },
  { id: "community", name: "Community" },
  { id: "medical", name: "Medical" },
  { id: "education", name: "Education" },
  { id: "environment", name: "Environment" },
  { id: "technology", name: "Technology" },
  { id: "arts", name: "Arts" },
];

// Educational content data
const EDUCATIONAL_POSTS = [
  {
    id: "p1",
    title: "Coding Bootcamp Scholarship Fund",
    description: "Help aspiring developers access quality education",
    organizer: {
      name: "Sarah Chen",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=0066FF&color=fff"
    },
    goal: 15000,
    raised: 8750,
    daysLeft: 15,
    supporters: 124,
    category: "Education"
  },
  {
    id: "p2",
    title: "STEM Education for Rural Schools",
    description: "Bringing technology and science resources to underserved areas",
    organizer: {
      name: "Michael Torres",
      avatar: "https://ui-avatars.com/api/?name=Michael+Torres&background=00CC88&color=fff"
    },
    goal: 25000,
    raised: 12300,
    daysLeft: 22,
    supporters: 198,
    category: "Education"
  },
  {
    id: "p3",
    title: "Digital Library Initiative",
    description: "Creating accessible online learning resources",
    organizer: {
      name: "Emma Watson",
      avatar: "https://ui-avatars.com/api/?name=Emma+Watson&background=FF6B6B&color=fff"
    },
    goal: 10000,
    raised: 7200,
    daysLeft: 18,
    supporters: 156,
    category: "Education"
  },
  {
    id: "p4",
    title: "Student Mental Health Support",
    description: "Providing counseling and wellness resources for students",
    organizer: {
      name: "David Park",
      avatar: "https://ui-avatars.com/api/?name=David+Park&background=845EC2&color=fff"
    },
    goal: 20000,
    raised: 15600,
    daysLeft: 12,
    supporters: 234,
    category: "Education"
  }
];

export default function ProjectsPage() {
  const router = useRouter();
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const observer = useRef<IntersectionObserver | null>(null);
  const [activeTab, setActiveTab] = useState("education");

  // Generate mock fundraiser data
  const generateMockFundraisers = (pageNum: number) => {
    const newFundraisers: Fundraiser[] = [];
    const startIndex = (pageNum - 1) * 5;

    for (let i = 0; i < 5; i++) {
      const id = `f${startIndex + i + 1}`;
      // Use deterministic values instead of random
      const raised = 5000 + ((startIndex + i) * 1000);
      const goal = raised + 10000;

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

      // Use deterministic date based on index
      const date = new Date();
      date.setHours(0, 0, 0, 0); // Reset time portion
      date.setDate(date.getDate() - (startIndex + i));

      newFundraisers.push({
        id,
        title: titles[(startIndex + i) % titles.length],
        organizer: `Organizer ${startIndex + i + 1}`,
        organizerAvatar: `/placeholder.svg?height=40&width=40&text=${startIndex + i + 1}`,
        description: "This fundraiser aims to make a positive impact in our community through innovative solutions and collaborative efforts.",
        category: categories[(startIndex + i) % categories.length],
        goal,
        raised,
        daysLeft: 30 - ((startIndex + i) % 30), // Deterministic days left
        coverImage: `/placeholder.svg?height=300&width=600&text=Project ${startIndex + i + 1}`,
        isLiked: false,
        likes: 100 + ((startIndex + i) * 10), // Deterministic likes
        comments: 20 + ((startIndex + i) * 2), // Deterministic comments
        shares: 10 + ((startIndex + i) * 1), // Deterministic shares
        createdAt: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        endDate: new Date(date.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        blockchain: {
          network: "Ethereum",
          contractAddress: `0x${id}...`
        }
      });
    }

    return newFundraisers;
  };

  // Load initial data
  useEffect(() => {
    // Move the data loading to client-side only
    if (typeof window !== 'undefined') {
    // Check if there are any saved fundraisers in localStorage
    const savedFundraisers = JSON.parse(
      localStorage.getItem("fundraisers") || "[]"
    );

    // Add timestamps to saved fundraisers if they don't have one
    const processedSavedFundraisers = savedFundraisers.map(
      (fundraiser: Fundraiser) => {
        if (!fundraiser.createdAt) {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
          return {
            ...fundraiser,
              createdAt: date.toLocaleDateString("en-US", {
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
    }
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

  // Handle donate click
  const handleDonateClick = (projectId: string) => {
    // Save current project data to localStorage before redirecting
    const projectsData = JSON.parse(localStorage.getItem("projectsData") || "{}");
    const project = EDUCATIONAL_POSTS.find(p => p.id === projectId);
    
    if (project && !projectsData[projectId]) {
      projectsData[projectId] = {
        id: project.id,
        title: project.title,
        description: project.description,
        goal: project.goal,
        raised: project.raised,
        category: project.category,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        acceptedTokens: ["USD", "ETH", "BTC", "DAI"],
        minimumDonation: 1,
        organizer: project.organizer.name,
        supporters: project.supporters,
        daysLeft: project.daysLeft,
        blockchain: {
          network: "Ethereum",
          contractAddress: `0x${project.id}...`
        }
      };
      localStorage.setItem("projectsData", JSON.stringify(projectsData));
    }
    router.push(`/donate/${projectId}`);
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
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <aside className="col-span-2 fixed">
            <div className="pt-8">
              <h2 className="text-white text-base mb-4">Categories</h2>
              <nav className="flex flex-col gap-1">
                <button className="text-left px-4 py-2.5 rounded-lg bg-[#0066FF] text-white">
                  Education
                </button>
                <button className="text-left px-4 py-2.5 rounded-lg text-gray-400 hover:bg-[#1B2333] transition-colors">
                  Technology
                </button>
                <button className="text-left px-4 py-2.5 rounded-lg text-gray-400 hover:bg-[#1B2333] transition-colors">
                  Medical
                </button>
                <button className="text-left px-4 py-2.5 rounded-lg text-gray-400 hover:bg-[#1B2333] transition-colors">
                  Environment
                </button>
                <button className="text-left px-4 py-2.5 rounded-lg text-gray-400 hover:bg-[#1B2333] transition-colors">
                  Community
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-8 col-start-3">
            <div className="py-8">
              <h1 className="text-2xl font-semibold text-white mb-2">Education Projects</h1>
              <p className="text-gray-400">
                Support educational initiatives and help create opportunities for learning
              </p>

              <div className="space-y-4 mt-8">
                {EDUCATIONAL_POSTS.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-[#111827] rounded-xl overflow-hidden hover:bg-[#1B2333] transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#0066FF] flex items-center justify-center text-lg font-semibold text-white">
                            {post.organizer.name.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-white mb-1">{post.title}</h3>
                          <p className="text-sm text-gray-400 mb-3">by {post.organizer.name}</p>
                          <p className="text-gray-300">{post.description}</p>
                        </div>
                      </div>

                      <div className="bg-[#0A0A0A] rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Raised</span>
                          <div className="text-right">
                            <span className="text-white font-medium">
                              ${post.raised.toLocaleString()}
                            </span>
                            <span className="text-gray-400">
                              {" "}of ${post.goal.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                          <div
                            className="bg-[#0066FF] h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${(post.raised / post.goal) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{post.supporters} supporters</span>
                          <span className="text-gray-400">{post.daysLeft} days left</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleDonateClick(post.id)}
                          className="flex-1 bg-[#0066FF] text-white py-2.5 px-4 rounded-lg hover:bg-[#0052CC] transition-colors text-sm font-medium"
                        >
                          Donate Now
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <Heart className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading Placeholder */}
                <div className="bg-[#111827] rounded-xl overflow-hidden animate-pulse">
                  <div className="p-6">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                      </div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded w-full"></div>
                      </div>
                    </div>

                    <div className="bg-[#0A0A0A] rounded-lg p-4 mb-6">
                      <div className="flex justify-between mb-2">
                        <div className="h-4 bg-gray-700 rounded w-20"></div>
                        <div className="h-4 bg-gray-700 rounded w-32"></div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-1 h-10 bg-gray-700 rounded-lg"></div>
                      <div className="h-9 w-9 bg-gray-700 rounded-lg"></div>
                      <div className="h-9 w-9 bg-gray-700 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

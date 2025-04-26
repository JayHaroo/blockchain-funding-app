"use client";

import { useState, useEffect } from "react";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
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
  image?: string;
  supportingImages?: string[];
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

export default function ProjectsPage() {
  const router = useRouter();
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  // Handle URL parameters for category
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, []);

  // Load projects from localStorage
  useEffect(() => {
    const loadProjects = () => {
      try {
        const projectsData = JSON.parse(
          localStorage.getItem("projectsData") || "{}"
        );
        const projects = Object.values(projectsData) as Fundraiser[];

        // Filter projects by category if not 'all'
        const filteredProjects =
          activeCategory === "all"
            ? projects
            : projects.filter(
                (project) =>
                  project.category.toLowerCase() ===
                  activeCategory.toLowerCase()
              );

        setFundraisers(filteredProjects);
        setLoading(false);
      } catch (error) {
        console.error("Error loading projects:", error);
        setLoading(false);
      }
    };

    setLoading(true);
    loadProjects();
  }, [activeCategory]);

  // Update category handler
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set("category", category);
    window.history.pushState({}, "", url.toString());
  };

  // Handle donate click
  const handleDonateClick = (projectId: string) => {
    router.push(`/donate/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <aside className="col-span-2 fixed">
            <div className="pt-8">
              <h2 className="text-white text-base mb-4">Categories</h2>
              <nav className="flex flex-col gap-1">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`text-left px-4 py-2.5 rounded-lg ${
                      activeCategory === category.id
                        ? "bg-[#0066FF] text-white"
                        : "text-gray-400 hover:bg-[#1B2333]"
                    } transition-colors`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-8 col-start-3">
            <div className="py-8">
              <h1 className="text-2xl font-semibold text-white mb-2">
                {activeCategory === "all"
                  ? "All Projects"
                  : `${
                      activeCategory.charAt(0).toUpperCase() +
                      activeCategory.slice(1)
                    } Projects`}
              </h1>
              <p className="text-gray-400">
                {activeCategory === "education"
                  ? "Support educational initiatives and help create opportunities for learning"
                  : activeCategory === "medical"
                  ? "Support medical causes and help improve healthcare access"
                  : activeCategory === "environment"
                  ? "Support environmental initiatives and help protect our planet"
                  : activeCategory === "technology"
                  ? "Support technology innovation and development"
                  : activeCategory === "community"
                  ? "Support community projects and local initiatives"
                  : "Browse and support various fundraising projects"}
              </p>

              <div className="space-y-4 mt-8">
                {loading ? (
                  // Loading placeholder
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
                ) : fundraisers.length > 0 ? (
                  fundraisers.map((post) => (
                    <div
                      key={post.id}
                      className="bg-[#111827] rounded-xl overflow-hidden hover:bg-[#1B2333] transition-colors"
                    >
                      <div className="p-6">
                        {post.image && (
                          <div className="mb-6 rounded-lg overflow-hidden">
                            <Image
                              src={post.image}
                              alt={post.title}
                              width={600}
                              height={300}
                              className="w-full h-[300px] object-cover"
                            />
                          </div>
                        )}

                        <div className="flex items-start space-x-4 mb-6">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-[#0066FF] flex items-center justify-center text-lg font-semibold text-white">
                              {post.organizer.charAt(0)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-white mb-1">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-3">
                              by {post.organizer}
                            </p>
                            <p className="text-gray-300">{post.description}</p>
                          </div>
                        </div>

                        {post.supportingImages &&
                          post.supportingImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mb-6">
                              {post.supportingImages.map((img, index) => (
                                <div
                                  key={index}
                                  className="rounded-lg overflow-hidden"
                                >
                                  <Image
                                    src={img}
                                    alt={`Supporting image ${index + 1}`}
                                    width={200}
                                    height={100}
                                    className="w-full h-[100px] object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                        <div className="bg-[#0A0A0A] rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">
                              Raised
                            </span>
                            <div className="text-right">
                              <span className="text-white font-medium">
                                ${post.raised.toLocaleString()}
                              </span>
                              <span className="text-gray-400">
                                {" "}
                                of ${post.goal.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                            <div
                              className="bg-[#0066FF] h-1.5 rounded-full transition-all duration-500"
                              style={{
                                width: `${(post.raised / post.goal) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">0 supporters</span>
                            <span className="text-gray-400">
                              {post.daysLeft} days left
                            </span>
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      No projects found in this category
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

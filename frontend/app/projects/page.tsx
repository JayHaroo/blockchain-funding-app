"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";

type Fundraiser = {
  id: string;
  title: string;
  organizer?: string;
  description?: string | null;
  goal: number;
  raised?: number;
  daysLeft?: number;
  category: string;
  image?: string;
  supportingImages?: string[];
};

const CATEGORIES = ["All", "Health", "Education", "Emergency", "Animals", "Environment", "Business"];

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedCategory = searchParams.get("category") || "All";

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3001/posts");
        const data = await response.json();

        const mappedPosts = data.map((post: any) => ({
          id: post._id || "unknown",
          title: post.title || "Untitled",
          organizer: post.userId || "Anonymous",
          description: post.content || "No description provided.",
          goal: post.goal || 0,
          raised: post.raised || 0,
          daysLeft: post.deadline
            ? Math.max(
                0,
                Math.ceil((new Date(post.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              )
            : 0,
          category: post.category || "Uncategorized",
          image: post.image || undefined,
          supportingImages: post.supportingImages || [],
        }));

        setPosts(mappedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const handleCategoryClick = (category: string) => {
    const query = category === "All" ? "" : `?category=${category}`;
    router.push(`/projects${query}`);
  };

  const handleDonateClick = (projectId: string) => {
    router.push(`/donate/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-white mb-6">Fundraising Projects</h1>

        {/* Category Filter */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === cat
                  ? "bg-[#0066FF] text-white border-[#0066FF]"
                  : "text-gray-300 border-gray-600 hover:bg-[#1f2937]"
              } transition-colors text-sm`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#111827] rounded-xl overflow-hidden hover:bg-[#1B2333] transition-colors mb-6"
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
                  <div className="w-10 h-10 rounded-full bg-[#0066FF] flex items-center justify-center text-lg font-semibold text-white">
                    {post.organizer?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">by {post.organizer}</p>
                    <p className="text-gray-300">{post.description}</p>
                  </div>
                </div>

                {post.supportingImages?.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {post.supportingImages.map((img, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
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
                    <span className="text-sm text-gray-400">Raised</span>
                    <div className="text-right">
                      <span className="text-white font-medium">
                        ${post.raised?.toLocaleString() || 0}
                      </span>
                      <span className="text-gray-400"> of ${post.goal.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                    <div
                      className="bg-[#0066FF] h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (post.raised! / post.goal) * 100) || 0}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>0 supporters</span>
                    <span>{post.daysLeft} days left</span>
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
          <p className="text-gray-400">No fundraising posts found for this category.</p>
        )}
      </div>
    </div>
  );
}

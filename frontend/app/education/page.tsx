"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Lightbulb, Target, Coins, Shield, ArrowRight } from "lucide-react";

// Educational content data
const CATEGORIES = [
  {
    id: "blockchain",
    title: "Blockchain Basics",
    icon: <Coins className="h-6 w-6" />,
    color: "bg-blue-500",
  },
  {
    id: "security",
    title: "Security",
    icon: <Shield className="h-6 w-6" />,
    color: "bg-green-500",
  },
  {
    id: "donations",
    title: "Smart Donations",
    icon: <Target className="h-6 w-6" />,
    color: "bg-purple-500",
  },
  {
    id: "guide",
    title: "Platform Guide",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-orange-500",
  },
];

const EDUCATIONAL_POSTS = [
  {
    id: 1,
    category: "blockchain",
    title: "Understanding Blockchain Technology",
    description: "Learn the fundamentals of blockchain technology and how it powers secure, transparent donations.",
    readTime: "5 min read",
    image: "/education/blockchain.jpg",
  },
  {
    id: 2,
    category: "security",
    title: "Keeping Your Crypto Donations Safe",
    description: "Essential security practices for managing and protecting your cryptocurrency donations.",
    readTime: "4 min read",
    image: "/education/security.jpg",
  },
  {
    id: 3,
    category: "donations",
    title: "Making Your First Crypto Donation",
    description: "Step-by-step guide to making your first cryptocurrency donation on our platform.",
    readTime: "6 min read",
    image: "/education/donation.jpg",
  },
  {
    id: 4,
    category: "guide",
    title: "Platform Features Overview",
    description: "Discover all the features available on our platform and how to use them effectively.",
    readTime: "8 min read",
    image: "/education/guide.jpg",
  },
  {
    id: 5,
    category: "blockchain",
    title: "Different Types of Cryptocurrencies",
    description: "Learn about various cryptocurrencies and their unique features for donations.",
    readTime: "7 min read",
    image: "/education/crypto.jpg",
  },
  {
    id: 6,
    category: "security",
    title: "Wallet Security Best Practices",
    description: "Essential tips for securing your cryptocurrency wallet and transactions.",
    readTime: "5 min read",
    image: "/education/wallet.jpg",
  },
];

export default function EducationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = EDUCATIONAL_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Blockchain Education Hub
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Learn about blockchain technology, cryptocurrency donations, and how to make the most of our platform.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search educational content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1B2333] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`p-6 rounded-xl transition-all ${
                selectedCategory === category.id
                  ? `${category.color} text-white`
                  : "bg-[#1B2333] text-gray-300 hover:bg-[#232B3D]"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                {category.icon}
                <span className="font-medium">{category.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Educational Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link 
              href={`/education/${post.id}`} 
              key={post.id}
              className="bg-[#1B2333] rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all"
            >
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                  CATEGORIES.find(c => c.id === post.category)?.color
                } bg-opacity-10 text-white`}>
                  {CATEGORIES.find(c => c.id === post.category)?.title}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{post.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                  <Button variant="link" className="text-blue-500 hover:text-blue-400 p-0">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No posts found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 
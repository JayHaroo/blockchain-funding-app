"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Clock, Share2, Bookmark, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Section {
  type: string;
  content?: string;
  items?: string[];
}

interface Props {
  params: { id: string };
}

// Mock post content (in a real app, this would come from a database)
const POST_CONTENT = {
  "1": {
    title: "Understanding Blockchain Technology",
    category: "Blockchain Basics",
    image: "/education/blockchain.jpg",
    readTime: "5 min read",
    content: [
      {
        type: "paragraph",
        content: "Blockchain technology is a revolutionary system that enables secure, transparent, and decentralized record-keeping of transactions. At its core, a blockchain is a distributed database that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.",
      },
      {
        type: "heading",
        content: "Key Components of Blockchain",
      },
      {
        type: "list",
        items: [
          "Decentralization: No single entity controls the network",
          "Transparency: All transactions are visible to network participants",
          "Immutability: Once recorded, data cannot be altered",
          "Security: Cryptographic techniques protect transaction data",
        ],
      },
      {
        type: "paragraph",
        content: "In the context of donations, blockchain technology provides unprecedented transparency and accountability. Donors can track exactly how their contributions are used, while organizations can demonstrate their impact with verifiable data.",
      },
      {
        type: "heading",
        content: "Benefits for Charitable Giving",
      },
      {
        type: "list",
        items: [
          "Reduced transaction fees compared to traditional methods",
          "Real-time tracking of donation usage",
          "Cross-border donations without currency conversion hassles",
          "Permanent record of all charitable activities",
        ],
      },
      {
        type: "paragraph",
        content: "Understanding blockchain technology is crucial for modern philanthropic efforts. It enables new forms of giving that are more efficient, transparent, and impactful than ever before.",
      },
    ],
    relatedPosts: [2, 5, 6],
  },
  // Add more posts as needed
};

export default function EducationalPost({ params }: Props) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const postId = params.id;
  const post = POST_CONTENT[postId as keyof typeof POST_CONTENT];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/education" className="text-blue-500 hover:underline">
            Return to Education Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Link href="/education" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back to Education Hub
        </Link>

        {/* Article Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="bg-blue-500 bg-opacity-10 text-blue-500 px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <div className="flex items-center mt-2 text-gray-400">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">{post.readTime}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="text-gray-400 hover:text-white"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                {showShareTooltip && (
                  <div className="absolute right-0 -top-10 bg-white text-black text-sm py-1 px-2 rounded shadow-lg">
                    Copied!
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-blue-500" : "text-gray-400 hover:text-white"}
              >
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-8">{post.title}</h1>
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert prose-lg">
            {post.content.map((section, index) => {
              switch (section.type) {
                case "paragraph":
                  return (
                    <p key={index} className="text-gray-300 mb-6">
                      {section.content}
                    </p>
                  );
                case "heading":
                  return (
                    <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
                      {section.content}
                    </h2>
                  );
                case "list":
                  return (
                    Array.isArray((section as Section).items) && (section.items !== undefined) ? (
                      <ul key={index} className="space-y-2 mb-6">
                        {section.items.map((item: string, itemIndex: number) => (
                          <li key={itemIndex} className="flex items-start text-gray-300">
                            <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 
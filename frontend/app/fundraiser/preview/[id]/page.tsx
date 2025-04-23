"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, Share2, Calendar, MapPin, Target, X } from "lucide-react";
import { use } from 'react';

interface PreviewFundraiser {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  displayImage: string | null;
  previewImages: string[];
  walletAddress: string;
  goal: number;
  endDate: string;
  acceptedTokens: string[];
  minimumDonation: number;
  blockchain: string;
  socialLinks: string[];
  status: string;
  createdAt: string;
  raised: number;
  supporters: number;
}

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [fundraiser, setFundraiser] = useState<PreviewFundraiser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const previewData = localStorage.getItem('previewFundraiser');
      if (!previewData) {
        setError('Preview not found');
        return;
      }

      const parsedData = JSON.parse(previewData);
      if (parsedData.id !== resolvedParams.id) {
        setError('Preview not found');
        return;
      }

      setFundraiser(parsedData);
    } catch (error) {
      console.error('Error loading preview:', error);
      setError('Error loading preview');
    }
  }, [resolvedParams.id]);

  // Image Modal Component
  const ImageModal = ({ src, onClose }: { src: string; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={src}
          alt="Full size"
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
    );
  };

  const handlePublish = async () => {
    try {
      if (!fundraiser) return;

      // Create a stable ID using the preview ID instead of timestamp
      const fundraiserData = {
        id: resolvedParams.id,
        name: fundraiser.name,
        description: fundraiser.description,
        category: fundraiser.category,
        location: fundraiser.location,
        walletAddress: fundraiser.walletAddress,
        goal: fundraiser.goal,
        endDate: fundraiser.endDate,
        acceptedTokens: fundraiser.acceptedTokens,
        minimumDonation: fundraiser.minimumDonation,
        blockchain: fundraiser.blockchain,
        socialLinks: fundraiser.socialLinks.filter(link => link.trim() !== ""),
        status: "active",
        createdAt: fundraiser.createdAt || new Date().toISOString(),
        raised: 0,
        supporters: 0
      };

      // Handle images
      const displayImageUrl = fundraiser.displayImage;
      const supportingImageUrls = [...fundraiser.previewImages];

      // Add image URLs to fundraiser data
      const finalFundraiserData = {
        ...fundraiserData,
        displayImage: displayImageUrl,
        supportingImages: supportingImageUrls
      };

      // Save to localStorage
      try {
        const existingFundraisers = JSON.parse(localStorage.getItem('fundraisers') || '[]');
        const newFundraisers = [finalFundraiserData, ...existingFundraisers];
        localStorage.setItem('fundraisers', JSON.stringify(newFundraisers));

        // Save to projects data
        const projectsData = JSON.parse(localStorage.getItem('projectsData') || '{}');
        projectsData[finalFundraiserData.id] = {
          id: finalFundraiserData.id,
          title: finalFundraiserData.name,
          description: finalFundraiserData.description,
          image: finalFundraiserData.displayImage,
          goal: finalFundraiserData.goal,
          raised: 0,
          category: finalFundraiserData.category,
          endDate: finalFundraiserData.endDate,
          acceptedTokens: finalFundraiserData.acceptedTokens,
          minimumDonation: finalFundraiserData.minimumDonation,
          blockchain: {
            network: finalFundraiserData.blockchain,
            contractAddress: fundraiser.walletAddress
          },
          status: "active",
          createdAt: finalFundraiserData.createdAt,
          supportingImages: finalFundraiserData.supportingImages
        };
        localStorage.setItem('projectsData', JSON.stringify(projectsData));

        // Clear preview data
        localStorage.removeItem('previewFundraiser');

        // Show success message
        alert('Fundraiser published successfully!');
        
        // Redirect to the specific category page
        const categoryPath = fundraiser.category.toLowerCase();
        window.location.href = `/projects?category=${categoryPath}`;
      } catch (error) {
        console.error('Error saving fundraiser:', error);
        throw new Error('Failed to save fundraiser data');
      }

    } catch (error) {
      console.error('Error publishing fundraiser:', error);
      alert('Failed to publish fundraiser. Please try again.');
    }
  };

  const handleEdit = () => {
    router.push('/fundraiser/create');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Link href="/fundraiser/create" className="text-blue-500 hover:underline">
            Return to Create Fundraiser
          </Link>
        </div>
      </div>
    );
  }

  if (!fundraiser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const progressPercentage = Math.min((fundraiser.raised / fundraiser.goal) * 100, 100);

  return (
    <div className="min-h-screen bg-black text-white">
      {selectedImage && (
        <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
      
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/fundraiser/create" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Edit
          </Link>
          <div className="text-lg font-semibold">Preview Mode</div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Display image */}
            {fundraiser.displayImage && (
              <div 
                className="rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(fundraiser.displayImage)}
              >
                <img
                  src={fundraiser.displayImage}
                  alt={fundraiser.name}
                  className="w-full h-[400px] object-cover hover:opacity-90 transition-opacity"
                />
              </div>
            )}

            {/* Title and description */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{fundraiser.name}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <span className="inline-flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {fundraiser.location}
                </span>
                <span className="inline-flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(fundraiser.endDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{fundraiser.description}</p>
            </div>

            {/* Supporting images */}
            {fundraiser.previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fundraiser.previewImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`Supporting ${index + 1}`}
                      className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column - Donation info */}
          <div className="lg:col-span-1">
            <div className="bg-[#131B2F] rounded-xl p-6 sticky top-8">
              <div className="space-y-6">
                {/* Progress */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-2xl font-bold">${fundraiser.raised.toLocaleString()}</span>
                    <span className="text-gray-400">raised of ${fundraiser.goal.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0066FF]"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>{fundraiser.supporters} supporters</span>
                    <span>{progressPercentage.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handlePublish}
                    className="w-full bg-[#0066FF] text-white py-3 rounded-lg hover:bg-[#0052CC] transition-colors"
                  >
                    Publish Fundraiser
                  </button>
                  <button
                    onClick={handleEdit}
                    className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Edit Fundraiser
                  </button>
                </div>

                {/* Additional info */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Category</div>
                    <div className="font-medium">{fundraiser.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Blockchain</div>
                    <div className="font-medium">{fundraiser.blockchain}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Accepted Tokens</div>
                    <div className="flex flex-wrap gap-2">
                      {fundraiser.acceptedTokens.map((token) => (
                        <span
                          key={token}
                          className="px-2 py-1 bg-gray-700 rounded-full text-sm"
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
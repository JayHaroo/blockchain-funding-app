"use client";

import React from "react";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { ArrowRight, ArrowLeft, Upload, Heart } from "lucide-react";

// Rich text editor icons and components
const EditorIcons = {
  H1: () => <span className="font-bold">H1</span>,
  H2: () => <span className="font-bold">H2</span>,
  Bold: () => <span className="font-bold">B</span>,
  Italic: () => <span className="italic">I</span>,
  Underline: () => <span className="underline">U</span>,
  Quote: () => <span>"</span>,
  List: () => <span>•</span>,
  Link: () => <span>🔗</span>,
  Image: () => <span>📷</span>,
  Code: () => <span>{"</>"}</span>,
};

interface FundraiserFormData {
  name: string;
  description: string;
  socialLinks: string[];
  category: string;
  otherCategory?: string;
  location: string;
  displayImage?: string | null;
  supportingImages: File[];
  walletAddress: string;
  goal: number;
  endDate: string;
  acceptedTokens: string[];
  minimumDonation: number;
  blockchain: string;
}

const CATEGORIES = [
  "Animals", "Business", "Calamity", "Community",
  "Competition", "Creative", "Education", "Events",
  "Faith", "Family", "Funerals", "Medical", "Sports"
];

export default function CreateFundraiser() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FundraiserFormData>({
    name: "",
    description: "",
    socialLinks: ["", ""],
    category: "",
    location: "",
    supportingImages: [],
    walletAddress: "",
    goal: 0,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    acceptedTokens: ["USD", "ETH", "BTC", "DAI"],
    minimumDonation: 1,
    blockchain: "Ethereum"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleCategorySelect = useCallback((category: string) => {
    setFormData((prev) => ({ ...prev, category }));
  }, []);

  const handleNext = useCallback(() => {
    if (step < 4) {
      setStep(step + 1);
    }
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFormData((prev) => ({
          ...prev,
          displayImage: URL.createObjectURL(file),
        }));
      }
    },
    []
  );

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);

    // Simulate saving to database
    setTimeout(() => {
      // Create a new fundraiser object with complete data
      const fundraiserData = {
        id: `f${Date.now()}`,
        ...formData,
        status: "active",
        createdAt: new Date().toISOString(),
        raised: 0,
        goal: formData.goal,
        supporters: 0
      };

      // In a real app, you would save this to a database
      // For this demo, we'll save to localStorage
      const existingFundraisers = JSON.parse(
        localStorage.getItem("fundraisers") || "[]"
      );
      localStorage.setItem(
        "fundraisers",
        JSON.stringify([fundraiserData, ...existingFundraisers])
      );

      // Also store the project data separately for the donation system
      const projectsData = JSON.parse(
        localStorage.getItem("projectsData") || "{}"
      );
      projectsData[fundraiserData.id] = {
        id: fundraiserData.id,
        title: fundraiserData.name,
        description: fundraiserData.description,
        image: fundraiserData.displayImage,
        goal: fundraiserData.goal,
        raised: 0,
        category: fundraiserData.category,
        endDate: fundraiserData.endDate,
        acceptedTokens: fundraiserData.acceptedTokens,
        minimumDonation: fundraiserData.minimumDonation,
        blockchain: fundraiserData.blockchain
      };
      localStorage.setItem("projectsData", JSON.stringify(projectsData));

      // Redirect to the projects page
      router.push("/projects");
    }, 1500);
  }, [formData, router]);

  const handlePreview = () => {
    // Save draft to localStorage
    const fundraisers = JSON.parse(localStorage.getItem("fundraisers") || "[]");
    const draftFundraiser = {
      id: `f${Date.now()}`,
      ...formData,
      status: "draft",
      createdAt: new Date().toISOString(),
      raised: 0,
      goal: formData.goal,
      supporters: 0
    };
    fundraisers.push(draftFundraiser);
    localStorage.setItem("fundraisers", JSON.stringify(fundraisers));
    
    // Navigate to preview
    router.push(`/fundraiser/preview/${draftFundraiser.id}`);
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create fundraiser data with proper typing
      const fundraiserData: FundraiserFormData & {
        id: string;
        createdAt: string;
        raised: number;
        supporters: number;
      } = {
        id: `f${Date.now()}`,
        ...formData,
        displayImage: formData.displayImage || null,
        createdAt: new Date().toISOString(),
        raised: 0,
        goal: formData.goal,
        supporters: 0
      };

      // Save to localStorage
      const existingFundraisers = JSON.parse(localStorage.getItem('fundraisers') || '[]');
      localStorage.setItem('fundraisers', JSON.stringify([fundraiserData, ...existingFundraisers]));

      // Save project data
      const projectData = {
        id: fundraiserData.id,
        name: formData.name,
        description: formData.description,
        createdAt: new Date().toISOString(),
        raised: 0,
        goal: formData.goal,
        supporters: 0,
        endDate: formData.endDate,
        acceptedTokens: formData.acceptedTokens,
        minimumDonation: formData.minimumDonation,
        blockchain: formData.blockchain,
        displayImage: formData.displayImage || null
      };

      const existingProjects = JSON.parse(localStorage.getItem('projectsData') || '[]');
      localStorage.setItem('projectsData', JSON.stringify([projectData, ...existingProjects]));

      router.push('/projects');
    } catch (error) {
      console.error('Error publishing fundraiser:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                FUNDRAISE Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                name="name"
                className="w-full bg-[#1B2333] rounded-lg px-4 py-2.5 text-white"
                placeholder="Enter your fundraiser name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tell us about your FUNDRAISE...
              </label>
              <div className="bg-[#1B2333] rounded-lg overflow-hidden">
                <div className="border-b border-gray-700 p-2 flex items-center space-x-2">
                  {Object.entries(EditorIcons).map(([key, Icon]) => (
                    <button
                      key={key}
                      className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                    >
                      <Icon />
                    </button>
                  ))}
                </div>
                <textarea
                  value={formData.description}
                  onChange={handleInputChange}
                  name="description"
                  className="w-full bg-transparent p-4 min-h-[200px] text-white"
                  placeholder="Describe your fundraiser..."
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Social Media Links
              </label>
              <div className="space-y-2">
                {formData.socialLinks.map((link, index) => (
                  <input
                    key={index}
                    type="url"
                    value={link}
                    onChange={handleInputChange}
                    name={`socialLinks.${index}`}
                    className="w-full bg-[#1B2333] rounded-lg px-4 py-2.5 text-white"
                    placeholder="Add your social media link"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">Add your project's social media links</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      formData.category === category
                        ? "bg-[#0066FF] text-white"
                        : "bg-[#1B2333] text-gray-400 hover:bg-[#232B3D]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
                <button
                  onClick={() => setFormData({ ...formData, category: "Other" })}
                  className={`px-4 py-2 rounded-full text-sm ${
                    formData.category === "Other"
                      ? "bg-[#0066FF] text-white"
                      : "bg-[#1B2333] text-gray-400 hover:bg-[#232B3D]"
                  }`}
                >
                  Other
                </button>
              </div>
              {formData.category === "Other" && (
                <input
                  type="text"
                  value={formData.otherCategory}
                  onChange={handleInputChange}
                  name="otherCategory"
                  className="mt-2 w-full bg-[#1B2333] rounded-lg px-4 py-2.5 text-white"
                  placeholder="Specify category"
                />
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                name="location"
                className="w-full bg-[#1B2333] rounded-lg px-4 py-2.5 text-white"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Add image to your FUNDRAISE
              </label>
              <button
                onClick={() => document.getElementById("displayImage")?.click()}
                className="w-full bg-[#0066FF] text-white py-2 rounded-lg hover:bg-[#0052CC]"
              >
                Upload display image
              </button>
              <input
                id="displayImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Add supporting image
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <Image
                    src="/placeholder.svg"
                    alt="Upload"
                    width={48}
                    height={48}
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  Drag & drop an image here or, upload from device.
                </p>
                <p className="text-xs text-gray-500">
                  Suggested image size: 960px width by 600px height. Max image size is 4MB.
                </p>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Receiving funds thru</h2>
              <p className="text-sm text-gray-400 mb-4">
                Set up your address to receive donations. The more chains you set up the more likely
                it is to receive donations.
              </p>
              <button
                onClick={() => {
                  // Add wallet connection logic here
                  setFormData({ ...formData, walletAddress: "0x..." });
                }}
                className="text-[#0066FF] hover:underline"
              >
                Add address →
              </button>
            </div>

            <div className="pt-8 flex items-center space-x-4">
              <button
                onClick={handlePreview}
                className="flex-1 bg-[#0066FF] text-white py-2.5 rounded-lg hover:bg-[#0052CC]"
              >
                Preview
              </button>
              <button
                onClick={handlePublish}
                className="flex-1 bg-gray-600 text-white py-2.5 rounded-lg hover:bg-gray-500"
                disabled={!formData.walletAddress}
              >
                Publish
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-[#0066FF] text-white py-2.5 rounded-lg hover:bg-[#0052CC]"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-12 gap-8 min-h-screen">
          {/* Left Section */}
          <div className="col-span-5 bg-[#111827] relative">
            <div className="p-8">
              <Link href="/" className="inline-flex items-center text-2xl font-bold mb-12">
                <span>FUND</span>
                <span className="text-[#0066FF]">CHAIN</span>
              </Link>
              
              <div className="relative">
                <h1 className="text-3xl font-bold mb-4">
                  Start your <span className="text-[#0066FF]">FUNDRAISE</span> now
                </h1>
                <div className="mt-8">
                  <Image
                    src="/hands.png"
                    alt="Fundraising"
                    width={400}
                    height={400}
                    className="opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="col-span-7 py-8">
            <div className="max-w-2xl">
              <button
                onClick={handleBack}
                className="inline-flex items-center text-gray-400 hover:text-white mb-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Your FUNDRAISE</span>
              </button>

              {renderStep()}

              {step < 4 && (
                <div className="mt-8">
                  <button
                    onClick={handleNext}
                    className="w-full bg-[#0066FF] text-white py-2.5 rounded-lg hover:bg-[#0052CC]"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

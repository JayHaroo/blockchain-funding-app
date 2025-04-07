"use client";

import React from "react";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { ArrowRight, ArrowLeft, Upload, Heart } from "lucide-react";

export default function CreateFundraiserPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    goal: "",
    endDate: "",
    coverImage: null as File | null,
    coverImageUrl: "",
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
    setStep((prev) => prev + 1);
  }, []);

  const handleBack = useCallback(() => {
    setStep((prev) => Math.max(1, prev - 1));
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFormData((prev) => ({
          ...prev,
          coverImage: file,
          coverImageUrl: URL.createObjectURL(file),
        }));
      }
    },
    []
  );

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);

    // Simulate saving to database
    setTimeout(() => {
      // Create a new fundraiser object
      const newFundraiser = {
        id: `f${Date.now()}`,
        title: formData.title || "Untitled Fundraiser",
        organizer: "Your Name", // In a real app, this would be the logged-in user
        organizerAvatar: "/placeholder.svg?height=40&width=40",
        description: formData.description || "No description provided",
        category: formData.category || "Other",
        goal: Number.parseFloat(formData.goal) || 1000,
        raised: 0, // New fundraiser starts with 0
        daysLeft: 30, // Default to 30 days if no end date
        coverImage:
          formData.coverImageUrl || "/placeholder.svg?height=300&width=600",
        isLiked: false,
        likes: 0,
        comments: 0,
        shares: 0,
      };

      // In a real app, you would save this to a database
      // For this demo, we'll save to localStorage
      const existingFundraisers = JSON.parse(
        localStorage.getItem("fundraisers") || "[]"
      );
      localStorage.setItem(
        "fundraisers",
        JSON.stringify([newFundraiser, ...existingFundraisers])
      );

      // Redirect to the projects page
      router.push("/projects");
    }, 1500);
  }, [formData, router]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-center text-white">
              Start Your <span className="text-blue-400">Fundraiser</span>
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm text-blue-300 font-medium"
                >
                  Fundraiser Name
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Give your fundraiser a compelling name..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-blue-500/50 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm text-blue-300 font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell your story and why this fundraiser matters..."
                  className="w-full px-4 py-3 rounded-lg min-h-[150px] bg-gray-800/80 border border-blue-500/50 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-center text-white">
              <span className="text-blue-400">Categorize</span> Your Fundraiser
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-blue-300 font-medium">
                Select a category
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  ["Community", "Medical"],
                  ["Education", "Emergency"],
                  ["Animals", "Environment"],
                  ["Technology", "Arts"],
                ].map((row, rowIndex) => (
                  <React.Fragment key={`row-${rowIndex}`}>
                    {row.map((category) => (
                      <button
                        key={category}
                        className={`px-3 py-2.5 rounded-lg border ${
                          formData.category === category
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                            : "bg-gray-800/80 text-white border-gray-700 hover:bg-blue-600/30 hover:border-blue-500/50 transition-all"
                        }`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              <div className="space-y-2 mt-4">
                <label
                  htmlFor="goal"
                  className="text-sm text-blue-300 font-medium"
                >
                  Fundraising Goal
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <input
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    placeholder="Amount"
                    type="number"
                    className="w-full pl-8 pr-4 py-3 rounded-lg bg-gray-800/80 border border-blue-500/50 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <button
                onClick={handleBack}
                className="border border-blue-500/50 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600/30 flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-center text-white">
              <span className="text-blue-400">Finalize</span> Your Campaign
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="endDate"
                  className="text-sm text-blue-300 font-medium"
                >
                  Campaign end date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  type="date"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-blue-500/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="coverImage"
                  className="text-sm text-blue-300 font-medium"
                >
                  Upload cover image
                </label>
                <div className="space-y-3">
                  <input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="coverImage"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-blue-500/50 text-white hover:bg-blue-600/30 cursor-pointer transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    {formData.coverImage ? "Change Image" : "Choose File"}
                  </label>

                  {formData.coverImageUrl && (
                    <div className="mt-3">
                      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-blue-500/30">
                        <Image
                          src={formData.coverImageUrl || "/placeholder.svg"}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-2 text-sm text-blue-300">
                        Selected: {formData.coverImage?.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <button
                onClick={handleBack}
                className="border border-blue-500/50 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600/30 flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
              >
                Review
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-white">
              <span className="text-blue-400">Review</span> Your Fundraiser
            </h2>
            <div className="bg-gray-800/50 rounded-lg p-5 space-y-4 border border-blue-500/20">
              <div className="text-center space-y-1">
                <h3 className="text-white text-xl font-bold">
                  {formData.title || "Untitled Fundraiser"}
                </h3>
                <p className="text-blue-300 text-sm">
                  {formData.category || "No category selected"}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {formData.description && (
                  <div>
                    <p className="text-xs text-blue-300 uppercase font-medium">
                      Description
                    </p>
                    <p className="text-white/80 text-sm line-clamp-3">
                      {formData.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {formData.goal && (
                    <div>
                      <p className="text-xs text-blue-300 uppercase font-medium">
                        Goal
                      </p>
                      <p className="text-white text-lg font-medium">
                        ${formData.goal}
                      </p>
                    </div>
                  )}

                  {formData.endDate && (
                    <div>
                      <p className="text-xs text-blue-300 uppercase font-medium">
                        End Date
                      </p>
                      <p className="text-white text-lg font-medium">
                        {formData.endDate}
                      </p>
                    </div>
                  )}
                </div>

                {formData.coverImageUrl && (
                  <div>
                    <p className="text-xs text-blue-300 uppercase font-medium">
                      Cover Image
                    </p>
                    <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-blue-500/30">
                      <Image
                        src={formData.coverImageUrl || "/placeholder.svg"}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    Creating Fundraiser...
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 fill-current" />
                    Launch Fundraiser
                  </>
                )}
              </button>
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className={`border border-blue-500/50 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600/30 flex items-center justify-center gap-2 transition-all ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-600/30">
              CREATE FUNDRAISER
            </div>
          </div>

          <div className="overflow-hidden bg-transparent">
            <div className="relative">
              {/* Background with heart pattern */}
              <div className="absolute inset-0 z-0 opacity-10">
                <div className="h-full w-full flex items-center justify-center">
                  <Heart className="h-64 w-64 text-blue-500" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 bg-gradient-to-b from-gray-900/90 to-black/90 rounded-xl border border-gray-800 shadow-xl">
                {renderStep()}

                <div className="flex justify-center mt-8">
                  <div className="flex space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-2 w-${
                          step === i ? "8" : "2"
                        } rounded-full transition-all duration-300 ${
                          step === i ? "bg-blue-500" : "bg-gray-700"
                        }`}
                      />
                    ))}
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

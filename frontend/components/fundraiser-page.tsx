"use client";

import { useState } from "react";
import Link from "next/link";

export default function FundraiserPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    goal: "",
    endDate: "",
    coverImage: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-white">
              1. Your FUNDRAISE
            </h2>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Fundraiser Name..."
              className="w-full px-3 py-2 rounded-md bg-white/10 border border-blue-500 text-white"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about your fundraiser..."
              className="w-full px-3 py-2 rounded-md min-h-[150px] bg-white/10 border border-blue-500 text-white"
            />
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-white">
              2. Your FUNDRAISE
            </h2>
            <p className="text-sm text-blue-300">Select a category</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {[
                "Education",
                "Medical",
                "Community",
                "Emergency",
                "Animals",
                "Environment",
                "Arts",
                "Sports",
              ].map((category) => (
                <button
                  key={category}
                  className={`px-3 py-2 rounded-md border ${
                    formData.category === category
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white/10 text-white border-gray-700 hover:bg-blue-600/50"
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="space-y-4 mt-4">
              <input
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="Fundraising Goal ($)"
                type="number"
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-blue-500 text-white"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="border border-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600/50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-white">
              3. Your FUNDRAISE
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-blue-300 mb-2">Campaign end date</p>
                <input
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  type="date"
                  className="w-full px-3 py-2 rounded-md bg-white/10 border border-blue-500 text-white"
                />
              </div>
              <div>
                <p className="text-sm text-blue-300 mb-2">Upload cover image</p>
                <button className="w-full px-3 py-2 rounded-md border border-blue-500 text-white hover:bg-blue-600/50">
                  Choose File
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="border border-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600/50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center text-white">
              4. Your FUNDRAISE
            </h2>
            <div className="text-center space-y-2">
              <p className="text-blue-300">Review your fundraiser</p>
              <p className="text-white text-lg font-medium">
                {formData.title || "Untitled Fundraiser"}
              </p>
              <p className="text-white/70 text-sm">
                {formData.category
                  ? `Category: ${formData.category}`
                  : "No category selected"}
              </p>
              {formData.goal && (
                <p className="text-white/70 text-sm">Goal: ${formData.goal}</p>
              )}
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Launch Fundraiser
              </button>
              <button
                onClick={handleBack}
                className="border border-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600/50"
              >
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-bold">
            FUND RAISE
          </div>
        </div>

        <div className="border-0 overflow-hidden bg-transparent">
          <div className="relative p-0">
            {/* Background with hands */}
            <div className="absolute inset-0 z-0 opacity-30">
              <div className="h-full w-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-48 w-48 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                  <path d="M3.5 12.5l.5.5"></path>
                  <path d="M20 12.5l.5.5"></path>
                  <path d="M3.5 19.5l.5.5"></path>
                  <path d="M20 19.5l.5.5"></path>
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 bg-gradient-to-b from-gray-900/90 to-black/90 rounded-lg">
              <div className="text-center mb-6">
                <p className="text-white text-sm">
                  Start your{" "}
                  <span className="text-blue-500 font-bold">FUNDRAISE</span> now
                </p>
              </div>

              {renderStep()}

              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${
                        step === i ? "bg-blue-500" : "bg-gray-600"
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
  );
}

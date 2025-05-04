"use client";

import React from "react";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ArrowLeft, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi'

const SERVER_URL = "http://localhost:3001/createPost";

const EditorIcons = {
  H1: () => <span className="font-bold">H1</span>,
  H2: () => <span className="font-bold">H2</span>,
  Bold: () => <span className="font-bold">B</span>,
  Italic: () => <span className="italic">I</span>,
  Underline: () => <span className="underline">U</span>,
  Quote: () => <span>&quot;</span>,
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
  displayImage: string | null;
  supportingImages: File[];
  walletAddress: string;
  goal: number;
  endDate: string;
  acceptedTokens: string[];
  minimumDonation: number;
  blockchain: string;
}

interface PreviewFundraiser extends FundraiserFormData {
  id: string;
  status: string;
  createdAt: string;
  raised: number;
  supporters: number;
  previewImages: string[];
}

const CATEGORIES = [
  "Animals",
  "Business",
  "Calamity",
  "Community",
  "Competition",
  "Creative",
  "Education",
  "Events",
  "Faith",
  "Family",
  "Funerals",
  "Medical",
  "Sports",
];

export default function CreateFundraiser() {
  const { address, connector, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })
  const { connect, connectors, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()
  const [error, setError] = useState("");

  if (isConnected) {
    console.log("Connected to wallet:", address);
  }

  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FundraiserFormData>({
    name: "",
    description: "",
    socialLinks: ["", ""],
    category: "",
    location: "",
    supportingImages: [],
    walletAddress: address || "",
    goal: 0,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    acceptedTokens: ["USD", "ETH", "BTC", "DAI"],
    minimumDonation: 1,
    blockchain: "Ethereum",
    displayImage: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [goal, setGoal] = useState("");
  const [goalError, setGoalError] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dateError, setDateError] = useState("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleSocialLinkChange = useCallback(
    (index: number, value: string) => {
      setFormData((prev) => {
        const newSocialLinks = [...prev.socialLinks];
        newSocialLinks[index] = value;
        return { ...prev, socialLinks: newSocialLinks };
      });
      // Clear error when user starts typing
      if (errors.socialLinks) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.socialLinks;
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleCategorySelect = useCallback(
    (category: string) => {
      setFormData((prev) => ({ ...prev, category }));
      if (errors.category) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.category;
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleNext = useCallback(() => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    }
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          setErrors((prev) => ({
            ...prev,
            displayImage: "Please upload an image file",
          }));
          return;
        }

        // Validate file size (4MB limit)
        if (file.size > 4 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            displayImage: "File size must be less than 4MB",
          }));
          return;
        }

        try {
          // Create a preview URL
          const objectUrl = URL.createObjectURL(file);

          setFormData((prev) => ({
            ...prev,
            displayImage: objectUrl,
          }));

          // Clear error if exists
          if (errors.displayImage) {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.displayImage;
              return newErrors;
            });
          }
        } catch (error) {
          console.error("Error processing image:", error);
          setErrors((prev) => ({
            ...prev,
            displayImage: "Error processing image. Please try again.",
          }));
        }
      }
    },
    [errors]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const validImageFiles: File[] = [];

      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          continue;
        }

        // Validate file size
        if (file.size > 4 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            supportingImages: "File size must be less than 4MB",
          }));
          continue;
        }

        validImageFiles.push(file);
      }

      if (validImageFiles.length > 0) {
        setUploadedImages((prev) => [...prev, ...validImageFiles]);
        setFormData((prev) => ({
          ...prev,
          supportingImages: [...prev.supportingImages, ...validImageFiles],
        }));

        if (errors.supportingImages) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.supportingImages;
            return newErrors;
          });
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          supportingImages: "Please upload valid image files",
        }));
      }
    },
    [errors]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const imageFiles = files.filter((file) => {
        if (file.size > 4 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            supportingImages: "File size must be less than 4MB",
          }));
          return false;
        }
        return file.type.startsWith("image/");
      });

      if (imageFiles.length > 0) {
        setUploadedImages((prev) => [...prev, ...imageFiles]);
        setFormData((prev) => ({
          ...prev,
          supportingImages: [...prev.supportingImages, ...imageFiles],
        }));
        if (errors.supportingImages) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.supportingImages;
            return newErrors;
          });
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((item, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      supportingImages: prev.supportingImages.filter((item, i) => i !== index),
    }));
  };

  const validateGoal = (value: string) => {
    const numValue = parseFloat(value);
    if (!value) {
      setGoalError("Goal amount is required");
      return false;
    }
    if (isNaN(numValue) || numValue <= 0) {
      setGoalError("Please enter a valid positive number");
      return false;
    }
    if (numValue < 1) {
      setGoalError("Minimum goal amount is 1");
      return false;
    }
    setGoalError("");
    return true;
  };

  const validateDateTime = () => {
    if (!endDate) {
      setDateError("End date is required");
      return false;
    }

    const selectedDateTime = new Date(`${endDate}T${endTime || "23:59"}`);
    const now = new Date();

    if (selectedDateTime <= now) {
      setDateError("End date and time must be in the future");
      return false;
    }

    setDateError("");
    return true;
  };

  const handlePreview = async () => {
    if (!validateGoal(goal) || !validateDateTime()) {
      return;
    }
    try {
      // Convert all images to base64 strings for preview
      const imagePromises = [];

      // Convert display image if exists
      let displayImageBase64 = null;
      if (formData.displayImage) {
        const displayImageBlob = await fetch(formData.displayImage).then((r) =>
          r.blob()
        );
        displayImageBase64 = await convertBlobToBase64(displayImageBlob);
      }

      // Convert supporting images
      for (const file of uploadedImages) {
        imagePromises.push(convertFileToBase64(file));
      }

      const supportingImagesBase64 = await Promise.all(imagePromises);

      // Create preview data
      const previewData: PreviewFundraiser = {
        ...formData,
        id: `preview_${Date.now()}`,
        status: "preview",
        createdAt: new Date().toISOString(),
        raised: 0,
        supporters: 0,
        displayImage: displayImageBase64,
        previewImages: supportingImagesBase64,
        // Include other required fields with default values if needed
        walletAddress: formData.walletAddress || "Preview Address",
        goal: parseFloat(goal),
        minimumDonation: formData.minimumDonation || 1,
        endDate: `${endDate}T${endTime || "23:59"}`,
      };

      // Save to localStorage for preview
      localStorage.setItem("previewFundraiser", JSON.stringify(previewData));

      // Navigate to preview page
      router.push(`/fundraiser/preview/${previewData.id}`);
    } catch (error) {
      console.error("Error creating preview:", error);
      setErrors((prev) => ({
        ...prev,
        preview: "Failed to create preview. Please try again.",
      }));
    }
  };

  const handlePublish = async () => {
    if (!validateGoal(goal) || !validateDateTime()) {
      return;
    }
    handleCreatePost();
  };

  const handleCancel = () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to cancel? All your progress will be lost."
    );

    if (confirmed) {
      // Clean up any object URLs
      if (formData.displayImage) {
        URL.revokeObjectURL(formData.displayImage);
      }
      uploadedImages.forEach((file) => {
        if (file instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(file));
        }
      });

      // Reset form data
      setFormData({
        name: "",
        description: "",
        socialLinks: ["", ""],
        category: "",
        location: "",
        displayImage: null,
        supportingImages: [],
        walletAddress: "",
        goal: 0,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        acceptedTokens: ["USD", "ETH", "BTC", "DAI"],
        minimumDonation: 1,
        blockchain: "Ethereum",
      });

      // Clear errors
      setErrors({});

      // Reset other states
      setUploadedImages([]);
      setStep(1);

      // Navigate back to home
      router.push("/");
    }
  };

  const renderImagePreview = () => {
    if (!formData.displayImage) {
      return null;
    }

    return (
      <div className="relative mt-4 rounded-lg overflow-hidden">
        <Image
          src={formData.displayImage}
          alt="Display"
          width={600}
          height={192}
          className="w-full h-48 object-cover rounded-lg"
        />
        <button
          onClick={() => {
            setFormData((prev) => ({ ...prev, displayImage: null }));
            if (formData.displayImage) {
              URL.revokeObjectURL(formData.displayImage);
            }
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
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
                className={`w-full bg-[#1B2333] rounded-lg px-4 py-2.5 text-white ${
                  errors.name ? "border border-red-500" : ""
                }`}
                placeholder="Enter your fundraiser name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tell us about your FUNDRAISE...{" "}
                <span className="text-red-500">*</span>
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
                  className={`w-full bg-transparent p-4 min-h-[200px] text-white ${
                    errors.description ? "border border-red-500" : ""
                  }`}
                  placeholder="Describe your fundraiser..."
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
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
                  <div key={index} className="relative">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) =>
                        handleSocialLinkChange(index, e.target.value)
                      }
                      className={`w-full bg-[#1B2333] rounded-lg px-4 py-2.5 text-white placeholder-gray-400 ${
                        errors.socialLinks ? "border border-red-500" : ""
                      }`}
                      placeholder="Add your social media link"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Add your project&apos;s social media links
              </p>
              {errors.socialLinks && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.socialLinks}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      formData.category === category
                        ? "bg-[#0066FF] text-white"
                        : "bg-[#1B2333] text-gray-400 hover:bg-[#232B3D]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
                <button
                  onClick={() => handleCategorySelect("Other")}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    formData.category === "Other"
                      ? "bg-[#0066FF] text-white"
                      : "bg-[#1B2333] text-gray-400 hover:bg-[#232B3D]"
                  }`}
                >
                  Other
                </button>
              </div>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
              {formData.category === "Other" && (
                <input
                  type="text"
                  value={formData.otherCategory}
                  onChange={handleInputChange}
                  name="otherCategory"
                  className={`mt-2 w-full bg-[#1B2333] rounded-lg px-4 py-2.5 text-white ${
                    errors.otherCategory ? "border border-red-500" : ""
                  }`}
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
              {renderImagePreview()}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Add supporting images
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-[#0066FF] bg-[#1B2333]"
                    : "border-gray-700"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="mb-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  Drag & drop images here or,{" "}
                  <label className="text-[#0066FF] cursor-pointer hover:underline">
                    browse
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF. Max file size: 4MB
                </p>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded ${index + 1}`}
                        width={300}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-xl p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">
                  Fundraising Goal
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="goal" className="text-gray-300">
                    Goal Amount (in USD)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      $
                    </span>
                    <Input
                      id="goal"
                      type="number"
                      min="1"
                      step="0.01"
                      value={goal}
                      onChange={(e) => {
                        setGoal(e.target.value);
                        if (goalError) validateGoal(e.target.value);
                      }}
                      className="pl-8 bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter your fundraising goal"
                    />
                  </div>
                  {goalError && (
                    <p className="text-red-500 text-sm">{goalError}</p>
                  )}
                  <p className="text-sm text-gray-400">
                    Set a realistic goal for your fundraising campaign. You can
                    receive donations even if you don&apos;t reach your goal.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">
                  Campaign Duration
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-gray-300">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        if (dateError) validateDateTime();
                      }}
                      className="bg-gray-800 border-gray-700 text-white"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-gray-300">
                      End Time (optional)
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        if (dateError) validateDateTime();
                      }}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                {dateError && (
                  <p className="text-red-500 text-sm">{dateError}</p>
                )}
                <p className="text-sm text-gray-400">
                  Set when your fundraising campaign will end. If no time is
                  specified, it will end at 11:59 PM on the selected date.
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-between">
              <div className="flex gap-4">
                <button
                  onClick={handlePreview}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Loading..." : "Preview"}
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Loading..." : "Publish"}
                </button>
              </div>
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            {(errors.preview || errors.submit) && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {errors.preview || errors.submit}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleCreatePost = async () => {
    if (!validateGoal(goal) || !validateDateTime()) {
      return;
    }

    if (!formData.name || !formData.description) {
      setErrors((prev) => ({
        ...prev,
        submit: "Please fill in required fields",
      }));
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.name,
          content: formData.description,
          userId: address,
          category: formData.category,
          location: formData.location,
          goal: formData.goal,
          deadline: formData.endDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create fundraiser");
      }

      const data = await response.json();
      alert("Fundraiser created successfully!");
    } catch (error) {
      console.error("Error creating fundraiser:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to create fundraiser. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkWalletAddress = () => {
    console.log(formData.walletAddress);
    if (!formData.walletAddress) {
      setError("Please connect your wallet");
      return;
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-12 gap-8 min-h-screen">
          {/* Left Section */}
          <div className="col-span-5 bg-[#111827] relative">
            <div className="p-8">
              <Link
                href="/"
                className="inline-flex items-center text-2xl font-bold mb-12"
              >
                <span>FUND</span>
                <span className="text-[#0066FF]">CHAIN</span>
              </Link>

              <div className="relative">
                <h1 className="text-3xl font-bold mb-4">
                  Start your <span className="text-[#0066FF]">FUNDRAISE</span>{" "}
                  now
                </h1>
                <div className="mt-8">
                  <div className="w-full h-64 bg-gradient-to-b from-[#1a2436] to-[#111827] rounded-lg flex items-center justify-center">
                    <Upload className="h-16 w-16 text-[#0066FF] opacity-50" />
                  </div>
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
                    className="w-full bg-[#0066FF] text-white py-2.5 rounded-lg hover:bg-[#0052CC] transition-colors"
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

// Utility functions for image conversion
const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

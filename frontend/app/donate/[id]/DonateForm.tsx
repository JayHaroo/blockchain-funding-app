"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ChevronRight, AlertCircle, Check, ArrowRight } from "lucide-react";

type DonateFormProps = {
  projectId: string;
};

// Available networks configuration
const AVAILABLE_NETWORKS = [
  { id: "ethereum", name: "Ethereum" },
  { id: "polygon", name: "Polygon" },
  { id: "arbitrum", name: "Arbitrum" },
];

type ProjectData = {
  id: string;
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  category: string;
  endDate: string;
  acceptedTokens: string[];
  minimumDonation: number;
  blockchain: {
    network: string;
    contractAddress: string;
  };
};

export function DonateForm({ projectId }: DonateFormProps) {
  const [step, setStep] = useState(1);
  const [donationType, setDonationType] = useState<"one-time" | "recurring">(
    "one-time"
  );
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState("ethereum");
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        // Simulating API call with localStorage
        const data = localStorage.getItem(`project_${projectId}`);
        if (data) {
          const parsedData = JSON.parse(data) as ProjectData;
          setProjectData(parsedData);
          if (parsedData.acceptedTokens.length > 0) {
            setSelectedToken(parsedData.acceptedTokens[0]);
          }
        }
      } catch {
        console.error("Error fetching project data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleNetworkSwitch = async (networkId: string) => {
    setIsLoading(true);
    setNetworkError(null);
    try {
      // Simulating network switch
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentNetwork(networkId);
      setIsNetworkModalOpen(false);
    } catch {
      setNetworkError("Failed to switch network. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!amount || !selectedToken) return;
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleDonate = async () => {
    setIsLoading(true);
    try {
      // Simulating donation transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowSuccess(true);
      setTimeout(() => {
        window.location.href = "/my-donations";
      }, 3000);
    } catch {
      console.error("Donation failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!projectData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Project Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
          <Image
            src={projectData.image}
            alt={projectData.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{projectData.title}</h2>
          <p className="text-gray-600">{projectData.description}</p>
        </div>
      </div>

      {/* Step 1: Select Donation Type */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={donationType === "one-time" ? "default" : "outline"}
              onClick={() => setDonationType("one-time")}
              className="h-24"
            >
              <div className="text-center">
                <Check
                  className={`mx-auto mb-2 ${
                    donationType === "one-time" ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span>One-time Donation</span>
              </div>
            </Button>
            <Button
              variant={donationType === "recurring" ? "default" : "outline"}
              onClick={() => setDonationType("recurring")}
              className="h-24"
            >
              <div className="text-center">
                <Check
                  className={`mx-auto mb-2 ${
                    donationType === "recurring" ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span>Recurring Donation</span>
              </div>
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Token
              </label>
              <div className="grid grid-cols-3 gap-2">
                {projectData.acceptedTokens.map((token) => (
                  <Button
                    key={token}
                    variant={selectedToken === token ? "default" : "outline"}
                    onClick={() => setSelectedToken(token)}
                    className="h-12"
                  >
                    {token.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={projectData.minimumDonation}
                placeholder={`Min. ${projectData.minimumDonation} ${selectedToken}`}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <Button
              onClick={handleNext}
              disabled={!amount || !selectedToken || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Confirm Donation */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Donation Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium">
                  {donationType === "one-time" ? "One-time" : "Recurring"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">
                  {amount} {selectedToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <button
                  onClick={() => setIsNetworkModalOpen(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  {currentNetwork}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              Back
            </Button>
            <Button
              onClick={handleDonate}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                "Confirm Donation"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Network Switch Modal */}
      {isNetworkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Select Network</h3>
            <div className="space-y-2">
              {AVAILABLE_NETWORKS.map((network) => (
                <Button
                  key={network.id}
                  variant={
                    currentNetwork === network.id ? "default" : "outline"
                  }
                  onClick={() => handleNetworkSwitch(network.id)}
                  className="w-full justify-between"
                  disabled={isLoading}
                >
                  {network.name}
                  {currentNetwork === network.id && (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
              ))}
            </div>
            {networkError && (
              <div className="mt-4 p-2 bg-red-50 text-red-600 rounded-md flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {networkError}
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => setIsNetworkModalOpen(false)}
              className="mt-4 w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Donation Successful!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for your{" "}
              {donationType === "one-time"
                ? "donation"
                : "commitment to recurring donations"}
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your donations...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonateForm;

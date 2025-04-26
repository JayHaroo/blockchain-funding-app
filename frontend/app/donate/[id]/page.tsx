"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertCircle, Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Available networks configuration
const AVAILABLE_NETWORKS = [
  { id: "ethereum", name: "Ethereum", chainId: "0x1" },
  { id: "binance", name: "Binance Smart Chain", chainId: "0x38" },
  { id: "polygon", name: "Polygon", chainId: "0x89" },
  { id: "arbitrum", name: "Arbitrum", chainId: "0xa4b1" },
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

type PageProps = {
  params: {
    id: string;
  };
};

export default function DonatePage({ params }: PageProps) {
  const router = useRouter();
  const projectId = params.id;

  const [step, setStep] = useState(1);
  const [donationType, setDonationType] = useState<"one-time" | "recurring">("one-time");
  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState<string>("ethereum");
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock function to simulate blockchain transaction
  const mockBlockchainTransaction = async (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a mock transaction hash
        const hash = "0x" + Array.from({length: 64}, () => 
          Math.floor(Math.random() * 16).toString(16)).join("");
        resolve(hash);
      }, 2000); // Simulate 2 second blockchain transaction
    });
  };

  // Mock function to simulate updating project status
  const mockUpdateProjectStatus = async (amount: number) => {
    return new Promise((resolve) => {
      try {
        const projectsData = JSON.parse(localStorage.getItem("projectsData") || "{}");
        if (projectsData[projectId]) {
          projectsData[projectId].raised += amount;
          localStorage.setItem("projectsData", JSON.stringify(projectsData));
        }
        resolve(true);
      } catch (error) {
        console.error("Error updating project status:", error);
        resolve(false);
      }
    });
  };

  // Network switching function
  const handleNetworkSwitch = async (networkId: string) => {
    try {
      setIsLoading(true);
      setNetworkError(null);

      // Simulate network switching delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const network = AVAILABLE_NETWORKS.find(n => n.id === networkId);
      if (!network) {
        throw new Error("Invalid network selected");
      }

      // In a real app, this would use window.ethereum to switch networks
      // For demo, we'll just update the state
      setCurrentNetwork(networkId);
      setIsNetworkModalOpen(false);

      // Show success message
      alert(`Successfully switched to ${network.name} network`);
    } catch (error) {
      console.error("Network switch failed:", error);
      setNetworkError(error instanceof Error ? error.message : "Failed to switch network");
    } finally {
      setIsLoading(false);
    }
  };

  // Validate network before donation
  const validateNetwork = () => {
    if (!projectData) return;
    
    const requiredNetwork = projectData.blockchain.network.toLowerCase();
    if (currentNetwork !== requiredNetwork) {
      throw new Error(`Please switch to ${projectData.blockchain.network} network to donate`);
    }
  };

  // Fetch project data
  useEffect(() => {
    const fetchProjectData = () => {
      try {
        // In a real app, this would be an API call
        const projectsData = JSON.parse(localStorage.getItem("projectsData") || "{}");
        const project = projectsData[projectId];
        
        if (project) {
          setProjectData(project);
          // Set default token if available
          if (project.acceptedTokens?.length > 0) {
            setSelectedToken(project.acceptedTokens[0]);
          }
          // Set current network to project's network
          setCurrentNetwork(project.blockchain.network.toLowerCase());
        } else {
          setError("Project not found");
          setTimeout(() => {
            router.push("/projects");
          }, 2000);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        setError("Error loading project data");
      }
    };

    fetchProjectData();
  }, [projectId, router]);

  const validateDonation = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      throw new Error("Please enter a valid donation amount");
    }

    if (projectData && Number(amount) < projectData.minimumDonation) {
      throw new Error(`Minimum donation amount is $${projectData.minimumDonation}`);
    }

    if (!selectedToken) {
      throw new Error("Please select a token for donation");
    }

    if (!projectData?.acceptedTokens.includes(selectedToken)) {
      throw new Error("Selected token is not accepted for this project");
    }

    // Validate network
    validateNetwork();
  };

  const handleNext = () => {
    try {
      validateDonation();
      setStep(2);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Invalid donation details");
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleDonate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate blockchain transaction
      const hash = await mockBlockchainTransaction();

      // Update project status
      const amountNum = Number(amount);
      await mockUpdateProjectStatus(amountNum);

      // Store donation in local storage
      const donations = JSON.parse(localStorage.getItem("donations") || "[]");
      const timestamp = new Date().toISOString();
      const newDonation = {
        id: `d${Date.now()}`,
        projectId,
        projectName: projectData?.title,
        amount: amountNum,
        token: selectedToken,
        date: timestamp,
        transactionHash: hash,
        type: donationType,
        status: "completed",
        donor: "Current User",
        network: projectData?.blockchain.network
      };
      
      donations.unshift(newDonation);
      localStorage.setItem("donations", JSON.stringify(donations));

      // Update project data
      if (projectData) {
        const updatedProject = {
          ...projectData,
          raised: projectData.raised + amountNum
        };
        setProjectData(updatedProject);

        const projectsData = JSON.parse(localStorage.getItem("projectsData") || "{}");
        projectsData[projectId] = updatedProject;
        localStorage.setItem("projectsData", JSON.stringify(projectsData));
      }

      // Show success animation
      setShowSuccess(true);
      
      // Wait for animation and redirect
      setTimeout(() => {
        router.push("/my-donations");
      }, 2000);

    } catch (error) {
      console.error("Donation failed:", error);
      setError(error instanceof Error ? error.message : "Donation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Network Modal Component
  const NetworkModal = () => {
    if (!isNetworkModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#131B2F] rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-4 text-white">Switch Network</h3>
          <div className="space-y-2">
            {AVAILABLE_NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => handleNetworkSwitch(network.id)}
                className={`w-full p-4 rounded-lg flex items-center justify-between ${
                  currentNetwork === network.id
                    ? "bg-blue-500 text-white"
                    : "bg-[#1B2333] text-gray-300 hover:bg-[#232B3D]"
                }`}
                disabled={isLoading}
              >
                <span>{network.name}</span>
                {currentNetwork === network.id && (
                  <span className="text-sm bg-blue-600 px-2 py-1 rounded">Connected</span>
                )}
              </button>
            ))}
          </div>
          {networkError && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{networkError}</p>
            </div>
          )}
          <button
            onClick={() => setIsNetworkModalOpen(false)}
            className="mt-4 w-full p-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-[#1B2333]"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Success Animation Component
  const SuccessAnimation = () => {
    if (!showSuccess) return null;

    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="mb-6">
            <div className="h-20 w-20 rounded-full bg-green-500 mx-auto flex items-center justify-center animate-bounce">
              <Check className="h-10 w-10 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Donation Successful!</h3>
          <p className="text-gray-400 mb-4">Thank you for your support</p>
          <p className="text-sm text-gray-500">Redirecting to My Donations...</p>
        </div>
      </div>
    );
  };

  if (error) {
  return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Link href="/projects" className="text-blue-500 hover:underline">
            Return to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((projectData.raised / projectData.goal) * 100, 100);

  return (
    <div className="min-h-screen bg-black">
      <NetworkModal />
      <SuccessAnimation />
      
      <div className="container mx-auto px-4 py-8">
        <Link href="/projects" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Project info */}
          <div className="space-y-6">
            <Image
              src={projectData.image || "/placeholder.svg"}
              alt={projectData.title}
              width={600}
              height={400}
              className="rounded-xl w-full object-cover"
            />
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">{projectData.title}</h1>
              <div className="text-gray-400 space-y-4">
                {projectData.description.split("\n\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
          </div>
        </div>

        {/* Right side - Donation form */}
          <div className="bg-white rounded-xl p-6">
          <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-[#0066FF] mb-6">
                DONATE
            </h2>

              {step === 1 ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-black mb-4">{projectData.title}</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-black">Raised</span>
                        <span className="text-black">${projectData.raised.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-3">
                        <span className="text-black">Goal</span>
                        <span className="text-black">${projectData.goal.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#0066FF]" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {progressPercentage.toFixed(1)}% funded
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-black mb-3">How do you want to donate?</h4>
                      <div className="flex gap-3">
                  <Button
                          variant={donationType === "one-time" ? "default" : "outline"}
                    onClick={() => setDonationType("one-time")}
                          className={`flex-1 ${donationType === "one-time" ? "bg-[#0066FF] hover:bg-[#0052CC]" : "text-black"}`}
                  >
                    One-Time Donation
                  </Button>
                  <Button
                          variant={donationType === "recurring" ? "default" : "outline"}
                    onClick={() => setDonationType("recurring")}
                          className={`flex-1 ${donationType === "recurring" ? "bg-[#0066FF] hover:bg-[#0052CC]" : "text-black"}`}
                  >
                          Recurring Donation
                  </Button>
                      </div>
                </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-black">Network:</span>
                          <span className="ml-2 font-medium text-black capitalize">{currentNetwork}</span>
                        </div>
                        <Button
                          variant="link"
                          onClick={() => setIsNetworkModalOpen(true)}
                          className="text-[#0066FF] p-0 hover:text-[#0052CC]"
                          disabled={isLoading}
                        >
                    Switch Network
                  </Button>
                </div>

                      <div className="text-sm text-black">
                        Minimum donation: ${projectData.minimumDonation}
                      </div>
                </div>

                    {networkError && (
                      <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">{networkError}</p>
                      </div>
                    )}

                    <div>
                  <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-black">Select Token</span>
                        <span className="text-sm text-gray-500">USD</span>
                  </div>
                      <div className="flex gap-3">
                    <select
                          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-black"
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                    >
                          {projectData.acceptedTokens.map((token) => (
                            <option key={token} value={token}>{token}</option>
                          ))}
                    </select>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-right text-black"
                    />
                  </div>
                    </div>

                    <Button
                      onClick={handleNext}
                      className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white"
                      disabled={isLoading}
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
              </>
              ) : (
                <div className="space-y-6">
                  <h3 className="font-medium text-black text-lg">Confirm your donation</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-black">Amount</span>
                      <span className="text-black font-medium">
                        {amount} {selectedToken}
                    </span>
                  </div>
                    <div className="flex justify-between">
                      <span className="text-black">Type</span>
                      <span className="text-black">
                        {donationType === "one-time" ? "One-time donation" : "Recurring donation"}
                    </span>
                  </div>
                    <div className="flex justify-between">
                      <span className="text-black">Project</span>
                      <span className="text-black">{projectData?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Network</span>
                      <span className="text-black">{currentNetwork}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    By proceeding, you confirm that you want to donate to this project.
                    All transactions are secured and processed on the blockchain.
                </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <p className="text-sm">{error}</p>
              </div>
            )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 text-black"
                      disabled={isLoading}
                    >
                  Back
                </Button>
                <Button
                      onClick={handleDonate}
                      className="flex-1 bg-[#0066FF] hover:bg-[#0052CC]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                  Confirm Donation
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

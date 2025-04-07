"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DonatePage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const projectId = params.id;

  const [step, setStep] = useState(1);
  const [donationType, setDonationType] = useState<"one-time" | "recurring">(
    "one-time"
  );
  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState("");

  // This would be fetched from an API in a real application
  const projectData = {
    id: projectId,
    title: "Paw It Forward: Jayjay's Journey",
    description: `Jayjay faces challenges every morning, but still greets the neighborhood helpers wagging his tail at every passerby with a spark of hope in his eyes. Despite missing one of his legs, Jayjay never fails to greet everyone with warmth and unconditional love. He has become a familiar sight in our community, and his resilience has touched the hearts of everyone who meets him.
    
    No one knows exactly how Jayjay lost his leg. Some say it might have been an accident, others believe he was born with a condition. But what everyone agrees on is how strong and brave Jayjay is. He doesn't let his disability stop him from enjoying life to the fullest.
    
    Some kids even all rush to him after school, feeling like they have a loyal friend who listens without saying a word.
    
    As a concerned citizen who has shared countless resources with strays, I'm now collecting funds to help Jayjay get a custom-made prosthetic leg. This will allow him to run and play like other dogs. But without a proper leg or prosthetic, he struggles to keep up. That's why I want to raise funds to give him a second chance—to buy him a custom-made prosthetic leg designed especially for dogs like Jayjay.
    
    Jayjay has given so much love to our community. Now, it's our turn to give back.
    With your help, we can help Jayjay walk, run, and chase after dreams like every dog deserves.`,
    image: "/fundchain/jayjay.png",
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-2" />
            <span className="font-bold">
              FUND<span className="text-blue-500">CHAIN</span>
            </span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left side - Project info */}
        <div className="bg-black p-8">
          <div className="max-w-md mx-auto">
            <Image
              src={projectData.image || "/placeholder.svg?height=300&width=400"}
              alt={projectData.title}
              width={400}
              height={300}
              className="rounded-md mb-4"
            />
            <h2 className="text-xl font-bold mb-4">{projectData.title}</h2>
            {step === 1 && (
              <div className="text-sm space-y-4 max-h-[400px] overflow-y-auto pr-4">
                {projectData.description.split("\n\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Donation form */}
        <div className="bg-white text-gray-800 p-8 rounded-l-lg">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2">
              FUND<span className="text-blue-500">DONATE</span>
            </h2>

            {step === 1 && (
              <>
                <p className="text-lg font-medium mb-6">{projectData.title}</p>
                <p className="text-sm mb-4">Click link for more information</p>
                <p className="text-xs text-blue-500 mb-8">
                  https://www.example.com/photo/handicapped-stray-dog-sitting-near-the-food-tray
                </p>

                <h3 className="font-medium mb-4">How do you want to donate?</h3>

                <div className="flex gap-4 mb-6">
                  <Button
                    variant={
                      donationType === "one-time" ? "default" : "outline"
                    }
                    onClick={() => setDonationType("one-time")}
                    className={donationType === "one-time" ? "bg-blue-500" : ""}
                  >
                    One-Time Donation
                  </Button>
                  <Button
                    variant={
                      donationType === "recurring" ? "default" : "outline"
                    }
                    onClick={() => setDonationType("recurring")}
                    className={
                      donationType === "recurring" ? "bg-blue-500" : ""
                    }
                  >
                    Recurring Donation 🔄
                  </Button>
                </div>

                <div className="mb-6 p-3 bg-gray-100 rounded-md flex items-center text-sm">
                  <span className="flex-1">
                    Save on gas fees, switch network
                  </span>
                  <Button variant="link" className="text-blue-500 p-0">
                    Switch Network
                  </Button>
                </div>

                <div className="mb-6 p-3 bg-gray-100 rounded-md flex items-center text-sm">
                  <span className="flex-1">
                    $3 makes you eligible for SORadio
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Select Token</span>
                    <span className="text-sm text-gray-500">
                      {selectedToken || "$USD"}
                    </span>
                  </div>
                  <div className="flex">
                    <select
                      className="border border-gray-300 rounded-l-none px-4 py-2 w-1/3"
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                    >
                      <option value="$USD">$USD</option>
                      <option value="ETH">ETH</option>
                      <option value="BTC">BTC</option>
                      <option value="DAI">DAI</option>
                    </select>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="border border-gray-300 rounded-l-none px-4 py-2 w-1/3 text-right"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-medium">Confirm your donation</h3>
                <div className="p-4 bg-gray-100 rounded-md">
                  <p className="font-medium">Donation Summary</p>
                  <div className="flex justify-between mt-2">
                    <span>Amount:</span>
                    <span>
                      {amount || "0.00"} {selectedToken || "USD"}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Type:</span>
                    <span>
                      {donationType === "one-time"
                        ? "One-time donation"
                        : "Recurring donation"}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Project:</span>
                    <span>{projectData.title}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  By proceeding, you confirm that you are donating to support
                  this project. All transactions are secured and processed on
                  the blockchain.
                </p>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button onClick={handlePrevious} variant="outline">
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {step < 2 ? (
                <Button
                  onClick={handleNext}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Next <ChevronRight size={16} />
                </Button>
              ) : (
                <Button className="bg-blue-500 hover:bg-blue-600 w-full">
                  Confirm Donation
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

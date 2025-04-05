"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section - Redesigned to match the image */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          {/* Background Image 1 (Further Back) */}
          <div className="absolute w-[80%] opacity-20">
            <Image
              src="/fundchain/2.webp"
              alt="Background Placeholder 1"
              width={800}
              height={600}
              className="object-cover mx-auto"
            />
          </div>

          {/* Background Image 2 (Directly Behind Button) */}
          <div className="absolute w-[60%] opacity-30">
            <Image
              src="/fundchain/4.webp"
              alt="Background Placeholder 2"
              width={700}
              height={100}
              className="object-cover mx-auto"
            />
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            {/* Main Image & Button */}
            <div className="relative flex items-center justify-center w-full max-w-2xl">
              <Image
                src="/fundchain/1.webp"
                alt="Placeholder"
                width={600}
                height={450}
                className="object-contain"
              />

              {/* Centered Button (Adjusted Position) */}
              <div className="absolute top-[40%] flex items-center justify-center">
                <Link href={user ? "/projects" : "/sign-up"}>
                  <Button className="bg-blue-600 hover:bg-blue-700 px-12 py-4 text-lg rounded-lg">
                    {user ? "Explore Projects" : "Join FundChain"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Text Below */}
            <div className="mt-6 max-w-2xl text-center text-white">
              <p>
                A{" "}
                <span className="font-bold text-blue-500">
                  transparent, secure, and decentralized
                </span>{" "}
                crowdfunding.
              </p>
              <p>
                Our platform connects passionate change makers, innovators, and
                supporters, creating a trusted space where funding thrives and
                every contribution counts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Updated to match the image */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4 max-w-5xl mx-auto">
            {/* First row */}
            <div className="flex flex-col md:flex-row w-full gap-4">
              <div className="bg-blue-600 text-white py-3 px-6 rounded md:w-1/2 text-center">
                <span className="font-medium">
                  Every donation tracked on-chain
                </span>
              </div>
              <div className="bg-blue-600 text-white py-3 px-6 rounded md:w-1/2 text-center">
                <span className="font-medium">
                  Instant withdrawals, no delays/ middlemen
                </span>
              </div>
            </div>

            {/* Second row */}
            <div className="flex flex-col md:flex-row w-full gap-4">
              <div className="bg-blue-600 text-white py-3 px-6 rounded md:w-2/3 text-center">
                <span className="font-medium">
                  Full transparency with smart contract-powered donations
                </span>
              </div>
              <div className="bg-blue-600 text-white py-3 px-6 rounded md:w-1/3 text-center">
                <span className="font-medium">Open and trusted</span>
              </div>
            </div>

            {/* Bottom row */}
            <div className="bg-blue-600 text-white py-3 px-6 rounded w-full text-center mt-2">
              <span className="font-medium">
                Empowering creators, charities & communities to thrive
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-5xl font-bold text-blue-500">
            EXPLORE
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden bg-gray-800/80 text-white">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Dog named Jayjay"
                    width={400}
                    height={200}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-lg font-medium">{`Hi! I'm Jayjay`}</p>
                  </div>
                </div>
                <div className="p-6 text-sm">
                  <p>
                    {`Jayjay is my wonder dog. Every morning, he sits quietly by
                    his bowl waiting for his breakfast. He's very smart and
                    loves to play fetch. He lost his rear leg in an accident,
                    but that doesn't slow him down. He runs and plays just like
                    any other dog.`}
                  </p>
                  <p className="mt-3">
                    {`As a concerned citizen who has shared countless resources
                    with strays, I'm now collecting funds for a custom-made
                    prosthetic leg designed especially for dogs like Jayjay.`}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-700 p-4">
                <Link href={user ? "/fundraiser/f1" : "/sign-in"}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    {user ? "DONATE" : "SIGN IN TO DONATE"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Placeholder cards */}
            {[1, 2, 3, 4, 5].map((i) => (
              <Card
                key={i}
                className="overflow-hidden bg-gray-800/80 text-white"
              >
                <CardContent className="p-0">
                  <div className="h-48 w-full bg-gray-700"></div>
                  <div className="p-6">
                    <p className="text-sm">Project description placeholder</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-gray-700 p-4">
                  <Link href={user ? `/fundraiser/f${i + 1}` : "/sign-in"}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      {user ? "DONATE" : "SIGN IN TO DONATE"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

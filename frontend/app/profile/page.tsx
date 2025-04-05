"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Pencil, MapPin, LinkIcon } from "lucide-react";

// Update the component to include profile picture upload functionality
export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [bio, setBio] = useState(
    "Web3 enthusiast and blockchain developer. Passionate about decentralized finance and community-driven projects."
  );
  const [editingBio, setEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(bio);

  const [name, setName] = useState(user?.name || "sean");
  const [location, setLocation] = useState("San Francisco, CA");
  const [website, setWebsite] = useState("https://mywebsite.com");
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempLocation, setTempLocation] = useState(location);
  const [tempWebsite, setTempWebsite] = useState(website);

  // Add state for profile picture
  const [profilePicture, setProfilePicture] = useState(
    user?.avatar || "/placeholder.svg?height=80&width=80"
  );
  const [coverImage, setCoverImage] = useState(
    "/placeholder.svg?height=200&width=1000"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, isLoading, router]);

  // Update profile data from user object when it loads
  useEffect(() => {
    if (user) {
      setName(user.name);
      if (user.avatar) {
        setProfilePicture(user.avatar);
      }
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-150"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-300"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSaveBio = () => {
    setBio(tempBio);
    setEditingBio(false);
  };

  const handleSaveProfile = () => {
    setName(tempName);
    setLocation(tempLocation);
    setWebsite(tempWebsite);
    setEditingProfile(false);

    // Update the user in the auth context
    updateUser({
      name: tempName,
      avatar: profilePicture,
    });

    // Here you would typically make an API call to update the user's profile
    // For example: updateUserProfile({ name: tempName, location: tempLocation, website: tempWebsite });
  };

  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCoverImageClick = () => {
    if (coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          const newProfilePic = event.target.result;
          setProfilePicture(newProfilePic);

          // Update the user avatar in the auth context immediately
          // This will update the navbar profile picture in real-time
          updateUser({ avatar: newProfilePic });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setCoverImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = () => {
    const date = new Date();
    return `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-xl p-4 sticky top-24">
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  <span>Home</span>
                </Link>

                <Link
                  href="/projects"
                  className="flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>Search Projects</span>
                </Link>

                <Link
                  href="/donations"
                  className="flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>My Donations</span>
                </Link>

                <Link
                  href="/communities"
                  className="flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                  <span>Communities</span>
                </Link>
              </nav>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {[
                    "Community",
                    "Medical",
                    "Education",
                    "Environment",
                    "Technology",
                  ].map((category) => (
                    <Link
                      key={category}
                      href={`/category/${category.toLowerCase()}`}
                      className="block text-gray-300 hover:text-white p-2 hover:bg-gray-800 rounded transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Profile Header */}
            <div className="bg-gray-900 rounded-xl overflow-hidden mb-6">
              <div
                className="h-32 bg-blue-600 relative group"
                style={{
                  backgroundImage: `url(${coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {editingProfile && (
                  <button
                    onClick={handleCoverImageClick}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-white bg-gray-800 px-3 py-1 rounded-lg">
                      Change Cover
                    </span>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverImageChange}
                    />
                  </button>
                )}
              </div>
              <div className="p-6 relative">
                <div
                  className="absolute -top-12 left-6 border-4 border-gray-900 rounded-full overflow-hidden group cursor-pointer"
                  onClick={
                    editingProfile ? handleProfilePictureClick : undefined
                  }
                >
                  <Image
                    src={profilePicture || "/placeholder.svg"}
                    alt={name}
                    width={80}
                    height={80}
                    className="bg-gray-800"
                  />
                  {editingProfile && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </div>

                <div className="mt-10 flex justify-between items-start">
                  <div>
                    {editingProfile ? (
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="text-2xl font-bold bg-gray-800 border border-gray-700 rounded p-1 mb-1 w-full"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold">{name}</h1>
                    )}
                    <p className="text-gray-400 text-sm">
                      {formatDate()} • Web3 Enthusiast
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="p-2 rounded-full hover:bg-gray-800"
                  >
                    {editingProfile ? (
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <Pencil className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="mt-4">
                  {editingBio ? (
                    <div className="space-y-3">
                      <textarea
                        value={tempBio}
                        onChange={(e) => setTempBio(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveBio}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setTempBio(bio);
                            setEditingBio(false);
                          }}
                          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group relative">
                      <p className="text-gray-300">{bio}</p>
                      <button
                        onClick={() => {
                          setTempBio(bio);
                          setEditingBio(true);
                        }}
                        className="absolute top-0 right-0 p-1 rounded-full bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Profile Information */}
            <div className="mt-6 space-y-4">
              {/* Location */}
              <div className="group relative">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  {editingProfile ? (
                    <input
                      type="text"
                      value={tempLocation}
                      onChange={(e) => setTempLocation(e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded p-1 text-white text-sm"
                      placeholder="Your location"
                    />
                  ) : (
                    <span className="text-gray-300 text-sm">{location}</span>
                  )}
                </div>
              </div>

              {/* Website */}
              <div className="group relative">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-gray-400" />
                  {editingProfile ? (
                    <input
                      type="text"
                      value={tempWebsite}
                      onChange={(e) => setTempWebsite(e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded p-1 text-white text-sm"
                      placeholder="Your website"
                    />
                  ) : (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-sm hover:underline"
                    >
                      {website}
                    </a>
                  )}
                </div>
              </div>

              {/* Save/Cancel buttons for profile editing */}
              {editingProfile && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
                  >
                    Save Profile
                  </button>
                  <button
                    onClick={() => {
                      setTempName(name);
                      setTempLocation(location);
                      setTempWebsite(website);
                      setEditingProfile(false);
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4 py-1">
                  <p className="text-sm text-gray-400">Apr 5, 2025</p>
                  <p className="text-white">
                    Created a new fundraiser:{" "}
                    <Link
                      href="/fundraiser/blockchain-education"
                      className="text-blue-400 hover:underline"
                    >
                      Blockchain Education Initiative
                    </Link>
                  </p>
                </div>

                <div className="border-l-2 border-green-500 pl-4 py-1">
                  <p className="text-sm text-gray-400">Apr 3, 2025</p>
                  <p className="text-white">
                    Donated <span className="text-green-400">$50</span> to{" "}
                    <Link
                      href="/fundraiser/medical-support"
                      className="text-blue-400 hover:underline"
                    >
                      Medical Support for Children
                    </Link>
                  </p>
                </div>

                <div className="border-l-2 border-purple-500 pl-4 py-1">
                  <p className="text-sm text-gray-400">Mar 28, 2025</p>
                  <p className="text-white">
                    Joined the{" "}
                    <Link
                      href="/community/web3-developers"
                      className="text-blue-400 hover:underline"
                    >
                      Web3 Developers
                    </Link>{" "}
                    community
                  </p>
                </div>
              </div>
            </div>

            {/* User Fundraisers */}
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Fundraisers</h2>
                <Link
                  href="/fundraiser/create"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
                >
                  Create New
                </Link>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between">
                    <h3 className="font-medium">
                      Blockchain Education Initiative
                    </h3>
                    <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Goal: $10,000 • Raised: $2,500 (25%)
                  </p>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full mt-2">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>

                <div className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Web3 Developer Scholarship</h3>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      Draft
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Goal: $5,000 • Not published yet
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-1">
            {/* Trending Projects */}
            <div className="bg-gray-900 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Trending Projects</h3>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Medical Support for Children", amount: "$5,022" },
                  { title: "Mental Health Support Network", amount: "$7,917" },
                  { title: "Medical Support for Children", amount: "$8,412" },
                ].map((project, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {project.amount} raised
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-blue-400 text-sm mt-4 hover:underline">
                See More Trending Projects
              </button>
            </div>

            {/* Upcoming Events */}
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Upcoming Events</h3>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div className="space-y-4">
                {[
                  {
                    month: "APR",
                    day: "15",
                    title: "Fundraising Workshop",
                    desc: "Learn how to create successful campaigns",
                  },
                  {
                    month: "APR",
                    day: "22",
                    title: "Community Meetup",
                    desc: "Connect with other fundraisers",
                  },
                  {
                    month: "MAY",
                    day: "05",
                    title: "Charity Gala",
                    desc: "Annual fundraising event",
                  },
                ].map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-12 h-14 bg-blue-600/20 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs text-blue-400">
                        {event.month}
                      </span>
                      <span className="text-lg font-bold text-blue-400">
                        {event.day}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-gray-400">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

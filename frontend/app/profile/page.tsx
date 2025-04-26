"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Pencil, MapPin, LinkIcon } from "lucide-react";

interface Project {
  organizer: string;
  organizerAvatar: string;
  [key: string]: string | number | boolean | undefined;
}

interface Fundraiser {
  organizer: string;
  organizerAvatar: string;
  [key: string]: string | number | boolean | undefined;
}

// Update the component to include profile picture upload functionality
export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [bio, setBio] = useState(
    "Web3 enthusiast and blockchain developer. Passionate about decentralized finance and community-driven projects."
  );
  const [editingBio, setEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(bio);

  const [name, setName] = useState(user?.name || "John");
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

  const handleProfilePictureChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target && typeof event.target.result === "string") {
          const newProfilePic = event.target.result;
          setProfilePicture(newProfilePic);

          // Update user data in localStorage
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          userData.avatar = newProfilePic;
          localStorage.setItem('userData', JSON.stringify(userData));

          // Update the user avatar in the auth context
          updateUser({ 
            ...user,
            avatar: newProfilePic 
          });

          // Update all fundraisers with the new profile picture
          try {
            const projectsData = JSON.parse(localStorage.getItem('projectsData') || '{}');
            const updatedProjects = Object.entries(projectsData).reduce<Record<string, Project>>((acc, [key, project]) => {
              if ((project as Project).organizer === user.name) {
                acc[key] = {
                  ...project as Project,
                  organizerAvatar: newProfilePic
                };
              } else {
                acc[key] = project as Project;
              }
              return acc;
            }, {});
            localStorage.setItem('projectsData', JSON.stringify(updatedProjects));

            // Update fundraisers list if exists
            const fundraisers = JSON.parse(localStorage.getItem('fundraisers') || '[]');
            const updatedFundraisers = fundraisers.map((fundraiser: Fundraiser) => {
              if (fundraiser.organizer === user.name) {
                return {
                  ...fundraiser,
                  organizerAvatar: newProfilePic
                };
              }
              return fundraiser;
            });
            localStorage.setItem('fundraisers', JSON.stringify(updatedFundraisers));
          } catch (error) {
            console.error('Error updating projects with new profile picture:', error);
          }
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
            <div className="relative mb-8">
              {/* Cover Image */}
              <div 
                className="relative h-[200px] w-full rounded-xl overflow-hidden cursor-pointer"
                onClick={handleCoverImageClick}
              >
                <Image
                  src={coverImage}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Pencil className="w-6 h-6" />
                </div>
              </div>

              {/* Profile Picture */}
              <div className="absolute -bottom-16 left-8">
                <div 
                  className="relative w-32 h-32 rounded-full border-4 border-black overflow-hidden cursor-pointer group"
                  onClick={handleProfilePictureClick}
                >
                  <Image
                    src={profilePicture}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Pencil className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Hidden file inputs */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
              <input
                type="file"
                ref={coverInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
            </div>

            {/* Profile Content */}
            <div className="mt-20">
              {editingProfile ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-gray-900 text-white text-2xl font-bold p-2 rounded-lg w-full"
                  />
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={tempLocation}
                      onChange={(e) => setTempLocation(e.target.value)}
                      className="bg-gray-900 text-gray-300 p-2 rounded-lg flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={tempWebsite}
                      onChange={(e) => setTempWebsite(e.target.value)}
                      className="bg-gray-900 text-blue-400 p-2 rounded-lg flex-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{name}</h1>
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {website}
                    </a>
                  </div>
                </div>
              )}

              {/* Bio section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">About</h2>
                  <button
                    onClick={() => setEditingBio(true)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>
                {editingBio ? (
                  <div className="space-y-4">
                    <textarea
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                      className="w-full h-32 bg-gray-900 text-white p-4 rounded-lg resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveBio}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingBio(false)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{bio}</p>
                )}
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

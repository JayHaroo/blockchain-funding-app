"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type UserWithPassword = User & {
  password: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const validImageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
function isValidImagePath(path: string): boolean {
  return validImageExtensions.some((ext) => path.toLowerCase().endsWith(ext));
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const fallbackAvatar = "/avatar.jpg";
      const avatar = isValidImagePath(fallbackAvatar)
        ? fallbackAvatar
        : undefined;

      setUser({
        id: "default_user",
        name: "John Doe",
        email: "john.doe@example.com",
        avatar,
      });
    }
    setIsLoading(false);
  }, []);

  const SERVER_URL = "http://localhost:3001/api/login";

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      const { user: loggedInUser } = data;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = loggedInUser;

      if (
        userWithoutPassword.avatar &&
        !isValidImagePath(userWithoutPassword.avatar)
      ) {
        userWithoutPassword.avatar = undefined;
      }

      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      return true;
    } catch (error) {
      console.error("Sign in error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  // const signIn = async (email: string, password: string): Promise<boolean> => {
  //   setIsLoading(true);
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     const users = JSON.parse(
  //       localStorage.getItem("users") || "[]"
  //     ) as UserWithPassword[];
  //     const foundUser = users.find(
  //       (u) => u.email === email && u.password === password
  //     );

  //     if (!foundUser) throw new Error("Invalid email or password");

  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { password: _, ...userWithoutPassword } = foundUser;

  //     if (
  //       userWithoutPassword.avatar &&
  //       !isValidImagePath(userWithoutPassword.avatar)
  //     ) {
  //       userWithoutPassword.avatar = undefined;
  //     }

  //     localStorage.setItem("user", JSON.stringify(userWithoutPassword));
  //     setUser(userWithoutPassword);
  //     return true;
  //   } catch (error) {
  //     console.error("Sign in error:", error);
  //     return false;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = JSON.parse(
        localStorage.getItem("users") || "[]"
      ) as UserWithPassword[];
      const userExists = users.some((u) => u.email === email);
      if (userExists) throw new Error("User already exists");

      const avatar = "/avatar.jpg";
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password,
        name,
        avatar: isValidImagePath(avatar) ? avatar : undefined,
      };

      localStorage.setItem("users", JSON.stringify([...users, newUser]));

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = newUser;

      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      return true;
    } catch (error) {
      console.error("Sign up error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      let avatar = updates.avatar;
      if (avatar && !isValidImagePath(avatar) && !avatar.startsWith('data:image/')) {
        avatar = undefined;
      }

      const updatedUser = { ...user, ...updates, avatar };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      const users = JSON.parse(
        localStorage.getItem("users") || "[]"
      ) as UserWithPassword[];
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, ...updates, avatar } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.avatar = avatar;
      localStorage.setItem('userData', JSON.stringify(userData));

      try {
        const projectsData = JSON.parse(localStorage.getItem('projectsData') || '{}');
        const updatedProjects = Object.entries(projectsData).reduce<Record<string, unknown>>((acc, [key, project]) => {
          const typedProject = project as { organizer: string; organizerAvatar: string };
          if (typedProject.organizer === user.name) {
            acc[key] = {
              ...typedProject,
              organizerAvatar: avatar
            };
          } else {
            acc[key] = project;
          }
          return acc;
        }, {});
        localStorage.setItem('projectsData', JSON.stringify(updatedProjects));

        const fundraisers = JSON.parse(localStorage.getItem('fundraisers') || '[]');
        const updatedFundraisers = fundraisers.map((fundraiser: { organizer: string; organizerAvatar: string }) => {
          if (fundraiser.organizer === user.name) {
            return {
              ...fundraiser,
              organizerAvatar: avatar
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

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signUp, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

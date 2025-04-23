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
    const storedAvatar = localStorage.getItem("userAvatar");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // If there's a stored avatar, use it
      if (storedAvatar) {
        parsedUser.avatar = storedAvatar;
      }
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = JSON.parse(
        localStorage.getItem("users") || "[]"
      ) as UserWithPassword[];
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) throw new Error("Invalid email or password");

      const { password: _, ...userWithoutPassword } = foundUser;

      // Get stored avatar if exists
      const storedAvatar = localStorage.getItem("userAvatar");
      if (storedAvatar) {
        userWithoutPassword.avatar = storedAvatar;
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
  };

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

      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password,
        name,
        avatar: undefined
      };

      localStorage.setItem("users", JSON.stringify([...users, newUser]));

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
    // Don't remove avatar on signout to persist it
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };

      // If updating avatar, store it separately
      if (updates.avatar) {
        localStorage.setItem("userAvatar", updates.avatar);
      }

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update in users list
      const users = JSON.parse(
        localStorage.getItem("users") || "[]"
      ) as UserWithPassword[];
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, ...updates } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
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

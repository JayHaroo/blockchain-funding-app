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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user session from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Simulated default user (optional for demo purposes)
      setUser({
        id: "default_user",
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "/avatar.jpg",
      });
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!foundUser) throw new Error("Invalid email or password");

      const { password: _, ...userWithoutPassword } = foundUser;
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

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some((u: any) => u.email === email);
      if (userExists) throw new Error("User already exists");

      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password,
        name,
        avatar: `/avatar.jpg`,
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
    setUser(null);
  };

  // Add updateUser function to update user properties globally
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };

      // Update local state
      setUser(updatedUser);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update the user in the users array if it exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.map((u: any) =>
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

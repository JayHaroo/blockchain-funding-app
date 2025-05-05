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
  // updateUser: (updates: Partial<User>) => void;
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
    // Initially, check if a user is logged in via the API
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/currentUser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // if (!response.ok) {
        //   throw new Error("Failed to fetch user data");
        // }

        const data = await response.json();
        const loggedInUser = data;

        if (loggedInUser) {
          setUser(loggedInUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
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
      const loggedInUser = data;

      if (!loggedInUser) {
        throw new Error("loggedInUser is undefined");
      }

      const { password: _, ...userWithoutPassword } = loggedInUser;

      if (
        userWithoutPassword.avatar &&
        !isValidImagePath(userWithoutPassword.avatar)
      ) {
        userWithoutPassword.avatar = undefined;
      }

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
      const response = await fetch("http://localhost:3001/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      const data = await response.json();
      const newUser = data;

      const { password: _, ...userWithoutPassword } = newUser;

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
    // Sign out from the API
    fetch("http://localhost:3001/api/logout", {
      method: "POST",
    })
      .then(() => setUser(null))
      .catch((error) => console.error("Sign out error:", error));
  };

  // const updateUser = async (updates: Partial<User>) => {
  //   if (user) {
  //     try {
  //       const response = await fetch(`http://localhost:3001/api/updateUser`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ ...user, ...updates }),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to update user");
  //       }

  //       const updatedUser = await response.json();
  //       setUser(updatedUser);
  //     } catch (error) {
  //       console.error("Error updating user:", error);
  //     }
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signUp, signOut }}
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


import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    name: "Suryamani Pathak",
    email: "sr@gmail.com",
    password: "password123",
    image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=400&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "2",
    name: "Ayush Mishra",
    email: "ay@gmail.com",
    password: "password123",
    image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=400&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword as User);
          localStorage.setItem("user", JSON.stringify(userWithoutPassword));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error("Invalid email or password"));
        }
      }, 1000);
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const existingUser = MOCK_USERS.find(u => u.email === email);
        
        if (existingUser) {
          setIsLoading(false);
          reject(new Error("Email already in use"));
        } else {
          const newUser = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            email,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
          };
          
          setUser(newUser);
          localStorage.setItem("user", JSON.stringify(newUser));
          setIsLoading(false);
          resolve();
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

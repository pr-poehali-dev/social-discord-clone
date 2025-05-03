
import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  tag: string;
  status: "online" | "idle" | "dnd" | "offline";
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Проверяем, есть ли сохраненный пользователь при загрузке
  useState(() => {
    const savedUser = localStorage.getItem("discord_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  });

  const login = async (email: string, password: string) => {
    // В реальном приложении здесь был бы API-запрос к серверу
    // Имитируем успешный вход
    const mockUser: User = {
      id: "1",
      username: "user" + Math.floor(Math.random() * 1000),
      email,
      avatar: `https://images.unsplash.com/photo-${1570295999919 + Math.floor(Math.random() * 10000)}?w=100&q=80`,
      tag: "#" + Math.floor(Math.random() * 10000),
      status: "online"
    };
    
    setUser(mockUser);
    localStorage.setItem("discord_user", JSON.stringify(mockUser));
  };

  const register = async (username: string, email: string, password: string) => {
    // В реальном приложении здесь был бы API-запрос к серверу
    // Имитируем успешную регистрацию
    const mockUser: User = {
      id: "1",
      username,
      email,
      avatar: `https://images.unsplash.com/photo-${1570295999919 + Math.floor(Math.random() * 10000)}?w=100&q=80`,
      tag: "#" + Math.floor(Math.random() * 10000),
      status: "online"
    };
    
    setUser(mockUser);
    localStorage.setItem("discord_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("discord_user");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

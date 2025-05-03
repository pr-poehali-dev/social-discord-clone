
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  nitro: boolean;
  createdAt: string;
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверка локального хранилища
    const savedUser = localStorage.getItem("discord_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Создание фейкового пользователя
    const userData: User = {
      id: "current_user",
      username: email.split("@")[0],
      email,
      avatar: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100`,
      nitro: false,
      createdAt: new Date().toISOString(),
    };
    
    // Сохранение пользователя
    setUser(userData);
    localStorage.setItem("discord_user", JSON.stringify(userData));
    setIsLoading(false);
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Создание фейкового пользователя
    const userData: User = {
      id: "current_user",
      username,
      email,
      avatar: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100`,
      nitro: false,
      createdAt: new Date().toISOString(),
    };
    
    // Сохранение пользователя
    setUser(userData);
    localStorage.setItem("discord_user", JSON.stringify(userData));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("discord_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

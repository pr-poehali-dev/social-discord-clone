
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    const newErrors: {
      email?: string;
      password?: string;
      general?: string;
    } = {};
    
    if (!email.trim()) {
      newErrors.email = "Введите адрес электронной почты";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Введите корректный адрес электронной почты";
    }
    
    if (!password) {
      newErrors.password = "Введите пароль";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/channels/@me");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось войти. Проверьте логин и пароль.",
        variant: "destructive"
      });
      setErrors({ 
        general: "Не удалось войти. Проверьте логин и пароль." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-discord-bg">
      <div className="bg-discord-channel p-8 rounded-md w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl font-bold">С возвращением!</h1>
          <p className="text-discord-text mt-1">Рады видеть вас снова!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 bg-red-500/20 rounded-md text-red-200 text-sm">
              {errors.general}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-discord-text uppercase block">
              Адрес электронной почты
            </label>
            <Input
              type="email"
              className={`bg-discord-sidebar border-none text-white ${
                errors.email ? "focus-visible:ring-red-500" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mail@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-discord-text uppercase block">
              Пароль
            </label>
            <Input
              type="password"
              className={`bg-discord-sidebar border-none text-white ${
                errors.password ? "focus-visible:ring-red-500" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password}</p>
            )}
          </div>
          
          <div>
            <a href="#" className="text-[#5865F2] text-sm hover:underline">
              Забыли пароль?
            </a>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#5865F2] hover:bg-[#4752c4] font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Вход..." : "Войти"}
          </Button>
          
          <div className="text-sm text-discord-text">
            Нужен аккаунт?{" "}
            <Link to="/register" className="text-[#5865F2] hover:underline">
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

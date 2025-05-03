
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    const newErrors: {
      email?: string;
      username?: string;
      password?: string;
      confirmPassword?: string;
      general?: string;
    } = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Введите адрес электронной почты";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введите корректный адрес электронной почты";
    }
    
    if (!formData.username.trim()) {
      newErrors.username = "Введите имя пользователя";
    } else if (formData.username.length < 2 || formData.username.length > 32) {
      newErrors.username = "Имя пользователя должно быть от 2 до 32 символов";
    }
    
    if (!formData.password) {
      newErrors.password = "Введите пароль";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/channels/@me");
      
      toast({
        title: "Регистрация успешна",
        description: "Добро пожаловать в Discord!",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось зарегистрироваться. Попробуйте еще раз.",
        variant: "destructive"
      });
      setErrors({ 
        general: "Не удалось зарегистрироваться. Попробуйте еще раз." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-discord-bg">
      <div className="bg-discord-channel p-8 rounded-md w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl font-bold">Создать аккаунт</h1>
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
              name="email"
              className={`bg-discord-sidebar border-none text-white ${
                errors.email ? "focus-visible:ring-red-500" : ""
              }`}
              value={formData.email}
              onChange={handleChange}
              placeholder="mail@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-discord-text uppercase block">
              Имя пользователя
            </label>
            <Input
              type="text"
              name="username"
              className={`bg-discord-sidebar border-none text-white ${
                errors.username ? "focus-visible:ring-red-500" : ""
              }`}
              value={formData.username}
              onChange={handleChange}
              placeholder="Ваше имя пользователя"
            />
            {errors.username && (
              <p className="text-red-400 text-xs">{errors.username}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-discord-text uppercase block">
              Пароль
            </label>
            <Input
              type="password"
              name="password"
              className={`bg-discord-sidebar border-none text-white ${
                errors.password ? "focus-visible:ring-red-500" : ""
              }`}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-discord-text uppercase block">
              Подтвердите пароль
            </label>
            <Input
              type="password"
              name="confirmPassword"
              className={`bg-discord-sidebar border-none text-white ${
                errors.confirmPassword ? "focus-visible:ring-red-500" : ""
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs">{errors.confirmPassword}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#5865F2] hover:bg-[#4752c4] font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
          
          <div className="text-sm text-discord-text">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="text-[#5865F2] hover:underline">
              Войти
            </Link>
          </div>
          
          <div className="text-xs text-discord-text mt-4">
            Регистрируясь, вы соглашаетесь с условиями использования и политикой конфиденциальности Discord.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

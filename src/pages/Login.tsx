
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/channels/@me");
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Неверный email или пароль",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#5865F2]">
      <div className="w-full max-w-md space-y-8 rounded-md bg-discord-bg p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">С возвращением!</h1>
          <p className="mt-2 text-sm text-discord-text">Мы так рады видеть вас снова!</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase text-discord-text">
              Email или номер телефона
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-discord-sidebar border-discord-hover text-discord-text"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password" className="text-xs uppercase text-discord-text">
                Пароль
              </Label>
              <Link to="/forgot-password" className="text-xs text-[#00a8fc] hover:underline">
                Забыли пароль?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-discord-sidebar border-discord-hover text-discord-text"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5865F2] text-white hover:bg-[#4752c4]"
          >
            {isLoading ? "Вход..." : "Войти"}
          </Button>

          <div className="text-sm text-discord-text">
            Нужна учетная запись?{" "}
            <Link to="/register" className="text-[#00a8fc] hover:underline">
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

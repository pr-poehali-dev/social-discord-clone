
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(username, email, password);
      navigate("/channels/@me");
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: "Не удалось создать учетную запись",
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Создать учетную запись</h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase text-discord-text">
              Email
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
            <Label htmlFor="username" className="text-xs uppercase text-discord-text">
              Имя пользователя
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-discord-sidebar border-discord-hover text-discord-text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase text-discord-text">
              Пароль
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-discord-sidebar border-discord-hover text-discord-text"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-[#5865F2]"
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-discord-text">
                Я согласен с{" "}
                <Link to="/terms" className="text-[#00a8fc] hover:underline">
                  Условиями использования
                </Link>{" "}
                и{" "}
                <Link to="/privacy" className="text-[#00a8fc] hover:underline">
                  Политикой конфиденциальности
                </Link>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5865F2] text-white hover:bg-[#4752c4]"
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>

          <div className="text-sm text-discord-text">
            <Link to="/login" className="text-[#00a8fc] hover:underline">
              Уже есть аккаунт?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

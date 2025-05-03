
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, Sparkles, XIcon, Users, Upload, Camera, Package, Gift, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";

const NitroPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleNitro } = useData();
  const [isActivating, setIsActivating] = useState(false);

  const handleToggleNitro = async () => {
    setIsActivating(true);
    
    // Имитация задержки запроса
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toggleNitro();
    setIsActivating(false);
  };

  return (
    <div className="bg-discord-bg min-h-screen">
      <header className="bg-discord-sidebar py-4 px-6 flex items-center">
        <Button 
          variant="ghost" 
          className="text-white"
          onClick={() => navigate(-1)}
        >
          <XIcon className="h-5 w-5 mr-2" />
          Назад
        </Button>
        <h1 className="text-white text-xl font-bold ml-4 flex items-center">
          <Sparkles className="h-5 w-5 text-[#5865F2] mr-2" />
          Discord Nitro
        </h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Баннер */}
        <div className="bg-gradient-to-r from-[#5865F2] to-[#7289da] rounded-lg p-8 mb-12 text-center text-white">
          <div className="flex justify-center mb-4">
            <Sparkles className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Discord Nitro</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            {user?.nitro 
              ? "У вас уже есть Discord Nitro! Наслаждайтесь всеми премиум-возможностями." 
              : "Разблокируйте премиум-функции и поддержите Discord. Успейте оформить бесплатную подписку!"}
          </p>
          <Button 
            size="lg" 
            className={`px-8 py-6 text-lg ${user?.nitro ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-[#5865F2] hover:bg-gray-100'}`}
            onClick={handleToggleNitro}
            disabled={isActivating}
          >
            {isActivating 
              ? "Обработка..." 
              : user?.nitro 
                ? "Отменить подписку" 
                : "Активировать бесплатно"}
          </Button>
        </div>

        {/* Преимущества */}
        <h3 className="text-2xl font-bold text-white mb-8">Преимущества Nitro</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-discord-channel border-none text-white">
            <CardHeader>
              <Upload className="h-8 w-8 text-[#5865F2] mb-2" />
              <CardTitle>Загрузка больших файлов</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-discord-text">
                Загружайте файлы размером до 500 МБ вместо стандартных 8 МБ.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-discord-channel border-none text-white">
            <CardHeader>
              <Camera className="h-8 w-8 text-[#5865F2] mb-2" />
              <CardTitle>HD-трансляция</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-discord-text">
                Транслируйте в высоком качестве с разрешением 4K и частотой 60 кадров в секунду.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-discord-channel border-none text-white">
            <CardHeader>
              <Users className="h-8 w-8 text-[#5865F2] mb-2" />
              <CardTitle>Больше серверов</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-discord-text">
                Присоединяйтесь к 200 серверам вместо стандартных 100.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-discord-channel border-none text-white">
            <CardHeader>
              <Package className="h-8 w-8 text-[#5865F2] mb-2" />
              <CardTitle>Уникальные профили</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-discord-text">
                Создавайте уникальные профили с анимированным аватаром и баннером.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-discord-channel border-none text-white">
            <CardHeader>
              <Gift className="h-8 w-8 text-[#5865F2] mb-2" />
              <CardTitle>Серверный буст</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-discord-text">
                Получите 2 бесплатных буста сервера каждый месяц.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-discord-channel border-none text-white">
            <CardHeader>
              <Star className="h-8 w-8 text-[#5865F2] mb-2" />
              <CardTitle>Эксклюзивные эмодзи</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-discord-text">
                Используйте эмодзи с любого сервера везде, где захотите.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Таблица сравнения */}
        <h3 className="text-2xl font-bold text-white mb-8">Сравнение планов</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white mb-12">
            <thead className="border-b border-discord-hover">
              <tr>
                <th className="py-4 px-6">Функции</th>
                <th className="py-4 px-6">Базовый план</th>
                <th className="py-4 px-6 text-[#5865F2]">Discord Nitro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-discord-hover">
              <tr>
                <td className="py-4 px-6">Размер загружаемых файлов</td>
                <td className="py-4 px-6">8 МБ</td>
                <td className="py-4 px-6">500 МБ <CheckIcon className="inline h-4 w-4 text-green-500 ml-2" /></td>
              </tr>
              <tr>
                <td className="py-4 px-6">Качество стриминга</td>
                <td className="py-4 px-6">720p 30FPS</td>
                <td className="py-4 px-6">4K 60FPS <CheckIcon className="inline h-4 w-4 text-green-500 ml-2" /></td>
              </tr>
              <tr>
                <td className="py-4 px-6">Количество серверов</td>
                <td className="py-4 px-6">100</td>
                <td className="py-4 px-6">200 <CheckIcon className="inline h-4 w-4 text-green-500 ml-2" /></td>
              </tr>
              <tr>
                <td className="py-4 px-6">Уникальный тег</td>
                <td className="py-4 px-6">Нет</td>
                <td className="py-4 px-6">Да <CheckIcon className="inline h-4 w-4 text-green-500 ml-2" /></td>
              </tr>
              <tr>
                <td className="py-4 px-6">Анимированный аватар</td>
                <td className="py-4 px-6">Нет</td>
                <td className="py-4 px-6">Да <CheckIcon className="inline h-4 w-4 text-green-500 ml-2" /></td>
              </tr>
              <tr>
                <td className="py-4 px-6">Глобальные эмодзи</td>
                <td className="py-4 px-6">Нет</td>
                <td className="py-4 px-6">Да <CheckIcon className="inline h-4 w-4 text-green-500 ml-2" /></td>
              </tr>
              <tr>
                <td className="py-4 px-6">Серверные бусты</td>
                <td className="py-4 px-6">0</td>
                <td className="py-4 px-6">2 <CheckIcon className="inline h-4 w-4 text-green-500 ml-2" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h4 className="text-xl font-bold text-white mb-4">Улучшите свой Discord уже сегодня!</h4>
          <Button 
            size="lg" 
            className={`px-8 py-6 text-lg ${user?.nitro ? 'bg-red-500 hover:bg-red-600' : 'bg-[#5865F2] hover:bg-[#4752c4]'}`}
            onClick={handleToggleNitro}
            disabled={isActivating}
          >
            {isActivating 
              ? "Обработка..." 
              : user?.nitro 
                ? "Отменить подписку" 
                : "Активировать бесплатно"}
          </Button>
          <p className="text-discord-text mt-4">
            Акция действует до 2025-06-01. Доступно для пользователей в России.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NitroPage;


import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/channels/@me");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-discord-bg">
      {/* Hero Section */}
      <header className="bg-[#404EED] py-6">
        <nav className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-white text-2xl font-bold">
            DISCORD
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="#" className="text-white hover:underline">Загрузить</Link>
            <Link to="#" className="text-white hover:underline">Nitro</Link>
            <Link to="#" className="text-white hover:underline">Поддержка</Link>
          </div>
          <div>
            <Button 
              variant="secondary" 
              className="bg-white text-black hover:bg-gray-100 rounded-full"
              onClick={() => navigate("/login")}
            >
              Войти
            </Button>
          </div>
        </nav>
        
        <div className="container mx-auto px-4 pt-20 pb-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            ПРЕДСТАВЬ СЕБЕ МЕСТО...
          </h1>
          <p className="text-white text-lg md:text-xl max-w-3xl mx-auto mb-8">
            ...где можно вместе с друзьями быть частью школьного клуба, игровой группы или мирового сообщества.
            Место, где можно просто тусоваться и проводить время вместе.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button className="bg-white text-black hover:bg-gray-100 text-lg py-6 px-8">
              Загрузить для Windows
            </Button>
            <Button 
              variant="secondary" 
              className="bg-[#23272A] text-white hover:bg-gray-800 text-lg py-6 px-8"
              onClick={() => navigate("/register")}
            >
              Открыть Discord в браузере
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&q=80" 
                alt="Общение в дискорде" 
                className="rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Создавай места для общения по интересам</h2>
              <p className="text-lg text-gray-700">
                Discord-серверы организованы по тематическим каналам, где можно сотрудничать, делиться информацией и просто разговаривать о своём дне, не переполняя групповой чат.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80" 
                alt="Голосовые каналы" 
                className="rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Где можно легко общаться</h2>
              <p className="text-lg text-gray-700">
                Заходи в голосовой канал, когда у тебя есть время. Друзья на твоём сервере увидят, что ты в сети, и сразу смогут присоединиться к разговору без необходимости звонить.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80" 
                alt="Сообщества" 
                className="rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">От нескольких друзей до целого сообщества</h2>
              <p className="text-lg text-gray-700">
                Настрой сервер, добавив инструменты для модерации и пользовательские права доступа к каналам. Дай участникам особые возможности, создавай приватные каналы и многое другое.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-[#404EED] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Готов начать своё путешествие?</h2>
          <Button 
            className="bg-white text-[#404EED] hover:bg-gray-100 text-lg py-6 px-8"
            onClick={() => navigate("/register")}
          >
            Зарегистрируйся сейчас
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#23272A] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-[#5865F2] font-bold text-2xl mb-4">DISCORD</h3>
              <div className="space-y-2">
                <Link to="#" className="block hover:underline">Загрузить</Link>
                <Link to="#" className="block hover:underline">Nitro</Link>
                <Link to="#" className="block hover:underline">Статус</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-[#5865F2] font-bold mb-4">Компания</h3>
              <div className="space-y-2">
                <Link to="#" className="block hover:underline">О нас</Link>
                <Link to="#" className="block hover:underline">Работа</Link>
                <Link to="#" className="block hover:underline">Блог</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-[#5865F2] font-bold mb-4">Ресурсы</h3>
              <div className="space-y-2">
                <Link to="#" className="block hover:underline">Поддержка</Link>
                <Link to="#" className="block hover:underline">Безопасность</Link>
                <Link to="#" className="block hover:underline">Сообщество</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-[#5865F2] font-bold mb-4">Политики</h3>
              <div className="space-y-2">
                <Link to="#" className="block hover:underline">Условия</Link>
                <Link to="#" className="block hover:underline">Конфиденциальность</Link>
                <Link to="#" className="block hover:underline">Настройки файлов cookie</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex justify-between items-center">
            <div className="text-2xl font-bold">
              DISCORD
            </div>
            <Button 
              className="bg-[#5865F2] hover:bg-[#4752c4]"
              onClick={() => navigate("/register")}
            >
              Зарегистрироваться
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

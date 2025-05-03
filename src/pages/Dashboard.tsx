
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Compass, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ServerIcon from "@/components/ServerIcon";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [createServerOpen, setCreateServerOpen] = useState(false);
  const [serverName, setServerName] = useState("");
  const [servers, setServers] = useState([
    { id: "1", name: "Главный сервер", icon: "" },
    { id: "2", name: "Игры", icon: "" },
    { id: "3", name: "Программирование", icon: "" }
  ]);

  useEffect(() => {
    // В реальном приложении здесь был бы запрос на получение серверов
  }, []);

  const handleCreateServer = () => {
    if (serverName.trim() === "") {
      toast({
        title: "Ошибка",
        description: "Введите название сервера",
        variant: "destructive"
      });
      return;
    }

    // Создаем новый сервер
    const newServer = {
      id: `${servers.length + 1}`,
      name: serverName,
      icon: ""
    };

    setServers([...servers, newServer]);
    setCreateServerOpen(false);
    setServerName("");

    toast({
      title: "Сервер создан",
      description: `Сервер "${serverName}" успешно создан`,
    });

    // Переход на новый сервер
    navigate(`/channels/${newServer.id}`);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-discord-bg">
        {/* Servers sidebar */}
        <Sidebar collapsible="icon" className="w-[72px] bg-discord-sidebar border-0">
          <SidebarContent className="py-2 px-2 gap-3">
            <ServerIcon 
              isHome 
              active={location.pathname.includes('@me')} 
              onClick={() => navigate("/channels/@me")} 
            />
            <Separator className="mx-2 bg-discord-hover/30" />
            
            {servers.map(server => (
              <ServerIcon 
                key={server.id} 
                name={server.name} 
                icon={server.icon} 
                active={location.pathname.includes(`/channels/${server.id}`)} 
                onClick={() => navigate(`/channels/${server.id}`)} 
              />
            ))}
            
            <ServerIcon 
              isAdd 
              onClick={() => setCreateServerOpen(true)} 
            />

            <Separator className="mx-2 bg-discord-hover/30" />

            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-discord-channel hover:rounded-2xl hover:bg-discord-active text-discord-active hover:text-white transition-all cursor-pointer mb-2" title="Открыть поиск серверов">
              <Compass className="w-5 h-5" />
            </div>

            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-discord-channel hover:rounded-2xl hover:bg-[#3ba55c] text-[#3ba55c] hover:text-white transition-all cursor-pointer mb-2" title="Загрузить приложение">
              <Download className="w-5 h-5" />
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Create Server Dialog */}
        <Dialog open={createServerOpen} onOpenChange={setCreateServerOpen}>
          <DialogContent className="bg-discord-bg text-discord-text border-none max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white text-center text-2xl font-bold">
                Настроить сервер
              </DialogTitle>
              <DialogDescription className="text-center">
                Создайте сервер для ваших друзей и сообществ. Вы будете его владельцем.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-discord-hover flex items-center justify-center cursor-pointer hover:bg-discord-sidebar">
                  <Plus className="w-8 h-8 text-discord-text" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="server-name" className="text-xs font-semibold text-discord-text">
                  НАЗВАНИЕ СЕРВЕРА
                </Label>
                <Input
                  id="server-name"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder={`Сервер ${user?.username || 'пользователя'}`}
                  className="bg-discord-sidebar border-discord-hover text-white"
                />
              </div>

              <div className="text-sm">
                Создавая сервер, вы соглашаетесь с {" "}
                <a href="#" className="text-[#00a8fc] hover:underline">
                  Правилами сообщества Discord
                </a>
              </div>
            </div>

            <DialogFooter className="flex">
              <Button
                variant="outline"
                onClick={() => setCreateServerOpen(false)}
                className="border-0 text-discord-text"
              >
                Отмена
              </Button>
              <Button onClick={handleCreateServer} className="bg-[#5865F2] hover:bg-[#4752c4]">
                Создать
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Main content - Select a server prompt */}
        <div className="flex-1 flex items-center justify-center flex-col p-6 text-center">
          <img 
            src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=200" 
            alt="Discord" 
            className="w-24 h-24 mb-6 rounded-full"
          />
          <h1 className="text-2xl font-bold text-white mb-2">Добро пожаловать, {user?.username || 'пользователь'}!</h1>
          <p className="text-discord-text mb-6 max-w-md">
            Это ваша личная страница Discord. Выберите сервер слева, чтобы начать общение, или создайте новый.
          </p>
          <Button 
            className="bg-[#5865F2] hover:bg-[#4752c4] text-white"
            onClick={() => setCreateServerOpen(true)}
          >
            Создать сервер
          </Button>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

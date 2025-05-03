
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Settings, Sparkles, Plus, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/use-toast";
import ServerIcon from "@/components/ServerIcon";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { servers, createServer } = useData();
  
  const [createServerOpen, setCreateServerOpen] = useState(false);
  const [serverName, setServerName] = useState("");
  const [isCreatingServer, setIsCreatingServer] = useState(false);
  
  const handleCreateServer = async () => {
    if (!serverName.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название сервера",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreatingServer(true);
    
    try {
      const newServer = await createServer(serverName);
      setCreateServerOpen(false);
      setServerName("");
      
      toast({
        title: "Сервер создан",
        description: `Сервер "${serverName}" успешно создан`,
      });
      
      // Переход на новый сервер
      navigate(`/channels/${newServer.id}/${newServer.channels[0].id}`);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать сервер",
        variant: "destructive"
      });
    } finally {
      setIsCreatingServer(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-discord-bg">
        {/* Servers sidebar */}
        <Sidebar collapsible="icon" className="w-[72px] bg-discord-sidebar border-0">
          <SidebarContent className="py-2 px-2 gap-3">
            <Server

Icon 
              isHome
              onClick={() => navigate("/channels/@me")} 
            />
            <Separator className="mx-2 bg-discord-hover/30" />
            
            {servers.map(server => (
              <ServerIcon 
                key={server.id} 
                name={server.name}
                icon={server.icon}
                onClick={() => navigate(`/channels/${server.id}`)} 
              />
            ))}
            
            <ServerIcon 
              isAdd
              onClick={() => setCreateServerOpen(true)} 
            />
          </SidebarContent>
        </Sidebar>
        
        {/* Main content */}
        <SidebarInset className="bg-discord-bg flex flex-col items-center justify-center">
          <div className="max-w-2xl w-full p-8">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-3">Добро пожаловать в Discord</h1>
              <p className="text-discord-text">
                Давайте начнем общение в вашем личном Discord-пространстве!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button 
                className="flex flex-col items-center gap-4 h-48 bg-discord-channel hover:bg-discord-hover border-none"
                onClick={() => navigate("/channels/@me")}
              >
                <Home className="h-16 w-16 text-[#5865F2]" />
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white">Личные сообщения</h3>
                  <p className="text-sm text-discord-text">Общайтесь с друзьями напрямую</p>
                </div>
              </Button>
              
              <Button 
                className="flex flex-col items-center gap-4 h-48 bg-discord-channel hover:bg-discord-hover border-none"
                onClick={() => setCreateServerOpen(true)}
              >
                <Plus className="h-16 w-16 text-[#5865F2]" />
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white">Создать сервер</h3>
                  <p className="text-sm text-discord-text">Создайте новое сообщество</p>
                </div>
              </Button>
              
              <Button 
                className="flex flex-col items-center gap-4 h-48 bg-discord-channel hover:bg-discord-hover border-none"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-16 w-16 text-[#5865F2]" />
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white">Настройки</h3>
                  <p className="text-sm text-discord-text">Настройте Discord под себя</p>
                </div>
              </Button>
              
              <Button 
                className="flex flex-col items-center gap-4 h-48 bg-discord-channel hover:bg-discord-hover border-none"
                onClick={() => navigate("/nitro")}
              >
                <Sparkles className="h-16 w-16 text-[#5865F2]" />
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white">Discord Nitro</h3>
                  <p className="text-sm text-discord-text">Получите расширенные возможности</p>
                </div>
              </Button>
            </div>
            
            <div className="mt-10">
              <Button
                className="w-full py-6 text-lg bg-[#5865F2] hover:bg-[#4752c4]"
                onClick={() => navigate("/channels/@me")}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Начните общение
              </Button>
            </div>
          </div>
        </SidebarInset>
        
        {/* Create Server Dialog */}
        <Dialog open={createServerOpen} onOpenChange={setCreateServerOpen}>
          <DialogContent className="bg-discord-bg text-discord-text border-none">
            <DialogHeader>
              <DialogTitle className="text-white text-center">Создание сервера</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex justify-center mb-2">
                <Avatar className="h-20 w-20">
                  <AvatarFallback>{serverName ? serverName[0] : "D"}</AvatarFallback>
                </Avatar>
              </div>
              
              <div>
                <label className="text-xs uppercase text-discord-text block mb-2">НАЗВАНИЕ СЕРВЕРА</label>
                <Input
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="Придумайте название для сервера"
                  className="bg-discord-sidebar border-discord-hover text-white"
                />
                <p className="text-xs text-discord-text/70 mt-1">
                  Вы всегда сможете изменить это позже.
                </p>
              </div>
            </div>
            
            <DialogFooter className="flex-col space-y-2 sm:space-y-0">
              <Button 
                className="w-full bg-[#5865F2] hover:bg-[#4752c4]"
                disabled={isCreatingServer || !serverName.trim()}
                onClick={handleCreateServer}
              >
                {isCreatingServer ? "Создание..." : "Создать сервер"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;


import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hash, Users, Plus, Settings, PaperclipIcon, Smile, Send, MoreVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import ChatMessage from "@/components/ChatMessage";
import ServerIcon from "@/components/ServerIcon";
import UserStatus from "@/components/UserStatus";
import { Link } from "react-router-dom";

const ServerView = () => {
  const { serverId, channelId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');

  // Имитация данных сервера
  const [server] = useState({
    id: serverId,
    name: serverId === "1" ? "Главный сервер" 
          : serverId === "2" ? "Игры" 
          : serverId === "3" ? "Программирование" 
          : "Сервер",
    icon: "",
    owner: "1" // ID владельца сервера
  });

  // Имитация списка каналов
  const [textChannels, setTextChannels] = useState([
    { id: "1", name: "общий", type: "text" },
    { id: "2", name: "помощь", type: "text" },
    { id: "3", name: "идеи", type: "text" }
  ]);

  const [voiceChannels, setVoiceChannels] = useState([
    { id: "4", name: "Основной", type: "voice" },
    { id: "5", name: "Игры", type: "voice" }
  ]);

  // Имитация списка пользователей на сервере
  const [members] = useState([
    { id: "1", username: "Администратор", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", status: "online", role: "admin" },
    { id: "2", username: "Модератор", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80", status: "online", role: "mod" },
    { id: "3", username: "Разработчик", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80", status: "idle", role: "member" },
    { id: "4", username: "Дизайнер", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80", status: "offline", role: "member" },
    ...(user ? [{ id: "user", username: user.username, avatar: user.avatar, status: "online", role: "member" }] : [])
  ]);

  // Выбранный канал
  const allChannels = [...textChannels, ...voiceChannels];
  const selectedChannel = channelId 
    ? allChannels.find(c => c.id === channelId) 
    : textChannels[0];

  // Имитация сообщений в канале
  const [messages] = useState([
    {
      id: "1",
      user: "Администратор",
      time: "Сегодня в 12:30",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      message: `Добро пожаловать на сервер ${server.name}! 👋`
    },
    {
      id: "2",
      user: "Модератор",
      time: "Сегодня в 12:35",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
      message: "Пожалуйста, ознакомьтесь с правилами сервера в канале #правила"
    },
    {
      id: "3",
      user: "Разработчик",
      time: "Сегодня в 12:40",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
      message: "Если у вас есть вопросы по разработке, задавайте их в канале #помощь"
    }
  ]);

  // Список серверов пользователя
  const [servers] = useState([
    { id: "1", name: "Главный сервер", icon: "" },
    { id: "2", name: "Игры", icon: "" },
    { id: "3", name: "Программирование", icon: "" }
  ]);

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    
    toast({
      title: "Сообщение отправлено",
      description: "Ваше сообщение успешно отправлено",
    });
    
    setMessage("");
  };

  const handleCreateChannel = () => {
    if (channelName.trim() === "") {
      toast({
        title: "Ошибка",
        description: "Введите название канала",
        variant: "destructive"
      });
      return;
    }

    // Создаем новый канал
    const newChannel = {
      id: `${Date.now()}`,
      name: channelName.toLowerCase().replace(/\s+/g, '-'),
      type: channelType
    };

    if (channelType === 'text') {
      setTextChannels([...textChannels, newChannel]);
    } else {
      setVoiceChannels([...voiceChannels, newChannel]);
    }

    setCreateChannelOpen(false);
    setChannelName("");
    setChannelType('text');

    toast({
      title: "Канал создан",
      description: `Канал "${channelName}" успешно создан`,
    });

    // Переход на новый канал
    if (channelType === 'text') {
      navigate(`/channels/${serverId}/${newChannel.id}`);
    }
  };

  const isTextChannel = selectedChannel?.type === 'text';

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-discord-bg">
        {/* Servers sidebar */}
        <Sidebar collapsible="icon" className="w-[72px] bg-discord-sidebar border-0">
          <SidebarContent className="py-2 px-2 gap-3">
            <ServerIcon 
              isHome 
              onClick={() => navigate("/channels/@me")} 
            />
            <Separator className="mx-2 bg-discord-hover/30" />
            
            {servers.map(s => (
              <ServerIcon 
                key={s.id} 
                name={s.name} 
                icon={s.icon} 
                active={s.id === serverId}
                onClick={() => navigate(`/channels/${s.id}`)} 
              />
            ))}
            
            <ServerIcon 
              isAdd 
              onClick={() => navigate("/channels")} 
            />
          </SidebarContent>
        </Sidebar>

        {/* Channels sidebar */}
        <div className="w-60 min-w-60 bg-discord-channel flex flex-col">
          <div className="p-4 shadow-sm flex justify-between items-center">
            <h2 className="font-bold text-white truncate">{server.name}</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-discord-text hover:bg-discord-hover">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-discord-sidebar text-discord-text border-none">
                <DropdownMenuItem className="hover:bg-discord-hover hover:text-white cursor-pointer">
                  Приглашение
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-discord-hover hover:text-white cursor-pointer">
                  Настройки сервера
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-discord-hover hover:text-white cursor-pointer">
                  Создать канал
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-discord-hover hover:text-white cursor-pointer text-red-500">
                  Покинуть сервер
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              <div className="flex items-center justify-between text-discord-text/70 text-xs font-semibold px-2 py-1">
                <span>ТЕКСТОВЫЕ КАНАЛЫ</span>
                {user?.id === server.owner && (
                  <Plus 
                    className="h-4 w-4 cursor-pointer hover:text-discord-text" 
                    onClick={() => {
                      setChannelType('text');
                      setCreateChannelOpen(true);
                    }}
                  />
                )}
              </div>
              
              <div className="space-y-1 mt-1">
                {textChannels.map(channel => (
                  <Link 
                    key={channel.id}
                    to={`/channels/${serverId}/${channel.id}`} 
                    className={`flex items-center gap-2 px-2 py-1 rounded ${
                      channel.id === channelId ? "bg-discord-hover text-discord-text" : "text-discord-text/70 hover:text-discord-text hover:bg-discord-hover"
                    }`}
                  >
                    <Hash className="h-5 w-5" />
                    <span className="text-sm">{channel.name}</span>
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-discord-text/70 text-xs font-semibold px-2 py-1 mt-4">
                <span>ГОЛОСОВЫЕ КАНАЛЫ</span>
                {user?.id === server.owner && (
                  <Plus 
                    className="h-4 w-4 cursor-pointer hover:text-discord-text" 
                    onClick={() => {
                      setChannelType('voice');
                      setCreateChannelOpen(true);
                    }}
                  />
                )}
              </div>
              
              <div className="space-y-1 mt-1">
                {voiceChannels.map(channel => (
                  <Link 
                    key={channel.id}
                    to={`/channels/${serverId}/${channel.id}`} 
                    className={`flex items-center gap-2 px-2 py-1 rounded ${
                      channel.id === channelId ? "bg-discord-hover text-discord-text" : "text-discord-text/70 hover:text-discord-text hover:bg-discord-hover"
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-sm">{channel.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollArea>
          
          {/* User profile */}
          <div className="bg-discord-sidebar/80 p-2 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100"} />
              <AvatarFallback>{user?.username?.[0] || "Ю"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.username || "Пользователь"}</div>
              <UserStatus status="online" />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-discord-text hover:bg-discord-hover">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <SidebarInset className="bg-discord-bg flex flex-col">
          {/* Channel header */}
          <div className="h-12 border-b border-discord-sidebar flex items-center px-4">
            <div className="flex items-center gap-2">
              {isTextChannel ? (
                <Hash className="h-6 w-6 text-discord-text/70" />
              ) : (
                <Users className="h-6 w-6 text-discord-text/70" />
              )}
              <h3 className="font-bold text-white">{selectedChannel?.name}</h3>
            </div>
          </div>
          
          {isTextChannel ? (
            <>
              {/* Chat messages */}
              <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-5">
                  {messages.map((msg) => (
                    <ChatMessage 
                      key={msg.id}
                      user={msg.user} 
                      time={msg.time} 
                      avatar={msg.avatar} 
                      message={msg.message}
                    />
                  ))}
                </div>
              </ScrollArea>
              
              {/* Message input */}
              <div className="p-4 mx-4 mb-4 bg-discord-hover rounded-md">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Plus className="w-5 h-5 text-discord-text" />
                  </div>
                  <input 
                    type="text" 
                    placeholder={`Написать в #${selectedChannel?.name}`}
                    className="w-full bg-transparent py-2.5 px-10 text-discord-text focus:outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === '

Enter') handleSendMessage();
                    }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <Smile className="w-5 h-5 text-discord-text cursor-pointer" />
                    <PaperclipIcon className="w-5 h-5 text-discord-text cursor-pointer" />
                    <Send 
                      className={`w-5 h-5 ${message.trim() ? 'text-[#5865F2] cursor-pointer' : 'text-discord-text/50'}`}
                      onClick={handleSendMessage}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col">
              <Users className="h-16 w-16 text-discord-text/50 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Голосовой канал</h2>
              <p className="text-discord-text text-center max-w-md">
                Это голосовой канал. Чтобы присоединиться к разговору, вам нужно установить 
                приложение Discord на компьютер.
              </p>
              <Button className="mt-6 bg-[#5865F2] hover:bg-[#4752c4]">
                Присоединиться к голосовому каналу
              </Button>
            </div>
          )}

          {/* Create Channel Dialog */}
          <Dialog open={createChannelOpen} onOpenChange={setCreateChannelOpen}>
            <DialogContent className="bg-discord-bg text-discord-text border-none">
              <DialogHeader>
                <DialogTitle className="text-white">Создать канал</DialogTitle>
                <DialogDescription>
                  Создайте новый канал на вашем сервере.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="channel-type" className="text-xs uppercase text-discord-text">
                    ТИП КАНАЛА
                  </Label>
                  <div className="flex gap-4">
                    <div
                      className={`p-3 rounded border cursor-pointer flex items-center gap-2 ${
                        channelType === 'text' 
                          ? 'bg-discord-hover border-[#5865F2]' 
                          : 'bg-discord-sidebar border-discord-hover'
                      }`}
                      onClick={() => setChannelType('text')}
                    >
                      <Hash className="h-5 w-5" />
                      <span>Текстовый</span>
                    </div>
                    <div
                      className={`p-3 rounded border cursor-pointer flex items-center gap-2 ${
                        channelType === 'voice' 
                          ? 'bg-discord-hover border-[#5865F2]' 
                          : 'bg-discord-sidebar border-discord-hover'
                      }`}
                      onClick={() => setChannelType('voice')}
                    >
                      <Users className="h-5 w-5" />
                      <span>Голосовой</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channel-name" className="text-xs uppercase text-discord-text">
                    НАЗВАНИЕ КАНАЛА
                  </Label>
                  <div className="relative">
                    {channelType === 'text' && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Hash className="h-5 w-5 text-discord-text/50" />
                      </div>
                    )}
                    {channelType === 'voice' && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Users className="h-5 w-5 text-discord-text/50" />
                      </div>
                    )}
                    <Input
                      id="channel-name"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder={channelType === 'text' ? "new-channel" : "Новый канал"}
                      className={`bg-discord-sidebar border-discord-hover text-white ${
                        channelType === 'text' ? 'pl-10' : 'pl-10'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCreateChannelOpen(false)}
                  className="border-0 text-discord-text"
                >
                  Отмена
                </Button>
                <Button onClick={handleCreateChannel} className="bg-[#5865F2] hover:bg-[#4752c4]">
                  Создать
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SidebarInset>
        
        {/* Members sidebar */}
        <div className="w-60 min-w-60 bg-discord-channel p-4 overflow-y-auto hidden md:block">
          <div className="text-discord-text/70 text-xs font-semibold mb-2">
            УЧАСТНИКИ — {members.length}
          </div>
          
          <div className="space-y-1">
            {/* Администраторы */}
            {members.filter(m => m.role === 'admin').length > 0 && (
              <div className="mb-2">
                <div className="text-discord-text/70 text-xs font-semibold mb-1 mt-3">
                  АДМИНИСТРАТОРЫ
                </div>
                {members.filter(m => m.role === 'admin').map(member => (
                  <div key={member.id} className="flex items-center gap-2 text-discord-text hover:bg-discord-hover p-2 rounded">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-discord-channel ${
                        member.status === "online" ? "bg-green-500" : 
                        member.status === "idle" ? "bg-yellow-500" :
                        member.status === "dnd" ? "bg-red-500" :
                        "bg-gray-500"
                      }`}></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#f23f42]">{member.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Модераторы */}
            {members.filter(m => m.role === 'mod').length > 0 && (
              <div className="mb-2">
                <div className="text-discord-text/70 text-xs font-semibold mb-1 mt-3">
                  МОДЕРАТОРЫ
                </div>
                {members.filter(m => m.role === 'mod').map(member => (
                  <div key={member.id} className="flex items-center gap-2 text-discord-text hover:bg-discord-hover p-2 rounded">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-discord-channel ${
                        member.status === "online" ? "bg-green-500" : 
                        member.status === "idle" ? "bg-yellow-500" :
                        member.status === "dnd" ? "bg-red-500" :
                        "bg-gray-500"
                      }`}></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#26a69a]">{member.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Обычные пользователи */}
            <div>
              <div className="text-discord-text/70 text-xs font-semibold mb-1 mt-3">
                УЧАСТНИКИ
              </div>
              {members.filter(m => m.role === 'member').map(member => (
                <div key={member.id} className="flex items-center gap-2 text-discord-text hover:bg-discord-hover p-2 rounded">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-discord-channel ${
                      member.status === "online" ? "bg-green-500" : 
                      member.status === "idle" ? "bg-yellow-500" :
                      member.status === "dnd" ? "bg-red-500" :
                      "bg-gray-500"
                    }`}></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{member.username}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ServerView;


import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Settings, Users, PaperclipIcon, Smile, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import ChatMessage from "@/components/ChatMessage";
import ServerIcon from "@/components/ServerIcon";
import UserStatus from "@/components/UserStatus";

const DirectMessages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Имитация списка друзей
  const [friends] = useState([
    { id: "1", username: "Артем", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", status: "online" },
    { id: "2", username: "Мария", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", status: "idle" },
    { id: "3", username: "Алексей", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80", status: "dnd" },
    { id: "4", username: "Елена", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80", status: "offline" }
  ]);

  // Выбранный друг для чата
  const selectedFriend = friends.find(f => f.id === userId) || friends[0];

  // Имитация истории сообщений
  const messages = [
    {
      id: "1",
      user: selectedFriend.username,
      time: "Сегодня в 12:30",
      avatar: selectedFriend.avatar,
      message: "Привет! Как дела?"
    },
    {
      id: "2",
      user: user?.username || "Вы",
      time: "Сегодня в 12:35",
      avatar: user?.avatar || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100",
      message: "Привет! Все отлично, как у тебя?"
    },
    {
      id: "3",
      user: selectedFriend.username,
      time: "Сегодня в 12:40",
      avatar: selectedFriend.avatar,
      message: "Тоже хорошо! Хотел спросить, не хочешь ли присоединиться к нашему серверу по игре?"
    }
  ];

  // Список серверов
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

  const handleAddFriend = () => {
    toast({
      title: "Запрос дружбы отправлен",
      description: "Запрос дружбы успешно отправлен",
    });
  };

  const filteredFriends = searchQuery 
    ? friends.filter(f => f.username.toLowerCase().includes(searchQuery.toLowerCase())) 
    : friends;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-discord-bg">
        {/* Servers sidebar */}
        <Sidebar collapsible="icon" className="w-[72px] bg-discord-sidebar border-0">
          <SidebarContent className="py-2 px-2 gap-3">
            <ServerIcon 
              isHome 
              active={true} 
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
              onClick={() => navigate("/channels")} 
            />
          </SidebarContent>
        </Sidebar>

        {/* Friends/DM sidebar */}
        <div className="w-60 min-w-60 bg-discord-channel flex flex-col">
          {/* Search box */}
          <div className="p-3">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Найти или начать беседу"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-discord-sidebar border-none text-discord-text text-sm pl-8"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-discord-text/50" />
            </div>
          </div>

          {/* Friends button */}
          <div className="px-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-discord-text hover:bg-discord-hover" 
              onClick={() => navigate("/channels/@me")}
            >
              <Users className="h-5 w-5 mr-3" />
              Друзья
            </Button>
          </div>
          
          {/* Direct Messages */}
          <div className="mt-4 px-4 flex justify-between items-center">
            <h3 className="text-xs font-semibold text-discord-text/70">ЛИЧНЫЕ СООБЩЕНИЯ</h3>
            <Plus className="h-4 w-4 text-discord-text/70 cursor-pointer hover:text-discord-text" onClick={handleAddFriend} />
          </div>
          
          <ScrollArea className="flex-1 px-2 py-2">
            <div className="space-y-1">
              {filteredFriends.map((friend) => (
                <div 
                  key={friend.id}
                  className={`flex items-center gap-3 px-2 py-1.5 rounded cursor-pointer ${
                    friend.id === userId ? "bg-discord-hover" : "hover:bg-discord-hover"
                  }`}
                  onClick={() => navigate(`/channels/@me/${friend.id}`)}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-discord-channel ${
                      friend.status === "online" ? "bg-green-500" : 
                      friend.status === "idle" ? "bg-yellow-500" :
                      friend.status === "dnd" ? "bg-red-500" :
                      "bg-gray-500"
                    }`}></div>
                  </div>
                  <span className="text-sm text-discord-text truncate">{friend.username}</span>
                </div>
              ))}
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-discord-text hover:bg-discord-hover"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Main content - Chat */}
        {userId ? (
          <SidebarInset className="bg-discord-bg flex flex-col">
            {/* Chat header */}
            <div className="h-12 border-b border-discord-sidebar flex items-center px-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedFriend.avatar} />
                  <AvatarFallback>{selectedFriend.username[0]}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-white">{selectedFriend.username}</h3>
              </div>
            </div>
            
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
                  placeholder={`Написать @${selectedFriend.username}`}
                  className="w-full bg-transparent py-2.5 px-10 text-discord-text focus:outline-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
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
          </SidebarInset>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=200" 
              alt="Discord" 
              className="w-24 h-24 mb-6 rounded-full"
            />
            <h1 className="text-2xl font-bold text-white mb-2">Выберите друга для общения</h1>
            <p className="text-discord-text mb-6 max-w-md text-center">
              Выберите друга из списка слева, чтобы начать общение, или нажмите + чтобы добавить нового друга.
            </p>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default DirectMessages;


import { useState, useEffect, useRef } from "react";
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
import { Hash, Users, Plus, Settings, PaperclipIcon, Smile, Send, MoreVertical, Image, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useData, Server, Channel } from "@/context/DataContext";
import ChatMessage from "@/components/ChatMessage";
import ServerIcon from "@/components/ServerIcon";
import UserStatus from "@/components/UserStatus";
import { Link } from "react-router-dom";

const ServerView = () => {
  const { serverId, channelId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { servers, messages, createChannel, sendMessage, createServer, toggleNitro } = useData();
  
  const [message, setMessage] = useState("");
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const [createServerOpen, setCreateServerOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [serverName, setServerName] = useState("");
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Текущий сервер
  const currentServer = servers.find(s => s.id === serverId);
  
  // Если сервер не найден и не идет процесс создания сервера
  useEffect(() => {
    if (!currentServer && serverId && !createServerOpen) {
      toast({
        title: "Сервер не найден",
        description: "Сервер не существует или вы не имеете к нему доступа",
        variant: "destructive"
      });
      navigate("/channels/@me");
    }
  }, [currentServer, serverId, createServerOpen]);
  
  // Каналы сервера
  const textChannels = currentServer?.channels.filter(c => c.type === 'text') || [];
  const voiceChannels = currentServer?.channels.filter(c => c.type === 'voice') || [];
  
  // Выбранный канал
  const selectedChannel = channelId 
    ? currentServer?.channels.find(c => c.id === channelId) 
    : textChannels[0];
  
  useEffect(() => {
    // Если канал не выбран, выбираем первый текстовый канал
    if (currentServer && !channelId && textChannels.length > 0) {
      navigate(`/channels/${serverId}/${textChannels[0].id}`);
    }
  }, [currentServer, channelId, textChannels]);
  
  // Сообщения выбранного канала
  const channelMessages = selectedChannel ? (messages[selectedChannel.id] || []) : [];
  
  // Прокрутка к последнему сообщению при получении новых
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages]);
  
  const handleSendMessage = async () => {
    if (!selectedChannel || (!message.trim() && selectedFiles.length === 0)) return;
    
    try {
      await sendMessage(message, selectedChannel.id, serverId, undefined, selectedFiles);
      setMessage("");
      setSelectedFiles([]);
      setFileInputKey(Date.now()); // Сброс инпута файлов
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение",
        variant: "destructive"
      });
    }
  };

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название канала",
        variant: "destructive"
      });
      return;
    }

    try {
      const newChannel = await createChannel(
        serverId || "", 
        channelName.toLowerCase().replace(/\s+/g, '-'),
        channelType
      );
      
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
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать канал",
        variant: "destructive"
      });
    }
  };
  
  const handleCreateServer = async () => {
    if (!serverName.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название сервера",
        variant: "destructive"
      });
      return;
    }
    
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
    }
  };
  
  // Обработчик выбора файлов
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };
  
  // Удаление выбранного файла
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
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
              onClick={() => setCreateServerOpen(true)} 
            />
          </SidebarContent>
        </Sidebar>

        {/* Channels sidebar */}
        <div className="w-60 min-w-60  bg-discord-channel flex flex-col">
          {currentServer && (
            <>
              <div className="p-4 shadow-sm flex justify-between items-center">
                <h2 className="font-bold text-white truncate">{currentServer.name}</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-discord-text hover:bg-discord-hover">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-discord-sidebar text-discord-text border-none">
                    <DropdownMenuItem className="hover:bg-discord-hover hover:text-white cursor-pointer">
                      Пригласить людей
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-discord-hover hover:text-white cursor-pointer">
                      Настройки сервера
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-discord-hover hover:text-white cursor-pointer"
                      onClick={() => setCreateChannelOpen(true)}
                    >
                      Создать канал
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-discord-hover hover:text-red-500 cursor-pointer">
                      Покинуть сервер
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-2">
                  <div className="flex items-center justify-between text-discord-text/70 text-xs font-semibold px-2 py-1">
                    <span>ТЕКСТОВЫЕ КАНАЛЫ</span>
                    {user?.id === currentServer.ownerId && (
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
                          channel.id === selectedChannel?.id ? "bg-discord-hover text-discord-text" : "text-discord-text/70 hover:text-discord-text hover:bg-discord-hover"
                        }`}
                      >
                        <Hash className="h-5 w-5" />
                        <span className="text-sm">{channel.name}</span>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-discord-text/70 text-xs font-semibold px-2 py-1 mt-4">
                    <span>ГОЛОСОВЫЕ КАНАЛЫ</span>
                    {user?.id === currentServer.ownerId && (
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
                          channel.id === selectedChannel?.id ? "bg-discord-hover text-discord-text" : "text-discord-text/70 hover:text-discord-text hover:bg-discord-hover"
                        }`}
                      >
                        <Users className="h-5 w-5" />
                        <span className="text-sm">{channel.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
          
          {/* User profile */}
          <div className="bg-discord-sidebar/80 p-2 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback>{user?.username?.[0] || "У"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate flex items-center gap-1">
                {user?.username}
                {user?.nitro && (
                  <Sparkles className="h-4 w-4 text-[#5865F2]" />
                )}
              </div>
              <UserStatus status="online" />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-discord-text hover:bg-discord-hover">
              <Settings className="h-5 w-5" onClick={() => navigate("/settings")} />
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <SidebarInset className="bg-discord-bg flex flex-col">
          {currentServer && selectedChannel ? (
            <>
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
                      {channelMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-discord-text/70">
                          <div className="text-7xl mb-4">👋</div>
                          <p className="text-center">
                            Это начало канала {selectedChannel.name}. Отправьте сообщение!
                          </p>
                        </div>
                      ) : (
                        channelMessages.map(message => (
                          <div key={message.id}>
                            <ChatMessage 
                              user={message.senderName}
                              time={new Date(message.timestamp).toLocaleString("ru", { hour: "2-digit", minute: "2-digit" })}
                              avatar={message.senderAvatar}
                              message={message.content}
                            />
                            
                            {/* Отображение вложений */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="ml-14 mt-2 grid grid-cols-2 gap-2">
                                {message.attachments.map(attachment => (
                                  <div key={attachment.id} className="relative">
                                    {attachment.type === 'image' ? (
                                      <img 
                                        src={attachment.url} 
                                        alt="Вложение" 
                                        className="max-w-[300px] max-h-[300px] rounded-md object-cover"
                                      />
                                    ) : (
                                      <div className="flex items-center gap-2 bg-discord-sidebar p-3 rounded">
                                        <PaperclipIcon className="h-4 w-4 text-discord-text" />
                                        <span className="text-sm text-discord-text truncate">Файл</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  {/* Message input */}
                  <div className="p-4 mx-4 mb-4">
                    {/* Предпросмотр выбранных файлов */}
                    {selectedFiles.length > 0 && (
                      <div className="mb-2 bg-discord-hover p-2 rounded-t-md">
                        <div className="text-xs text-discord-text mb-2">Вложения:</div>
                        <div className="flex gap-2 flex-wrap">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="relative group">
                              {file.type.startsWith('image/') ? (
                                <div className="relative w-20 h-20">
                                  <img 
                                    src={URL.createObjectURL(file)} 
                                    alt={file.name} 
                                    className="w-full h-full object-cover rounded"
                                  />
                                  <button 
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                    onClick={() => removeSelectedFile(index)}
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <div className="bg-discord-sidebar p-2 rounded flex items-center">
                                  <PaperclipIcon className="h-4 w-4 text-discord-text mr-1" />
                                  <span className="text-xs text-discord-text truncate max-w-32">{file.name}</span>
                                  <button 
                                    className="ml-1 text-red-500"
                                    onClick={() => removeSelectedFile(index)}
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className={`relative bg-discord-hover rounded-md ${selectedFiles.length > 0 ? 'rounded-t-none' : ''}`}>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-2">
                        <label className="cursor-pointer">
                          <Image className="w-5 h-5 text-discord-text" />
                          <input 
                            type="file" 
                            className="hidden" 
                            multiple
                            key={fileInputKey}
                            onChange={handleFileSelect}
                          />
                        </label>
                      </div>
                      
                      <input 
                        type="text" 
                        placeholder={`Написать в #${selectedChannel?.name}`}
                        className="w-full bg-transparent py-2.5 px-12 text-discord-text focus:outline-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendMessage();
                        }}
                      />
                      
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                        <Smile className="w-5 h-5 text-discord-text cursor-pointer" />
                        <Send 
                          className={`w-5 h-5 ${message.trim() || selectedFiles.length > 0 ? 'text-[#5865F2] cursor-pointer' : 'text-discord-text/50'}`}
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
                    Это голосовой канал. Присоединяйтесь к нему, чтобы начать разговор.
                  </p>
                  <Button className="mt-6 bg-[#5865F2] hover:bg-[#4752c4]">
                    Присоединиться к голосовому каналу
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col">
              <div className="max-w-md text-center p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Добро пожаловать в Discord!</h2>
                <p className="text-discord-text mb-6">
                  Выберите существующий сервер или создайте новый, чтобы начать общение.
                </p>
                <Button 
                  className="bg-[#5865F2] hover:bg-[#4752c4]"
                  onClick={() => setCreateServerOpen(true)}
                >
                  Создать сервер
                </Button>
              </div>
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
          
          {/* Create Server Dialog */}
          <Dialog open={createServerOpen} onOpenChange={setCreateServerOpen}>
            <DialogContent className="bg-discord-bg text-discord-text border-none">
              <DialogHeader>
                <DialogTitle className="text-white">Создать сервер</DialogTitle>
                <DialogDescription>
                  Создайте новый сервер для общения с друзьями.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="server-name" className="text-xs uppercase text-discord-text">
                    НАЗВАНИЕ СЕРВЕРА
                  </Label>
                  <Input
                    id="server-name"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    placeholder="Новый сервер"
                    className="bg-discord-sidebar border-discord-hover text-white"
                  />
                </div>
              </div>

              <DialogFooter>
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
        </SidebarInset>
        
        {/* Members sidebar */}
        <div className="w-60 min-w-60 bg-discord-channel p-4 overflow-y-auto hidden md:block">
          {currentServer && (
            <>
              <div className="text-discord-text/70 text-xs font-semibold mb-2">
                УЧАСТНИКИ — {currentServer.members.length}
              </div>
              
              <div className="space-y-1">
                {/* Владелец и администраторы */}
                {currentServer.members.filter(m => m.role === 'owner' || m.role === 'admin').length > 0 && (
                  <div className="mb-2">
                    <div className="text-discord-text/70 text-xs font-semibold mb-1 mt-3">
                      АДМИНИСТРАТОРЫ
                    </div>
                    {currentServer.members.filter(m => m.role === 'owner' || m.role === 'admin').map(member => (
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
                {currentServer.members.filter(m => m.role === 'mod').length > 0 && (
                  <div className="mb-2">
                    <div className="text-discord-text/70 text-xs font-semibold mb-1 mt-3">
                      МОДЕРАТОРЫ
                    </div>
                    {currentServer.members.filter(m => m.role === 'mod').map(member => (
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
                {currentServer.members.filter(m => m.role === 'member').length > 0 && (
                  <div>
                    <div className="text-discord-text/70 text-xs font-semibold mb-1 mt-3">
                      УЧАСТНИКИ
                    </div>
                    {currentServer.members.filter(m => m.role === 'member').map(member => (
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
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ServerView;


import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User, Settings, Users, PlusCircle, Search, Send, Image, Smile, PaperclipIcon, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData, Friend, Message, DirectMessage } from "@/context/DataContext";
import ServerIcon from "@/components/ServerIcon";
import UserStatus from "@/components/UserStatus";
import ChatMessage from "@/components/ChatMessage";
import { useToast } from "@/components/ui/use-toast";

const DirectMessages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { friends, pendingFriends, blockedUsers, servers, directMessages, messages, addFriend, acceptFriendRequest, rejectFriendRequest, createDirectMessage, sendMessage, toggleNitro } = useData();
  
  const [selectedTab, setSelectedTab] = useState<string>("online");
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Текущий активный чат
  const activeDM = directMessages.find(dm => dm.id === userId) || null;
  
  // Контакт, с которым ведется переписка (если это не групповой чат)
  const chatContact = activeDM && !activeDM.isGroup && activeDM.participantIds.length === 2 
    ? activeDM.participantIds.find(id => id !== user?.id) 
    : null;
  
  const chatFriend = chatContact 
    ? friends.find(f => f.id === chatContact) 
    : null;
  
  // Сообщения текущего чата
  const chatMessages = activeDM ? (messages[activeDM.id] || []) : [];
  
  // Обработчик отправки сообщения
  const handleSendMessage = async () => {
    if (!activeDM || (!newMessage.trim() && selectedFiles.length === 0)) return;
    
    try {
      await sendMessage(newMessage, undefined, undefined, activeDM.id, selectedFiles);
      setNewMessage("");
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
  
  // Обработчик добавления друга
  const handleAddFriend = async () => {
    if (!friendUsername.trim()) return;
    
    setIsAddingFriend(true);
    
    try {
      await addFriend(friendUsername);
      setFriendUsername("");
      setAddFriendOpen(false);
      
      toast({
        title: "Запрос отправлен",
        description: `Запрос на добавление в друзья отправлен пользователю ${friendUsername}`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить запрос",
        variant: "destructive"
      });
    } finally {
      setIsAddingFriend(false);
    }
  };
  
  // Обработчик принятия запроса в друзья
  const handleAcceptFriendRequest = (friendId: string) => {
    acceptFriendRequest(friendId);
    
    toast({
      title: "Запрос принят",
      description: "Пользователь добавлен в список друзей",
    });
  };
  
  // Обработчик отклонения запроса в друзья
  const handleRejectFriendRequest = (friendId: string) => {
    rejectFriendRequest(friendId);
    
    toast({
      title: "Запрос отклонен",
      description: "Запрос на добавление в друзья отклонен",
    });
  };
  
  // Открытие чата с другом
  const openDirectMessage = async (friendId: string) => {
    try {
      const dm = await createDirectMessage([friendId]);
      navigate(`/channels/@me/${dm.id}`);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось открыть чат",
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
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-discord-bg">
        {/* Servers sidebar */}
        <Sidebar collapsible="icon" className="w-[72px] bg-discord-sidebar border-0">
          <SidebarContent className="py-2 px-2 gap-3">
            <ServerIcon 
              isHome
              active
              onClick={() => navigate("/channels/@me")} 
            />
            
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
        
        {/* Friends/DMs sidebar */}
        <div className="w-60 min-w-60 bg-discord-channel flex flex-col">
          <div className="p-3">
            <div className="bg-discord-sidebar rounded-md p-1.5 mb-2">
              <button className="w-full text-left text-discord-text flex items-center gap-2 px-2 py-1.5 rounded hover:bg-discord-hover">
                <Search className="h-4 w-4" />
                <span className="text-sm">Найти или начать беседу</span>
              </button>
            </div>
          </div>
          
          <div className="px-3 mb-2">
            <Link 
              to="/channels/@me" 
              className={`flex items-center gap-2 px-2 py-1.5 rounded ${
                !userId ? "bg-discord-hover text-white" : "text-discord-text hover:bg-discord-hover hover:text-white"
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-[15px]">Главная</span>
            </Link>
          </div>
          
          <div className="px-3">
            <div className="flex items-center justify-between text-discord-text/70 text-xs font-semibold p-2">
              <span>ЛИЧНЫЕ СООБЩЕНИЯ</span>
              <PlusCircle className="h-4 w-4 cursor-pointer hover:text-discord-text" onClick={() => setAddFriendOpen(true)} />
            </div>
          </div>
          
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-0.5">
              {directMessages.map(dm => {
                const otherParticipantId = dm.participantIds.find(id => id !== user?.id);
                const otherParticipant = friends.find(f => f.id === otherParticipantId);
                
                // Имя и аватар для отображения
                let displayName = dm.isGroup ? (dm.groupName || "Групповой чат") : (otherParticipant?.username || "Пользователь");
                let avatar = dm.isGroup ? (dm.groupIcon || "") : (otherParticipant?.avatar || "");
                let status = otherParticipant?.status || "offline";
                
                return (
                  <Link 
                    key={dm.id}
                    to={`/channels/@me/${dm.id}`}
                    className={`flex items-center gap-3 px-2 py-1.5 rounded group ${
                      dm.id === userId ? "bg-discord-hover text-white" : "text-discord-text hover:bg-discord-hover hover:text-white"
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatar} />
                        <AvatarFallback>{displayName[0]}</AvatarFallback>
                      </Avatar>
                      
                      {!dm.isGroup && (
                        <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-discord-channel ${
                          status === "online" ? "bg-green-500" :
                          status === "idle" ? "bg-yellow-500" :
                          status === "dnd" ? "bg-red-500" :
                          "bg-gray-500"
                        }`}></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{displayName}</div>
                      {dm.lastMessage && (
                        <div className="text-xs text-discord-text/70 truncate">
                          {dm.lastMessage.senderId === user?.id ? "Вы: " : ""}
                          {dm.lastMessage.content}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
          
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
          {userId ? (
            <>
              {/* Chat header */}
              <div className="h-12 border-b border-discord-sidebar flex items-center px-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {chatFriend ? (
                      <>
                        <AvatarImage src={chatFriend.avatar} />
                        <AvatarFallback>{chatFriend.username[0]}</AvatarFallback>
                      </>
                    ) : activeDM?.isGroup ? (
                      <>
                        <AvatarImage src={activeDM.groupIcon || ""} />
                        <AvatarFallback>{(activeDM.groupName || "Г")[0]}</AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback>?</AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div>
                    <div className="font-semibold text-white">
                      {chatFriend ? chatFriend.username : activeDM?.isGroup ? (activeDM.groupName || "Групповой чат") : "Чат"}
                    </div>
                    {chatFriend && (
                      <UserStatus status={chatFriend.status} />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Chat messages */}
              <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-5">
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-discord-text/70">
                      <div className="text-7xl mb-4">👋</div>
                      <p className="text-center">
                        Начните общение с {chatFriend?.username || "пользователем"} прямо сейчас!
                      </p>
                    </div>
                  ) : (
                    chatMessages.map(message => (
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
                    placeholder={`Написать ${chatFriend?.username || "в чат"}...`}
                    className="w-full bg-transparent py-2.5 px-12 text-discord-text focus:outline-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                  />
                  
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <Smile className="w-5 h-5 text-discord-text cursor-pointer" />
                    <Send 
                      className={`w-5 h-5 ${newMessage.trim() || selectedFiles.length > 0 ? 'text-[#5865F2] cursor-pointer' : 'text-discord-text/50'}`}
                      onClick={handleSendMessage}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 p-6">
              <div className="grid md:grid-cols-[2fr_1fr] gap-6">
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Друзья</h2>
                  </div>
                  
                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="bg-discord-bg border-b border-discord-hover mb-4 p-0 h-auto">
                      <TabsTrigger 
                        value="online" 
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#5865F2] data-[state=active]:rounded-none rounded-none text-discord-text data-[state=active]:text-white h-9"
                      >
                        В сети
                      </TabsTrigger>
                      <TabsTrigger 
                        value="all" 
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#5865F2] data-[state=active]:rounded-none rounded-none text-discord-text data-[state=active]:text-white h-9"
                      >
                        Все
                      </TabsTrigger>
                      <TabsTrigger 
                        value="pending" 
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#5865F2] data-[state=active]:rounded-none rounded-none text-discord-text data-[state=active]:text-white h-9"
                      >
                        Ожидание {pendingFriends.length > 0 && `(${pendingFriends.length})`}
                      </TabsTrigger>
                      <TabsTrigger 
                        value="blocked" 
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#5865F2] data-[state=active]:rounded-none rounded-none text-discord-text data-[state=active]:text-white h-9"
                      >
                        Заблокированные
                      </TabsTrigger>
                      <TabsTrigger 
                        value="add" 
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#5865F2] data-[state=active]:rounded-none rounded-none text-discord-text data-[state=active]:text-white h-9"
                      >
                        Добавить друга
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="online" className="mt-0">
                      <div className="space-y-2">
                        {friends.filter(f => f.status === "online").length === 0 ? (
                          <div className="text-center text-discord-text p-4">
                            <p>Нет друзей в сети. Пригласите кого-нибудь!</p>
                          </div>
                        ) : (
                          friends.filter(f => f.status === "online").map(friend => (
                            <div key={friend.id} className="flex items-center justify-between p-3 hover:bg-discord-hover rounded group">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={friend.avatar} />
                                  <AvatarFallback>{friend.username[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-white">{friend.username}</div>
                                  <UserStatus status={friend.status} />
                                </div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-discord-text hover:text-white hover:bg-discord-active"
                                  onClick={() => openDirectMessage(friend.id)}
                                >
                                  Сообщение
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="all" className="mt-0">
                      <div className="space-y-2">
                        {friends.length === 0 ? (
                          <div className="text-center text-discord-text p-4">
                            <p>У вас пока нет друзей. Добавьте кого-нибудь!</p>
                          </div>
                        ) : (
                          friends.map(friend => (
                            <div key={friend.id} className="flex items-center justify-between p-3 hover:bg-discord-hover rounded group">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={friend.avatar} />
                                  <AvatarFallback>{friend.username[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-white">{friend.username}</div>
                                  <UserStatus status={friend.status} />
                                </div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-discord-text hover:text-white hover:bg-discord-active"
                                  onClick={() => openDirectMessage(friend.id)}
                                >
                                  Сообщение
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="pending" className="mt-0">
                      <div className="space-y-2">
                        {pendingFriends.length === 0 ? (
                          <div className="text-center text-discord-text p-4">
                            <p>Нет ожидающих запросов в друзья.</p>
                          </div>
                        ) : (
                          pendingFriends.map(friend => (
                            <div key={friend.id} className="flex items-center justify-between p-3 hover:bg-discord-hover rounded group">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={friend.avatar} />
                                  <AvatarFallback>{friend.username[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-white">{friend.username}</div>
                                  <div className="text-xs text-discord-text">Входящий запрос дружбы</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleAcceptFriendRequest(friend.id)}
                                >
                                  Принять
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectFriendRequest(friend.id)}
                                >
                                  Отклонить
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="blocked" className="mt-0">
                      <div className="space-y-2">
                        {blockedUsers.length === 0 ? (
                          <div className="text-center text-discord-text p-4">
                            <p>Нет заблокированных пользователей.</p>
                          </div>
                        ) : (
                          blockedUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 hover:bg-discord-hover rounded group">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium text-white">{user.username}</div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="opacity-0 group-hover:opacity-100"
                              >
                                Разблокировать
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="add" className="mt-0">
                      <div className="bg-discord-sidebar/40 p-4 rounded-md">
                        <h3 className="text-white font-bold mb-2">ДОБАВИТЬ ДРУГА</h3>
                        <p className="text-sm text-discord-text mb-4">
                          Вы можете добавить друга, указав имя пользователя.
                        </p>
                        
                        <div className="flex gap-2">
                          <Input
                            placeholder="Введите имя пользователя"
                            className="bg-discord-bg border-none text-white"
                            value={friendUsername}
                            onChange={(e) => setFriendUsername(e.target.value)}
                          />
                          <Button
                            className="bg-[#5865F2] hover:bg-[#4752c4]"
                            disabled={isAddingFriend || !friendUsername.trim()}
                            onClick={handleAddFriend}
                          >
                            {isAddingFriend ? "Отправка..." : "Отправить запрос"}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="hidden md:block">
                  <div className="bg-discord-sidebar/40 p-4 rounded-md mb-4">
                    <h3 className="text-white font-bold mb-2">Активные сейчас</h3>
                    <div className="space-y-2">
                      {friends.filter(f => f.status === "online").length === 0 ? (
                        <div className="text-center text-discord-text p-2">
                          <p className="text-sm">Никого нет в сети</p>
                        </div>
                      ) : (
                        friends.filter(f => f.status === "online").map(friend => (
                          <div key={friend.id} className="flex items-center gap-3 p-2 hover:bg-discord-hover rounded">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={friend.avatar} />
                              <AvatarFallback>{friend.username[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-white">{friend.username}</div>
                              <UserStatus status={friend.status} />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-discord-sidebar/40 p-4 rounded-md">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="h-5 w-5 text-[#5865F2]" />
                      <h3 className="text-white font-bold">Discord Nitro</h3>
                    </div>
                    
                    <p className="text-sm text-discord-text mb-3">
                      Получите улучшенный Discord с Nitro. Больше форматов аватара, загрузка больших файлов и многое другое!
                    </p>
                    
                    <Button 
                      className="w-full bg-[#5865F2] hover:bg-[#4752c4]"
                      onClick={() => navigate("/nitro")}
                    >
                      {user?.nitro ? "Управление Nitro" : "Получить Nitro бесплатно"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SidebarInset>
      </div>
      
      {/* Add Friend Dialog */}
      <Dialog open={addFriendOpen} onOpenChange={setAddFriendOpen}>
        <DialogContent className="bg-discord-bg text-discord-text border-none">
          <DialogHeader>
            <DialogTitle className="text-white">Добавить друга</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <p className="text-sm">
              Вы можете добавить друга, указав имя пользователя.
            </p>
            
            <Input
              placeholder="Введите имя пользователя"
              className="bg-discord-sidebar border-none text-white"
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setAddFriendOpen(false)}
              className="text-discord-text"
            >
              Отмена
            </Button>
            <Button
              className="bg-[#5865F2] hover:bg-[#4752c4]"
              disabled={isAddingFriend || !friendUsername.trim()}
              onClick={handleAddFriend}
            >
              {isAddingFriend ? "Отправка..." : "Отправить запрос"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default DirectMessages;


import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

// Типы данных
export type Message = {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  channelId?: string;
  serverId?: string;
  directMessageId?: string;
  attachments?: Array<{id: string, url: string, type: string}>;
};

export type Friend = {
  id: string;
  username: string;
  avatar: string;
  status: "online" | "idle" | "dnd" | "offline";
  isBlocked?: boolean;
};

export type Server = {
  id: string;
  name: string;
  icon: string;
  ownerId: string;
  channels: Channel[];
  members: ServerMember[];
};

export type ServerMember = {
  id: string;
  username: string;
  avatar: string;
  status: "online" | "idle" | "dnd" | "offline";
  role: "owner" | "admin" | "mod" | "member";
};

export type Channel = {
  id: string;
  name: string;
  type: "text" | "voice" | "announcement";
  serverId: string;
  parentId?: string;
};

export type DirectMessage = {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  isGroup?: boolean;
  groupName?: string;
  groupIcon?: string;
};

// Тип контекста
interface DataContextType {
  friends: Friend[];
  pendingFriends: Friend[];
  blockedUsers: Friend[];
  servers: Server[];
  directMessages: DirectMessage[];
  messages: Record<string, Message[]>;
  addFriend: (username: string) => Promise<void>;
  acceptFriendRequest: (friendId: string) => void;
  rejectFriendRequest: (friendId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  createServer: (name: string, icon?: string) => Promise<Server>;
  joinServer: (inviteCode: string) => Promise<void>;
  leaveServer: (serverId: string) => void;
  createChannel: (serverId: string, name: string, type: "text" | "voice" | "announcement") => Promise<Channel>;
  deleteChannel: (channelId: string) => void;
  sendMessage: (content: string, channelId?: string, serverId?: string, directMessageId?: string, attachments?: File[]) => Promise<Message>;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, content: string) => void;
  createDirectMessage: (participantIds: string[], isGroup?: boolean, groupName?: string) => Promise<DirectMessage>;
  toggleNitro: () => void;
  updateUserSettings: (settings: any) => void;
  userSettings: any;
}

// Создание контекста
const DataContext = createContext<DataContextType>({
  friends: [],
  pendingFriends: [],
  blockedUsers: [],
  servers: [],
  directMessages: [],
  messages: {},
  addFriend: async () => { throw new Error("Not implemented"); },
  acceptFriendRequest: () => {},
  rejectFriendRequest: () => {},
  blockUser: () => {},
  unblockUser: () => {},
  createServer: async () => { throw new Error("Not implemented"); },
  joinServer: async () => {},
  leaveServer: () => {},
  createChannel: async () => { throw new Error("Not implemented"); },
  deleteChannel: () => {},
  sendMessage: async () => { throw new Error("Not implemented"); },
  deleteMessage: () => {},
  editMessage: () => {},
  createDirectMessage: async () => { throw new Error("Not implemented"); },
  toggleNitro: () => {},
  updateUserSettings: () => {},
  userSettings: {},
});

// Хук для использования контекста
export const useData = () => useContext(DataContext);

// Генерация UUID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Генерация случайного аватара
const getRandomAvatar = () => {
  const avatars = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=100&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80"
  ];
  
  return avatars[Math.floor(Math.random() * avatars.length)];
};

// Генерация случайного статуса
const getRandomStatus = () => {
  const statuses = ["online", "idle", "dnd", "offline"];
  return statuses[Math.floor(Math.random() * statuses.length)] as "online" | "idle" | "dnd" | "offline";
};

// Провайдер данных
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  
  // Состояния данных
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingFriends, setPendingFriends] = useState<Friend[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<Friend[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [userSettings, setUserSettings] = useState({
    theme: "dark",
    language: "ru",
    notifications: {
      sounds: true,
      desktop: true,
      mobile: true
    },
    status: "online" as "online" | "idle" | "dnd" | "offline",
    appearance: {
      fontSize: "16px",
      spacing: "normal",
      accessibility: {
        saturation: 100,
        contrast: 100,
        motionReduction: false
      }
    }
  });

  // Загрузка данных из локального хранилища
  useEffect(() => {
    if (user) {
      const loadedFriends = localStorage.getItem("discord_friends");
      const loadedPendingFriends = localStorage.getItem("discord_pending_friends");
      const loadedBlockedUsers = localStorage.getItem("discord_blocked_users");
      const loadedServers = localStorage.getItem("discord_servers");
      const loadedDirectMessages = localStorage.getItem("discord_direct_messages");
      const loadedMessages = localStorage.getItem("discord_messages");
      const loadedSettings = localStorage.getItem("discord_user_settings");
      
      if (loadedFriends) setFriends(JSON.parse(loadedFriends));
      if (loadedPendingFriends) setPendingFriends(JSON.parse(loadedPendingFriends));
      if (loadedBlockedUsers) setBlockedUsers(JSON.parse(loadedBlockedUsers));
      if (loadedServers) setServers(JSON.parse(loadedServers));
      if (loadedDirectMessages) setDirectMessages(JSON.parse(loadedDirectMessages));
      if (loadedMessages) setMessages(JSON.parse(loadedMessages));
      if (loadedSettings) setUserSettings(JSON.parse(loadedSettings));
      
      // Если это первая загрузка, создаем начальные данные
      if (!loadedFriends) {
        const initialFriends = Array(3).fill(null).map((_, i) => ({
          id: `friend_${i}`,
          username: ["АЙТИ Котик", "Геймер", "Программист"][i],
          avatar: getRandomAvatar(),
          status: getRandomStatus()
        }));
        setFriends(initialFriends);
        localStorage.setItem("discord_friends", JSON.stringify(initialFriends));
      }
      
      if (!loadedServers) {
        const initialServers = [
          {
            id: "server_1",
            name: "Уютный сервер",
            icon: "",
            ownerId: "friend_0",
            channels: [
              { id: "channel_1", name: "основной", type: "text", serverId: "server_1" },
              { id: "channel_2", name: "игры", type: "text", serverId: "server_1" },
              { id: "channel_3", name: "Голосовой чат", type: "voice", serverId: "server_1" }
            ],
            members: [
              { id: "friend_0", username: "АЙТИ Котик", avatar: getRandomAvatar(), status: "online", role: "owner" },
              { id: user.id, username: user.username, avatar: user.avatar, status: "online", role: "member" }
            ]
          }
        ];
        setServers(initialServers);
        localStorage.setItem("discord_servers", JSON.stringify(initialServers));
        
        // Создаем начальные сообщения
        const initialMessages: Record<string, Message[]> = {
          "channel_1": [
            {
              id: "msg_1",
              content: "Добро пожаловать на сервер! 👋",
              senderId: "friend_0",
              senderName: "АЙТИ Котик",
              senderAvatar: getRandomAvatar(),
              timestamp: new Date().toISOString(),
              channelId: "channel_1",
              serverId: "server_1"
            }
          ]
        };
        setMessages(initialMessages);
        localStorage.setItem("discord_messages", JSON.stringify(initialMessages));
      }
      
      if (!loadedDirectMessages) {
        const initialDMs = [
          {
            id: "dm_1",
            participantIds: [user.id, "friend_0"],
            lastMessage: {
              id: "dm_msg_1",
              content: "Привет! Как дела?",
              senderId: "friend_0",
              senderName: "АЙТИ Котик",
              senderAvatar: getRandomAvatar(),
              timestamp: new Date().toISOString(),
              directMessageId: "dm_1"
            }
          }
        ];
        setDirectMessages(initialDMs);
        localStorage.setItem("discord_direct_messages", JSON.stringify(initialDMs));
        
        // Добавляем сообщения для DM
        const updatedMessages = { ...messages };
        updatedMessages["dm_1"] = [
          {
            id: "dm_msg_1",
            content: "Привет! Как дела?",
            senderId: "friend_0",
            senderName: "АЙТИ Котик",
            senderAvatar: getRandomAvatar(),
            timestamp: new Date().toISOString(),
            directMessageId: "dm_1"
          }
        ];
        setMessages(updatedMessages);
        localStorage.setItem("discord_messages", JSON.stringify(updatedMessages));
      }
    }
  }, [user?.id]);

  // Сохранение данных в локальное хранилище
  useEffect(() => {
    if (user) {
      localStorage.setItem("discord_friends", JSON.stringify(friends));
      localStorage.setItem("discord_pending_friends", JSON.stringify(pendingFriends));
      localStorage.setItem("discord_blocked_users", JSON.stringify(blockedUsers));
      localStorage.setItem("discord_servers", JSON.stringify(servers));
      localStorage.setItem("discord_direct_messages", JSON.stringify(directMessages));
      localStorage.setItem("discord_messages", JSON.stringify(messages));
      localStorage.setItem("discord_user_settings", JSON.stringify(userSettings));
    }
  }, [user, friends, pendingFriends, blockedUsers, servers, directMessages, messages, userSettings]);
  
  // Функции для управления друзьями
  const addFriend = async (username: string) => {
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newFriend: Friend = {
      id: `friend_${generateId()}`,
      username,
      avatar: getRandomAvatar(),
      status: getRandomStatus()
    };
    
    setPendingFriends([...pendingFriends, newFriend]);
  };
  
  const acceptFriendRequest = (friendId: string) => {
    const friend = pendingFriends.find(f => f.id === friendId);
    if (friend) {
      setFriends([...friends, friend]);
      setPendingFriends(pendingFriends.filter(f => f.id !== friendId));
    }
  };
  
  const rejectFriendRequest = (friendId: string) => {
    setPendingFriends(pendingFriends.filter(f => f.id !== friendId));
  };
  
  const blockUser = (userId: string) => {
    const user = [...friends, ...pendingFriends].find(f => f.id === userId);
    if (user) {
      setBlockedUsers([...blockedUsers, { ...user, isBlocked: true }]);
      setFriends(friends.filter(f => f.id !== userId));
      setPendingFriends(pendingFriends.filter(f => f.id !== userId));
    }
  };
  
  const unblockUser = (userId: string) => {
    const user = blockedUsers.find(u => u.id === userId);
    if (user) {
      setBlockedUsers(blockedUsers.filter(u => u.id !== userId));
      setFriends([...friends, { ...user, isBlocked: false }]);
    }
  };
  
  // Функции для управления серверами
  const createServer = async (name: string, icon?: string) => {
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!user) throw new Error("Пользователь не авторизован");
    
    const newServer: Server = {
      id: `server_${generateId()}`,
      name,
      icon: icon || "",
      ownerId: user.id,
      channels: [
        { id: `channel_${generateId()}`, name: "общий", type: "text", serverId: "" },
        { id: `channel_${generateId()}`, name: "Голосовой чат", type: "voice", serverId: "" }
      ],
      members: [
        { id: user.id, username: user.username, avatar: user.avatar, status: "online", role: "owner" }
      ]
    };
    
    // Обновляем serverId для каналов
    newServer.channels = newServer.channels.map(channel => ({
      ...channel,
      serverId: newServer.id
    }));
    
    setServers([...servers, newServer]);
    
    return newServer;
  };
  
  const joinServer = async (inviteCode: string) => {
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Здесь была бы логика для настоящего API
    throw new Error("Неверный код приглашения");
  };
  
  const leaveServer = (serverId: string) => {
    // Если пользователь - владелец, удаляем сервер
    const server = servers.find(s => s.id === serverId);
    if (server && user && server.ownerId === user.id) {
      setServers(servers.filter(s => s.id !== serverId));
    } else if (server && user) {
      // Иначе удаляем пользователя из членов сервера
      const updatedServer = {
        ...server,
        members: server.members.filter(m => m.id !== user.id)
      };
      setServers(servers.map(s => s.id === serverId ? updatedServer : s));
    }
  };
  
  // Функции для управления каналами
  const createChannel = async (serverId: string, name: string, type: "text" | "voice" | "announcement") => {
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newChannel: Channel = {
      id: `channel_${generateId()}`,
      name,
      type,
      serverId
    };
    
    const updatedServers = servers.map(server => {
      if (server.id === serverId) {
        return {
          ...server,
          channels: [...server.channels, newChannel]
        };
      }
      return server;
    });
    
    setServers(updatedServers);
    
    return newChannel;
  };
  
  const deleteChannel = (channelId: string) => {
    const updatedServers = servers.map(server => {
      const channelToDelete = server.channels.find(c => c.id === channelId);
      
      if (channelToDelete) {
        return {
          ...server,
          channels: server.channels.filter(c => c.id !== channelId)
        };
      }
      
      return server;
    });
    
    setServers(updatedServers);
    
    // Удаляем сообщения канала
    const updatedMessages = { ...messages };
    delete updatedMessages[channelId];
    setMessages(updatedMessages);
  };
  
  // Функции для управления сообщениями
  const sendMessage = async (
    content: string, 
    channelId?: string, 
    serverId?: string, 
    directMessageId?: string,
    attachments?: File[]
  ) => {
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!user) throw new Error("Пользователь не авторизован");
    
    const targetId = channelId || directMessageId;
    if (!targetId) throw new Error("Необходимо указать channelId или directMessageId");
    
    // Обработка вложений (имитация загрузки)
    let messageAttachments = undefined;
    if (attachments && attachments.length > 0) {
      messageAttachments = attachments.map(file => ({
        id: `attachment_${generateId()}`,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'file'
      }));
    }
    
    const newMessage: Message = {
      id: `msg_${generateId()}`,
      content,
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      timestamp: new Date().toISOString(),
      channelId,
      serverId,
      directMessageId,
      attachments: messageAttachments
    };
    
    // Обновляем сообщения
    const updatedMessages = { ...messages };
    if (!updatedMessages[targetId]) {
      updatedMessages[targetId] = [];
    }
    updatedMessages[targetId] = [...updatedMessages[targetId], newMessage];
    setMessages(updatedMessages);
    
    // Если это личное сообщение, обновляем lastMessage
    if (directMessageId) {
      const updatedDMs = directMessages.map(dm => {
        if (dm.id === directMessageId) {
          return {
            ...dm,
            lastMessage: newMessage
          };
        }
        return dm;
      });
      setDirectMessages(updatedDMs);
    }
    
    return newMessage;
  };
  
  const deleteMessage = (messageId: string) => {
    // Находим сообщение и удаляем его
    let updatedMessages = { ...messages };
    
    Object.keys(updatedMessages).forEach(key => {
      const messageIndex = updatedMessages[key].findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        updatedMessages[key] = updatedMessages[key].filter(m => m.id !== messageId);
      }
    });
    
    setMessages(updatedMessages);
  };
  
  const editMessage = (messageId: string, content: string) => {
    // Находим сообщение и редактируем его
    let updatedMessages = { ...messages };
    
    Object.keys(updatedMessages).forEach(key => {
      updatedMessages[key] = updatedMessages[key].map(message => {
        if (message.id === messageId) {
          return {
            ...message,
            content,
            isEdited: true
          };
        }
        return message;
      });
    });
    
    setMessages(updatedMessages);
  };
  
  // Функции для личных сообщений
  const createDirectMessage = async (participantIds: string[], isGroup = false, groupName?: string) => {
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!user) throw new Error("Пользователь не авторизован");
    
    // Проверяем, существует ли уже личный чат с этими участниками
    if (!isGroup && participantIds.length === 1) {
      const existingDM = directMessages.find(dm => 
        !dm.isGroup && 
        dm.participantIds.length === 2 && 
        dm.participantIds.includes(user.id) && 
        dm.participantIds.includes(participantIds[0])
      );
      
      if (existingDM) return existingDM;
    }
    
    // Создаем новый чат
    const newDM: DirectMessage = {
      id: `dm_${generateId()}`,
      participantIds: [user.id, ...participantIds],
      isGroup,
      groupName,
      groupIcon: isGroup ? getRandomAvatar() : undefined
    };
    
    setDirectMessages([...directMessages, newDM]);
    
    return newDM;
  };
  
  // Функция переключения Nitro (премиум)
  const toggleNitro = () => {
    if (user) {
      const updatedUser = {
        ...user,
        nitro: !user.nitro
      };
      
      localStorage.setItem("discord_user", JSON.stringify(updatedUser));
      // Обновление пользователя в AuthContext. В реальном приложении здесь нужен диспатч события
      window.location.reload();
    }
  };
  
  // Функция обновления настроек пользователя
  const updateUserSettings = (settings: any) => {
    setUserSettings({
      ...userSettings,
      ...settings
    });
  };

  return (
    <DataContext.Provider value={{
      friends,
      pendingFriends,
      blockedUsers,
      servers,
      directMessages,
      messages,
      addFriend,
      acceptFriendRequest,
      rejectFriendRequest,
      blockUser,
      unblockUser,
      createServer,
      joinServer,
      leaveServer,
      createChannel,
      deleteChannel,
      sendMessage,
      deleteMessage,
      editMessage,
      createDirectMessage,
      toggleNitro,
      updateUserSettings,
      userSettings
    }}>
      {children}
    </DataContext.Provider>
  );
};

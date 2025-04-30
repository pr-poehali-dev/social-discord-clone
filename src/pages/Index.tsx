
import { Link } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Hash, Plus, Users, Settings, AtSign, Smile, PaperclipIcon, Send } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ServerIcon from "@/components/ServerIcon";
import UserStatus from "@/components/UserStatus";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-discord-bg">
        {/* Servers sidebar */}
        <Sidebar collapsible="icon" className="w-[72px] bg-discord-sidebar border-0">
          <SidebarContent className="py-2 px-2 gap-3">
            <ServerIcon active isHome />
            <Separator className="mx-2 bg-discord-hover/30" />
            <ServerIcon name="Чат-бот" />
            <ServerIcon name="Разработка" />
            <ServerIcon name="Игры" />
            <ServerIcon name="Музыка" />
            <ServerIcon isAdd />
          </SidebarContent>
        </Sidebar>

        {/* Channels sidebar */}
        <div className="w-60 min-w-60 bg-discord-channel flex flex-col">
          <div className="p-4 shadow-sm">
            <h2 className="font-bold text-white">Космический сервер</h2>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              <div className="text-discord-text/70 text-xs font-semibold px-2 py-1">
                ТЕКСТОВЫЕ КАНАЛЫ
              </div>
              
              <div className="space-y-1 mt-1">
                <Link to="/" className="flex items-center gap-2 px-2 py-1 rounded text-discord-text hover:bg-discord-hover group">
                  <Hash className="h-5 w-5" />
                  <span className="text-sm">общий</span>
                </Link>
                <Link to="/" className="flex items-center gap-2 px-2 py-1 rounded text-discord-text/70 hover:text-discord-text hover:bg-discord-hover group">
                  <Hash className="h-5 w-5" />
                  <span className="text-sm">помощь</span>
                </Link>
                <Link to="/" className="flex items-center gap-2 px-2 py-1 rounded text-discord-text/70 hover:text-discord-text hover:bg-discord-hover group">
                  <Hash className="h-5 w-5" />
                  <span className="text-sm">идеи</span>
                </Link>
              </div>
              
              <div className="text-discord-text/70 text-xs font-semibold px-2 py-1 mt-4">
                ГОЛОСОВЫЕ КАНАЛЫ
              </div>
              
              <div className="space-y-1 mt-1">
                <Link to="/" className="flex items-center gap-2 px-2 py-1 rounded text-discord-text/70 hover:text-discord-text hover:bg-discord-hover group">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Основной</span>
                </Link>
                <Link to="/" className="flex items-center gap-2 px-2 py-1 rounded text-discord-text/70 hover:text-discord-text hover:bg-discord-hover group">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Игры</span>
                </Link>
              </div>
            </div>
          </ScrollArea>
          
          {/* User profile */}
          <div className="bg-discord-sidebar/80 p-2 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100" />
              <AvatarFallback>Ю</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">Юра</div>
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
              <Hash className="h-6 w-6 text-discord-text/70" />
              <h3 className="font-bold text-white">общий</h3>
            </div>
            <Separator orientation="vertical" className="h-6 mx-4 bg-discord-hover" />
            <p className="text-sm text-discord-text/70">Общий канал для всех участников</p>
          </div>
          
          {/* Chat messages */}
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-5">
              <ChatMessage 
                user="Командир корабля" 
                time="Сегодня в 12:30" 
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" 
                message="Приветствую всех на нашем космическом сервере! 🚀"
              />
              <ChatMessage 
                user="Астроном" 
                time="Сегодня в 12:35" 
                avatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80" 
                message="Спасибо за приглашение! Кто-нибудь интересуется наблюдением за звездами?"
              />
              <ChatMessage 
                user="Инженер" 
                time="Сегодня в 12:40" 
                avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" 
                message="Я больше по ракетным двигателям, но звезды тоже люблю!"
              />
              <ChatMessage 
                user="Юра" 
                time="Сегодня в 12:45" 
                avatar="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100" 
                message="Как программист, я могу помочь с автоматизацией наблюдений. Кстати, из космоса код выглядит совсем иначе 😄"
              />
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
                placeholder="Написать сообщение #общий"
                className="w-full bg-transparent py-2.5 px-10 text-discord-text focus:outline-none" 
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <Smile className="w-5 h-5 text-discord-text" />
                <PaperclipIcon className="w-5 h-5 text-discord-text" />
                <Send className="w-5 h-5 text-discord-text" />
              </div>
            </div>
          </div>
        </SidebarInset>
        
        {/* Members sidebar */}
        <div className="w-60 min-w-60 bg-discord-channel p-4 overflow-y-auto hidden md:block">
          <div className="text-discord-text/70 text-xs font-semibold mb-2">
            ОНЛАЙН — 4
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-discord-text hover:bg-discord-hover p-2 rounded">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" />
                <AvatarFallback>К</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">Командир корабля</div>
                <div className="text-xs text-discord-text/50">играет в Starfield</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-discord-text hover:bg-discord-hover p-2 rounded">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80" />
                <AvatarFallback>А</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">Астроном</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-discord-text hover:bg-discord-hover p-2 rounded">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" />
                <AvatarFallback>И</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">Инженер</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-discord-text hover:bg-discord-hover p-2 rounded">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100" />
                <AvatarFallback>Ю</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">Юра</div>
                <div className="text-xs text-discord-text/50">в сети</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

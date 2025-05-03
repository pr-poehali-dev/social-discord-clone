
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { XIcon, User, Settings, Bell, Paintbrush, Shield, CreditCard, Languages, Sparkles, FileImage, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/use-toast";

const UserSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const { userSettings, updateUserSettings, toggleNitro } = useData();
  
  const [activeTab, setActiveTab] = useState("account");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  
  // Обработчик изменения настроек
  const handleSettingsChange = (section: string, key: string, value: any) => {
    const updatedSettings = { ...userSettings };
    
    if (section) {
      if (!updatedSettings[section]) updatedSettings[section] = {};
      updatedSettings[section][key] = value;
    } else {
      updatedSettings[key] = value;
    }
    
    updateUserSettings(updatedSettings);
    
    toast({
      title: "Настройки сохранены",
      description: "Ваши настройки успешно обновлены",
    });
  };
  
  // Обработчик выбора аватара
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
      
      toast({
        title: "Аватар обновлен",
        description: "Ваш новый аватар успешно загружен",
      });
    }
  };
  
  // Обработчик выхода из аккаунта
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <div className="flex h-screen bg-discord-bg text-white">
      <div className="w-60 bg-discord-channel overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3">
            <div className="space-y-1">
              <div className="text-discord-text/70 text-xs font-semibold px-3 py-2">
                НАСТРОЙКИ ПОЛЬЗОВАТЕЛЯ
              </div>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 ${activeTab === "account" ? "bg-discord-hover text-white" : "text-discord-text hover:bg-discord-hover hover:text-white"}`}
                onClick={() => setActiveTab("account")}
              >
                <User className="h-5 w-5" />
                <span>Учетная запись</span>
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 ${activeTab === "profile" ? "bg-discord-hover text-white" : "text-discord-text hover:bg-discord-hover hover:text-white"}`}
                onClick={() => setActiveTab("profile")}
              >
                <FileImage className="h-5 w-5" />
                <span>Профиль</span>
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 ${activeTab === "privacy" ? "bg-discord-hover text-white" : "text-discord-text hover:bg-discord-hover hover:text-white"}`}
                onClick={() => setActiveTab("privacy")}
              >
                <Shield className="h-5 w-5" />
                <span>Конфиденциальность</span>
              </button>
              
              <div className="text-discord-text/70 text-xs font-semibold px-3 py-2 mt-4">
                НАСТРОЙКИ ПРИЛОЖЕНИЯ
              </div>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 ${activeTab === "appearance" ? "bg-discord-hover text-white" : "text-discord-text hover:bg-discord-hover hover:text-white"}`}
                onClick={() => setActiveTab("appearance")}
              >
                <Paintbrush className="h-5 w-5" />
                <span>Внешний вид</span>
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 ${activeTab === "notifications" ? "bg-discord-hover text-white" : "text-discord-text hover:bg-discord-hover hover:text-white"}`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="h-5 w-5" />
                <span>Уведомления</span>
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 ${activeTab === "language" ? "bg-discord-hover text-white" : "text-discord-text hover:bg-discord-hover hover:text-white"}`}
                onClick={() => setActiveTab("language")}
              >
                <Languages className="h-5 w-5" />
                <span>Язык</span>
              </button>
              
              <div className="text-discord-text/70 text-xs font-semibold px-3 py-2 mt-4">
                ОПЛАТА
              </div>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 ${activeTab === "nitro" ? "bg-discord-hover text-white" : "text-discord-text hover:bg-discord-hover hover:text-white"}`}
                onClick={() => setActiveTab("nitro")}
              >
                <Sparkles className="h-5 w-5" />
                <span>Discord Nitro</span>
                {user?.nitro && <div className="ml-auto text-xs bg-[#5865F2] rounded px-1.5 py-0.5">Активно</div>}
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 ${activeTab === "billing" ? "bg-discord-hover text-white" : "text-discord-text hover:bg-discord-hover hover:text-white"}`}
                onClick={() => setActiveTab("billing")}
              >
                <CreditCard className="h-5 w-5" />
                <span>Подписки</span>
              </button>
            </div>
          </div>
        </ScrollArea>
        
        <div className="absolute bottom-0 left-0 w-60 p-3 bg-discord-sidebar/80">
          <Button 
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-discord-hover"
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="h-12 flex items-center px-4 border-b border-discord-sidebar">
          <Button 
            variant="ghost" 
            className="text-discord-text hover:text-white"
            onClick={() => navigate(-1)}
          >
            <XIcon className="h-5 w-5 mr-2" />
            <span>ESC</span>
          </Button>
          <h1 className="text-lg font-bold ml-4">Настройки пользователя</h1>
        </div>
        
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-6">
              {/* Учетная запись */}
              {activeTab === "account" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Учетная запись</h2>
                  
                  <div className="bg-discord-sidebar/40 rounded-md p-4 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          {profileImagePreview ? (
                            <AvatarImage src={profileImagePreview} />
                          ) : (
                            <>
                              <AvatarImage src={user?.avatar || ""} />
                              <AvatarFallback>{user?.username?.[0] || "У"}</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <label className="absolute bottom-0 right-0 bg-[#5865F2] h-6 w-6 rounded-full flex items-center justify-center cursor-pointer">
                          <Settings className="h-3.5 w-3.5" />
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      </div>
                      
                      <div className="flex-1">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="username" className="text-xs text-discord-text">
                              ИМЯ ПОЛЬЗОВАТЕЛЯ {user?.nitro && <span className="text-[#5865F2]">(с Nitro)</span>}
                            </Label>
                            <div className="flex gap-2">
                              <Input 
                                id="username" 
                                className="bg-discord-bg border-discord-hover" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                              />
                              {user?.nitro && (
                                <Input 
                                  className="w-20 bg-discord-bg border-discord-hover" 
                                  placeholder="#0001"
                                />
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="email" className="text-xs text-discord-text">
                              АДРЕС ЭЛЕКТРОННОЙ ПОЧТЫ
                            </Label>
                            <Input 
                              id="email" 
                              className="bg-discord-bg border-discord-hover" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <Button className="mt-4 bg-[#5865F2] hover:bg-[#4752c4]">
                          Сохранить
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-discord-sidebar/40 rounded-md p-4 mb-6">
                    <h3 className="text-lg font-bold mb-2">Смена пароля</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password" className="text-xs text-discord-text">
                          ТЕКУЩИЙ ПАРОЛЬ
                        </Label>
                        <Input 
                          id="current-password" 
                          type="password"
                          className="bg-discord-bg border-discord-hover" 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="new-password" className="text-xs text-discord-text">
                          НОВЫЙ ПАРОЛЬ
                        </Label>
                        <Input 
                          id="new-password" 
                          type="password"
                          className="bg-discord-bg border-discord-hover" 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="confirm-password" className="text-xs text-discord-text">
                          ПОДТВЕРДИТЕ НОВЫЙ ПАРОЛЬ
                        </Label>
                        <Input 
                          id="confirm-password" 
                          type="password"
                          className="bg-discord-bg border-discord-hover" 
                        />
                      </div>
                    </div>
                    
                    <Button className="mt-4 bg-[#5865F2] hover:bg-[#4752c4]">
                      Изменить пароль
                    </Button>
                  </div>
                  
                  <div className="bg-red-500/20 rounded-md p-4">
                    <h3 className="text-lg font-bold mb-2">Удаление аккаунта</h3>
                    <p className="text-discord-text mb-4">
                      Удаление аккаунта — необратимое действие. Ваш аккаунт, серверы и сообщения будут полностью удалены.
                    </p>
                    <Button variant="destructive">
                      Удалить аккаунт
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Профиль */}
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Профиль пользователя</h2>
                  
                  <div className="mb-8">
                    <div className="bg-discord-sidebar/40 rounded-md">
                      <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-md"></div>
                      <div className="p-4 relative">
                        <div className="absolute -top-10 left-4 bg-discord-sidebar rounded-full p-1">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={user?.avatar || ""} />
                            <AvatarFallback>{user?.username?.[0] || "У"}</AvatarFallback>
                          </Avatar>
                          {user?.nitro && (
                            <div className="absolute bottom-1 right-1">
                              <Sparkles className="h-4 w-4 text-[#5865F2]" />
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-8">
                          <div className="flex items-center">
                            <h3 className="text-lg font-bold">{user?.username}</h3>
                            {user?.nitro && (
                              <div className="ml-2 text-xs bg-[#5865F2] rounded px-1.5 py-0.5">Nitro</div>
                            )}
                          </div>
                          <p className="text-discord-text text-sm">Участник Discord с {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'недавно'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-xs text-discord-text">БАННЕР ПРОФИЛЯ</Label>
                      <div className="bg-discord-sidebar/40 rounded-md p-4 mt-1">
                        {user?.nitro ? (
                          <div className="space-y-4">
                            <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                              <Button variant="outline" className="bg-discord-bg/50 border-none">
                                Изменить баннер
                              </Button>
                            </div>
                            <div className="text-discord-text text-sm">
                              Рекомендуемый размер 1600x400 пикселей. Максимальный размер файла 10 МБ.
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Получите баннер профиля с Nitro</h3>
                              <p className="text-sm text-discord-text">Украсьте свой профиль собственным баннером</p>
                            </div>
                            <Button 
                              className="bg-[#5865F2] hover:bg-[#4752c4]"
                              onClick={() => navigate("/nitro")}
                            >
                              Получить Nitro
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-discord-text">О СЕБЕ</Label>
                      <Input 
                        className="bg-discord-bg border-discord-hover mt-1" 
                        placeholder="Расскажите о себе..."
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Конфиденциальность */}
              {activeTab === "privacy" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Конфиденциальность и безопасность</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-discord-sidebar/40 rounded-md p-4">
                      <h3 className="font-bold mb-4">Настройки безопасности</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Двухфакторная аутентификация</h4>
                            <p className="text-discord-text text-sm">Защитите свою учетную запись дополнительным уровнем безопасности</p>
                          </div>
                          <Button variant="outline" className="border-discord-hover">
                            Включить
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Устройства</h4>
                            <p className="text-discord-text text-sm">Просмотр устройств, с которых вы вошли в систему</p>
                          </div>
                          <Button variant="ghost" className="text-discord-text">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-discord-sidebar/40 rounded-md p-4">
                      <h3 className="font-bold mb-4">Настройки конфиденциальности</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Кто может добавить вас в друзья</h4>
                          </div>
                          <Select defaultValue="everyone">
                            <SelectTrigger className="w-40 bg-discord-bg border-discord-hover">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-discord-sidebar border-discord-hover">
                              <SelectItem value="everyone">Все</SelectItem>
                              <SelectItem value="friends-of-friends">Друзья друзей</SelectItem>
                              <SelectItem value="server-members">Участники сервера</SelectItem>
                              <SelectItem value="none">Никто</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Кто может отправлять вам личные сообщения</h4>
                          </div>
                          <Select defaultValue="everyone">
                            <SelectTrigger className="w-40 bg-discord-bg border-discord-hover">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-discord-sidebar border-discord-hover">
                              <SelectItem value="everyone">Все</SelectItem>
                              <SelectItem value="friends">Только друзья</SelectItem>
                              <SelectItem value="none">Никто</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Показывать статус активности</h4>
                            <p className="text-discord-text text-sm">Другие пользователи будут видеть, чем вы занимаетесь</p>
                          </div>
                          <Switch
                            checked={userSettings?.privacy?.showActivity ?? true}
                            onCheckedChange={(value) => handleSettingsChange('privacy', 'showActivity', value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-discord-sidebar/40 rounded-md p-4">
                      <h3 className="font-bold mb-4">Заблокированные пользователи</h3>
                      
                      <p className="text-discord-text mb-4">
                        У вас нет заблокированных пользователей.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Внешний вид */}
              {activeTab === "appearance" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Внешний вид</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-discord-sidebar/40 rounded-md p-4">
                      <h3 className="font-bold mb-4">Тема</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div 
                          className={`border-2 rounded-md p-3 cursor-pointer transition-all ${
                            userSettings?.theme === 'dark' ? 'border-[#5865F2]' : 'border-discord-hover hover:border-gray-500'
                          }`}
                          onClick={() => handleSettingsChange('', 'theme', 'dark')}
                        >
                          <div className="h-16 bg-discord-bg rounded-md mb-2"></div>
                          <div className="font-medium">Тёмная</div>
                        </div>
                        
                        <div 
                          className={`border-2 rounded-md p-3 cursor-pointer transition-all ${
                            userSettings?.theme === 'light' ? 'border-[#5865F2]' : 'border-discord-hover hover:border-gray-500'
                          }`}
                          onClick={() => handleSettingsChange('', 'theme', 'light')}
                        >
                          <div className="h-16 bg-gray-200 rounded-md mb-2"></div>
                          <div className="font-medium">Светлая</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-discord-sidebar/40 rounded-md p-4">
                      <h3 className="font-bold mb-4">Размер текста</h3>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-sm">Меньше</span>
                        <Slider
                          defaultValue={[16]}
                          max={24}
                          min={12}
                          step={1}
                          className="flex-1"
                          onValueChange={(value) => handleSettingsChange('appearance', 'fontSize', `${value[0]}px`)}
                        />
                        <span className="text-lg">Больше</span>
                      </div>
                    </div>
                    
                    <div className="bg-discord-sidebar/40 rounded-md p-4">
                      <h3 className="font-bold mb-4">Доступность</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Сатурация</h4>
                            <p className="text-discord-text text-sm">Настройте интенсивность цветов</p>
                          </div>
                          <div className="w-32">
                            <Slider
                              defaultValue={[100]}
                              max={200}
                              min={0}
                              step={1}
                              onValueChange={(value) => handleSettingsChange('appearance', 'accessibility', { ...userSettings?.appearance?.accessibility, saturation: value[0] })}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Контраст</h4>
                            <p className="text-discord-text text-sm">Настройте контрастность</p>
                          </div>
                          <div className="w-32">
                            <Slider
                              defaultValue={[100]}
                              max={200}
                              min={0}
                              step={1}
                              onValueChange={(value) => handleSettingsChange('appearance', 'accessibility', { ...userSettings?.appearance?.accessibility, contrast: value[0] })}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Уменьшенное движение</h4>
                            <p className="text-discord-text text-sm">Уменьшить анимацию и эффекты движения</p>
                          </div>
                          <Switch
                            checked={userSettings?.appearance?.accessibility?.motionReduction ?? false}
                            onCheckedChange={(value) => handleSettingsChange('appearance', 'accessibility', { ...userSettings?.appearance?.accessibility, motionReduction: value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Уведомления */}
              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Уведомления</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-discord-sidebar/40 rounded-md p-4">
                      <h3 className="font-bold mb-4">Настройки уведомлений</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Включить уведомления на рабочем столе</h4>
                          </div>
                          <Switch
                            checked={userSettings?.notifications?.desktop ?? true}
                            onCheckedChange={(value) => handleSettingsChange('notifications', 'desktop', value)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Включить звуки уведомлений</h4>
                          </div>
                          <Switch
                            checked={userSettings?.notifications?.sounds ?? true}
                            onCheckedChange={(value) => handleSettingsChange('notifications', 'sounds', value)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Уведомления для мобильных устройств</h4>
                          </div>
                          <Switch
                            checked={userSettings?.notifications?.mobile ?? true}
                            onCheckedChange={(value) => handleSettingsChange('notifications', 'mobile', value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-discord-sidebar/40 rounded-md p-4">
                      <h3 className="font-bold mb-4">Уведомления для серверов</h3>
                      
                      <p className="text-discord-text mb-2">
                        Настройки по умолчанию для всех серверов:
                      </p>
                      
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full bg-discord-bg border-discord-hover">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-discord-sidebar border-discord-hover">
                          <SelectItem value="all">Все сообщения</SelectItem>
                          <SelectItem value="mentions">Только @упоминания</SelectItem>
                          <SelectItem value="none">Отключить</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Язык */}
              {activeTab === "language" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Язык</h2>
                  
                  <div className="bg-discord-sidebar/40 rounded-md p-4">
                    <h3 className="font-bold mb-4">Язык интерфейса Discord</h3>
                    
                    <Select 
                      value={userSettings?.language || "ru"}
                      onValueChange={(value) => handleSettingsChange('', 'language', value)}
                    >
                      <SelectTrigger className="w-full bg-discord-bg border-discord-hover">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-discord-sidebar border-discord-hover">
                        <SelectItem value="ru">Русский</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {/* Discord Nitro */}
              {activeTab === "nitro" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Discord Nitro</h2>
                  
                  <div className="bg-gradient-to-r from-[#5865F2] to-[#7289da] rounded-lg p-8 mb-8 text-center text-white">
                    <div className="flex justify-center mb-4">
                      <Sparkles className="h-12 w-12" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      {user?.nitro ? "У вас активна подписка Discord Nitro" : "Откройте для себя Discord Nitro"}
                    </h3>
                    <p className="text-lg mb-6 max-w-2xl mx-auto">
                      {user?.nitro 
                        ? "Наслаждайтесь всеми премиум-функциями Discord, включая улучшенную загрузку файлов, баннер профиля и многое другое!" 
                        : "Получите доступ к эксклюзивным функциям и поддержите Discord. Сейчас действует акция с бесплатной подпиской!"}
                    </p>
                    
                    <Button 
                      size="lg" 
                      className={`px-8 py-6 text-lg ${user?.nitro ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-[#5865F2] hover:bg-gray-100'}`}
                      onClick={() => navigate("/nitro")}
                    >
                      {user?.nitro ? "Управлять подпиской" : "Получить Nitro бесплатно"}
                    </Button>
                  </div>
                  
                  {user?.nitro && (
                    <div className="bg-discord-sidebar/40 rounded-md p-4">
                      <h3 className="font-bold mb-4">Ваша подписка</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Discord Nitro</h4>
                            <p className="text-discord-text text-sm">Активна до 2025-06-01</p>
                          </div>
                          <Button 
                            variant="destructive"
                            onClick={toggleNitro}
                          >
                            Отменить
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Подписки */}
              {activeTab === "billing" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Подписки</h2>
                  
                  {user?.nitro ? (
                    <div className="bg-discord-sidebar/40 rounded-md p-4">
                      <h3 className="font-bold mb-4">Активные подписки</h3>
                      
                      <div className="flex items-center justify-between p-3 border border-discord-hover rounded-md">
                        <div className="flex items-center gap-4">
                          <Sparkles className="h-6 w-6 text-[#5865F2]" />
                          <div>
                            <h4 className="font-medium">Discord Nitro</h4>
                            <p className="text-discord-text text-sm">Активна до 2025-06-01</p>
                          </div>
                        </div>
                        <Button 
                          variant="destructive"
                          onClick={toggleNitro}
                        >
                          Отменить
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-discord-sidebar/40 rounded-md p-4 text-center py-10">
                      <div className="text-discord-text mb-4">
                        У вас нет активных подписок
                      </div>
                      <Button 
                        className="bg-[#5865F2] hover:bg-[#4752c4]"
                        onClick={() => navigate("/nitro")}
                      >
                        Получить Nitro
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;

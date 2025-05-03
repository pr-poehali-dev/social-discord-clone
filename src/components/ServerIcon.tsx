
import { cn } from "@/lib/utils";
import { Plus, Home } from "lucide-react";

interface ServerIconProps {
  name?: string;
  icon?: string;
  active?: boolean;
  isHome?: boolean;
  isAdd?: boolean;
  onClick?: () => void;
}

const ServerIcon = ({ name, icon, active, isHome, isAdd, onClick }: ServerIconProps) => {
  let firstLetter = name ? name[0] : "Д";

  return (
    <div className="relative group" onClick={onClick}>
      {active && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full" />
      )}
      
      <div 
        className={cn(
          "w-12 h-12 flex items-center justify-center rounded-full transition-all cursor-pointer mb-2",
          active ? "rounded-2xl bg-primary text-white" : "bg-discord-channel hover:rounded-2xl hover:bg-primary/80 text-white",
          isAdd && "bg-discord-channel hover:bg-discord-active text-discord-active hover:text-white"
        )}
        title={name || (isHome ? "Личные сообщения" : isAdd ? "Добавить сервер" : "Сервер")}
      >
        {isHome ? (
          <Home className="h-6 w-6" />
        ) : isAdd ? (
          <Plus className="h-7 w-7" />
        ) : icon ? (
          <img src={icon} alt={name} className="w-full h-full object-cover rounded-full" />
        ) : (
          <span className="text-lg font-semibold">{firstLetter}</span>
        )}
      </div>
    </div>
  );
};

export default ServerIcon;

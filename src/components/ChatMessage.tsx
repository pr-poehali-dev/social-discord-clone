
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  user: string;
  time: string;
  avatar: string;
  message: string;
}

const ChatMessage = ({ user, time, avatar, message }: ChatMessageProps) => {
  return (
    <div className="flex gap-4 group hover:bg-discord-hover -mx-4 px-4 py-2 rounded">
      <Avatar className="h-10 w-10 mt-0.5">
        <AvatarImage src={avatar} />
        <AvatarFallback>{user[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{user}</span>
          <span className="text-xs text-discord-text/50">{time}</span>
        </div>
        <div className="text-discord-text mt-1">{message}</div>
      </div>
    </div>
  );
};

export default ChatMessage;

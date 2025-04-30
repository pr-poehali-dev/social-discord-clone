
interface UserStatusProps {
  status: 'online' | 'idle' | 'dnd' | 'offline';
}

const UserStatus = ({ status }: UserStatusProps) => {
  const statusText = {
    online: 'в сети',
    idle: 'неактивен',
    dnd: 'не беспокоить',
    offline: 'не в сети'
  };
  
  const statusColor = {
    online: 'bg-green-500',
    idle: 'bg-yellow-500',
    dnd: 'bg-red-500',
    offline: 'bg-gray-500'
  };
  
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${statusColor[status]}`} />
      <span className="text-xs text-discord-text/70">{statusText[status]}</span>
    </div>
  );
};

export default UserStatus;

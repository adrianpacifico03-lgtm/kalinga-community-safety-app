import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-40 inline-flex items-center gap-2.5 rounded-xl bg-amber-600/95 text-white px-4 py-2.5 text-xs font-medium shadow-lg backdrop-blur-sm"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Offline Mode — Local checklist, contacts, and safety guides remain available.</span>
    </div>
  );
};

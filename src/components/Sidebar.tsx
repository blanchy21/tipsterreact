'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Bell, 
  Trophy, 
  MessageCircle, 
  Mail, 
  User, 
  Star, 
  PlusCircle 
} from 'lucide-react';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import SportsSubmenu from './SportsSubmenu';
import { SidebarItem as SidebarItemType } from '@/lib/types';
import { useNotifications } from '@/lib/contexts/NotificationsContext';

interface SidebarProps {
  selected: string;
  onSelect: (key: string) => void;
  onOpenPost: () => void;
  isLoaded: boolean;
  selectedSport: string;
  onSportSelect: (sport: string) => void;
}

const items: SidebarItemType[] = [
  { icon: Home, label: 'Home', key: 'home' },
  { icon: Bell, label: 'Notifications', key: 'notifications' },
  { icon: Star, label: 'Top Analysts', key: 'sport' },
  { icon: MessageCircle, label: 'Chat', key: 'chat' },
  { icon: Mail, label: 'Messages', key: 'messages' },
  { icon: User, label: 'Profile', key: 'profile' },
  { icon: Trophy, label: 'Sport', key: 'top' },
];

export default function Sidebar({ selected, onSelect, onOpenPost, isLoaded, selectedSport, onSportSelect }: SidebarProps) {
  const [showSportsSubmenu, setShowSportsSubmenu] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setShowSportsSubmenu(false);
      }
    };

    if (showSportsSubmenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSportsSubmenu]);
  return (
    <aside className={[
        "hidden md:flex md:flex-col shrink-0",
        "border-r border-white/5",
        "backdrop-blur",
        "px-3 py-4",
        "h-screen overflow-y-auto",
        "transition-all duration-700",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      ].join(' ')}
      style={{ width: '260px' }}
    >
      <div className="px-1 mb-4">
        <Logo />
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {items.map((item, idx) => (
          <div 
            key={item.key} 
            className={[
              "transition duration-700", 
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2", 
              `delay-[${idx * 40}ms]`,
              item.key === 'top' ? 'relative' : ''
            ].join(' ')}
          >
            <SidebarItem
              icon={item.icon}
              label={item.key === 'top' && selectedSport !== 'All Sports' ? `${item.label} (${selectedSport})` : item.label}
              active={selected === item.key}
              badge={item.key === 'notifications' ? unreadCount : undefined}
              onClick={() => {
                if (item.key === 'top') {
                  setShowSportsSubmenu(!showSportsSubmenu);
                } else {
                  onSelect(item.key);
                }
              }}
            />
            {item.key === 'top' && (
              <div ref={submenuRef} className="relative" style={{ position: 'relative', zIndex: 9999 }}>
                <SportsSubmenu
                  isOpen={showSportsSubmenu}
                  selectedSport={selectedSport}
                  onSportSelect={onSportSelect}
                  onClose={() => setShowSportsSubmenu(false)}
                />
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-3 pt-3 border-t border-white/5">
        <button
          onClick={onOpenPost}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 hover:text-sky-200 transition ring-1 ring-inset ring-sky-500/30 hover:ring-sky-500/40"
          title="Share Insight"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="font-medium">Share Insight</span>
        </button>
      </div>
    </aside>
  );
}

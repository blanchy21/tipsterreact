export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

export interface Post {
  id: string;
  user: User;
  sport: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
}

export interface Fixture {
  id: string;
  time: string;
  league: string;
  teams: string;
  market: string;
  odds: number;
}

export interface FollowingUser {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  winRate: number;
  following: boolean;
}

export interface TrendingItem {
  id: string;
  label: string;
  volume: number;
  delta: string;
}

import { LucideIcon } from 'lucide-react';

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  key: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'tip' | 'match_result' | 'system';
  title: string;
  message: string;
  user?: User;
  postId?: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  tips: boolean;
  matchResults: boolean;
  system: boolean;
}

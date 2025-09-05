export interface User {
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

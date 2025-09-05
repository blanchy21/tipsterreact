'use client';

import React from 'react';
import { Fixture, FollowingUser, Post } from '@/lib/types';
import FixturesCard from './FixturesCard';
import FollowingCard from './FollowingCard';
import TopArticlesCard from './TopArticlesCard';

interface RightSidebarProps {
  fixtures: Fixture[];
  following: FollowingUser[];
  onToggleFollow: (id: string) => void;
  posts: Post[];
  isLoaded: boolean;
}

export default function RightSidebar({ 
  fixtures, 
  following, 
  onToggleFollow, 
  posts, 
  isLoaded 
}: RightSidebarProps) {
  return (
    <aside className={[
        "hidden lg:flex lg:flex-col shrink-0",
        "px-4 py-4",
        "border-l border-white/5",
        "gap-6",
        "h-screen overflow-y-auto",
        "transition duration-700",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      ].join(' ')}
      style={{ width: '340px' }}
    >
      <FixturesCard fixtures={fixtures} />
      <FollowingCard list={following} onToggle={onToggleFollow} />
      <TopArticlesCard articles={posts} />
    </aside>
  );
}

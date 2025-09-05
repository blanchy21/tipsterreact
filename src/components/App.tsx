'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Post, FollowingUser } from '@/lib/types';
import { initialPosts, sampleFixtures, sampleFollowing, sampleTrending } from '@/lib/utils';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import PostModal from './PostModal';

export default function App() {
  const [selected, setSelected] = useState('home');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [following, setFollowing] = useState<FollowingUser[]>(sampleFollowing);
  const [showPost, setShowPost] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');

  useEffect(() => {
    // Load entrance state
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    
    // Filter by selected tab
    if (selected === 'top') {
      filtered = filtered.filter(post => post.likes >= 20);
    }
    
    // Filter by selected sport
    if (selectedSport !== 'All Sports') {
      filtered = filtered.filter((post: Post) => post.sport === selectedSport);
    }
    
    // Filter by search query
    if (query.trim()) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter((post: Post) =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.content.toLowerCase().includes(searchQuery) ||
        post.sport.toLowerCase().includes(searchQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
        post.user.name.toLowerCase().includes(searchQuery) ||
        post.user.handle.toLowerCase().includes(searchQuery)
      );
    }
    
    return filtered;
  }, [posts, selected, selectedSport, query]);

  const handleSubmitPost = (postData: Omit<Post, 'id' | 'user' | 'createdAt' | 'likes' | 'comments' | 'views'>) => {
    const newPost: Post = {
      id: 'p' + Math.random().toString(36).slice(2),
      user: { 
        name: 'You', 
        handle: '@you', 
        avatar: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=256&auto=format&fit=crop' 
      },
      ...postData,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 0
    };
    
    setPosts((prev: Post[]) => [newPost, ...prev]);
  };

  const toggleFollow = (id: string) => {
    setFollowing((prev: FollowingUser[]) => 
      prev.map((user: FollowingUser) => 
        user.id === id ? { ...user, following: !user.following } : user
      )
    );
  };

  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport);
    setSelected('top');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <MobileHeader 
        onOpenPost={() => setShowPost(true)} 
        onMenu={() => {}} 
        isLoaded={isLoaded} 
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selected={selected}
          onSelect={setSelected}
          onOpenPost={() => setShowPost(true)}
          isLoaded={isLoaded}
          selectedSport={selectedSport}
          onSportSelect={handleSportSelect}
        />

        <Feed
          posts={filteredPosts}
          isLoaded={isLoaded}
          query={query}
          onQueryChange={setQuery}
          selectedSport={selectedSport}
        />

        <RightSidebar
          fixtures={sampleFixtures}
          following={following}
          onToggleFollow={toggleFollow}
          trending={sampleTrending}
          isLoaded={isLoaded}
        />
      </div>

      <PostModal
        open={showPost}
        onClose={() => setShowPost(false)}
        onSubmit={handleSubmitPost}
      />
    </div>
  );
}

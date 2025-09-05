'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Post, FollowingUser } from '@/lib/types';
import { initialPosts, sampleFixtures, sampleFollowing, sampleTrending } from '@/lib/utils';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import PostModal from './PostModal';
import ProfilePage from './ProfilePage';
import MessagesPage from './MessagesPage';
import ChatPage from './ChatPage';
import NotificationsPage from './NotificationsPage';
import LandingPage from './LandingPage';
import { NotificationsProvider } from '@/lib/contexts/NotificationsContext';
import { useAuth } from '@/lib/hooks/useAuth';

export default function App() {
  const { user } = useAuth();
  const [selected, setSelected] = useState('home');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [following, setFollowing] = useState<FollowingUser[]>(sampleFollowing);
  const [showPost, setShowPost] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [showLandingPage, setShowLandingPage] = useState(false);

  useEffect(() => {
    // Check if user has seen landing page
    const hasSeenLandingPage = localStorage.getItem('hasSeenLandingPage');
    if (!hasSeenLandingPage && !user) {
      setShowLandingPage(true);
    }

    // Load entrance state
    const timer = setTimeout(() => {
      setIsLoaded(true);
      document.body.classList.add('loaded');
    }, 50);
    return () => clearTimeout(timer);
  }, [user]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    
    // Filter by selected tab
    if (selected === 'top') {
      filtered = filtered.filter(post => post.likes >= 20);
    } else if (selected === 'top-articles') {
      // Sort by views in descending order for top articles
      filtered = filtered.sort((a, b) => b.views - a.views);
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

  const handleSubmitPost = (postData: Omit<Post, 'id' | 'user' | 'createdAt' | 'likes' | 'comments' | 'views' | 'likedBy'>) => {
    const newPost: Post = {
      id: 'p' + Math.random().toString(36).slice(2),
      user: { 
        id: 'current-user',
        name: 'You', 
        handle: '@you', 
        avatar: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=256&auto=format&fit=crop' 
      },
      ...postData,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 0,
      likedBy: []
    };
    
    setPosts((prev: Post[]) => [newPost, ...prev]);
  };

  const handleLikeChange = (postId: string, newLikes: number, newLikedBy: string[]) => {
    setPosts((prev: Post[]) => 
      prev.map((post: Post) => 
        post.id === postId 
          ? { ...post, likes: newLikes, likedBy: newLikedBy }
          : post
      )
    );
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

  const handleGetStarted = () => {
    localStorage.setItem('hasSeenLandingPage', 'true');
    setShowLandingPage(false);
    // If user is not authenticated, you might want to show sign in modal here
  };

  const handleShowLandingPage = () => {
    setShowLandingPage(true);
  };

  // Show landing page for new users
  if (showLandingPage) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <NotificationsProvider>
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
            onShowLandingPage={handleShowLandingPage}
          />

          {selected === 'profile' ? (
            <div className="flex-1 overflow-y-auto">
              <ProfilePage />
            </div>
          ) : selected === 'messages' ? (
            <div className="flex-1">
              <MessagesPage />
            </div>
          ) : selected === 'chat' ? (
            <div className="flex-1">
              <ChatPage />
            </div>
          ) : selected === 'notifications' ? (
            <div className="flex-1">
              <NotificationsPage />
            </div>
          ) : (
            <>
              <Feed
                posts={filteredPosts}
                isLoaded={isLoaded}
                query={query}
                onQueryChange={setQuery}
                selectedSport={selectedSport}
                selected={selected}
                onLikeChange={handleLikeChange}
              />

              <RightSidebar
                fixtures={sampleFixtures}
                following={following}
                onToggleFollow={toggleFollow}
                posts={posts}
                isLoaded={isLoaded}
              />
            </>
          )}
        </div>

        <PostModal
          open={showPost}
          onClose={() => setShowPost(false)}
          onSubmit={handleSubmitPost}
          selectedSport={selectedSport}
        />
      </div>
    </NotificationsProvider>
  );
}

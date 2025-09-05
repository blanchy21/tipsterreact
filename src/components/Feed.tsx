'use client';

import React from 'react';
import { Inbox } from 'lucide-react';
import { Post } from '@/lib/types';
import PostCard from './PostCard';
import FeedHeader from './FeedHeader';

interface FeedProps {
  posts: Post[];
  isLoaded: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  selectedSport?: string;
  selected?: string;
  onLikeChange: (postId: string, newLikes: number, newLikedBy: string[]) => void;
}

export default function Feed({ posts, isLoaded, query, onQueryChange, selectedSport, selected, onLikeChange }: FeedProps) {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <FeedHeader isLoaded={isLoaded} query={query} onQueryChange={onQueryChange} selected={selected} />
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 md:space-y-5">
        {posts.map((post, idx) => (
          <div 
            key={post.id} 
            className={[
              "transition duration-700", 
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3", 
              `delay-[${Math.min(idx * 60, 400)}ms]`
            ].join(' ')}
          >
            <PostCard post={post} onLikeChange={onLikeChange} />
          </div>
        ))}
        {posts.length === 0 && (
          <div className="h-64 grid place-items-center">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-white/5 ring-1 ring-white/10 grid place-items-center mb-3">
                <Inbox className="w-5 h-5 text-slate-400" />
              </div>
              {selectedSport && selectedSport !== 'All Sports' ? (
                <>
                  <p className="text-slate-300 font-medium">No {selectedSport} discussion found</p>
                  <p className="text-slate-500 text-sm">Try selecting a different sport or be the first to share a {selectedSport} discussion.</p>
                </>
              ) : (
                <>
                  <p className="text-slate-300 font-medium">No discussion yet</p>
                  <p className="text-slate-500 text-sm">Be the first to share a discussion.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

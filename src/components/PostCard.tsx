'use client';

import React from 'react';
import { MoreHorizontal, ThumbsUp, MessageCircle, Eye, Hash } from 'lucide-react';
import { Post } from '@/lib/types';
import { timeAgo } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition ring-1 ring-white/5 hover:ring-white/10 p-4 md:p-5">
      <div className="flex items-start gap-3">
        <img 
          src={post.user.avatar} 
          alt={post.user.name} 
          className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10" 
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-slate-100 font-medium truncate">{post.user.name}</span>
              <span className="text-slate-500 text-sm truncate">{post.user.handle}</span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-500 text-xs">{timeAgo(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-sky-300/90 bg-sky-500/10 ring-1 ring-sky-500/20 px-2 py-1 rounded-md">
                {post.sport}
              </span>
              <button className="p-2 rounded-md hover:bg-white/5 transition ring-1 ring-transparent hover:ring-white/10">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            <h3 className="text-slate-100 font-semibold text-lg leading-tight">
              {post.title}
            </h3>
            
            <p className="text-sm text-slate-300/90 leading-relaxed">
              {post.content}
            </p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/5 ring-1 ring-white/10 px-2.5 py-1.5"
                  >
                    <Hash className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-300 text-sm">{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <button className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition rounded-md px-2 py-1.5 hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">{post.likes}</span>
            </button>
            <button className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition rounded-md px-2 py-1.5 hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.comments}</span>
            </button>
            <div className="inline-flex items-center gap-2 text-slate-400">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{post.views}</span>
            </div>
            <div className="ml-auto inline-flex items-center gap-2 text-xs text-slate-500">
              <span>Community Discussion</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

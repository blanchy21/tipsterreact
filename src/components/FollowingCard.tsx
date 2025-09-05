'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { FollowingUser } from '@/lib/types';

interface FollowingCardProps {
  list: FollowingUser[];
  onToggle: (id: string) => void;
}

export default function FollowingCard({ list, onToggle }: FollowingCardProps) {
  return (
    <section className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden flex flex-col max-h-80">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 flex-shrink-0">
        <Users className="w-4 h-4 text-slate-300" />
        <h3 className="text-slate-100 font-semibold tracking-tight">Following</h3>
      </div>
      <div className="divide-y divide-white/5 overflow-y-auto flex-1">
        {list.map((user) => (
          <div key={user.id} className="px-4 py-3 flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-200 truncate">{user.name}</span>
                <span className="text-xs text-slate-500 truncate">{user.handle}</span>
              </div>
              <div className="text-xs text-emerald-300/90">WR {user.winRate}%</div>
            </div>
            <button
              onClick={() => onToggle(user.id)}
              className={[
                "text-xs rounded-md px-2.5 py-1.5 transition ring-1 flex-shrink-0",
                user.following
                  ? "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
                  : "bg-sky-500/20 text-sky-300 ring-sky-500/30 hover:bg-sky-500/30 hover:text-sky-200 hover:ring-sky-500/40"
              ].join(' ')}
            >
              {user.following ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
        {list.length === 0 && (
          <div className="px-4 py-8 text-center text-slate-500 text-sm">
            No users to follow yet
          </div>
        )}
      </div>
    </section>
  );
}

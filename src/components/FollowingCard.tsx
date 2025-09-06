'use client';

import React from 'react';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { User } from '@/lib/types';
import { normalizeImageUrl } from '@/lib/imageUtils';

interface FollowingCardProps {
  list: User[];
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
        {list.slice(0, 5).map((user) => (
          <div key={user.id} className="px-4 py-3 flex items-center gap-3">
            <Image 
              src={normalizeImageUrl(user.avatar)} 
              alt={user.name} 
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0" 
              style={{ width: 'auto', height: 'auto' }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-200 truncate">{user.name}</span>
                <span className="text-xs text-slate-500 truncate">{user.handle}</span>
              </div>
              <div className="text-xs text-emerald-300/90">{user.followersCount || 0} followers</div>
            </div>
            <button
              onClick={() => onToggle(user.id)}
              className="text-xs rounded-md px-2.5 py-1.5 transition ring-1 flex-shrink-0 bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
            >
              Following
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
'use client';

import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Fixture } from '@/lib/types';

interface FixturesCardProps {
  fixtures: Fixture[];
}

export default function FixturesCard({ fixtures }: FixturesCardProps) {
  return (
    <section className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden flex flex-col max-h-80">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-slate-300" />
          <h3 className="text-slate-100 font-semibold tracking-tight">Fixtures</h3>
        </div>
        <button className="text-xs text-slate-400 hover:text-slate-200 rounded-md px-2 py-1 hover:bg-white/5 transition">
          All
        </button>
      </div>
      <div className="divide-y divide-white/5 overflow-y-auto flex-1">
        {fixtures.map((fixture) => (
          <div key={fixture.id} className="px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition">
            <div className="w-12 text-xs text-slate-400 flex-shrink-0">{fixture.time}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200 truncate">{fixture.teams}</div>
              <div className="text-xs text-slate-500">{fixture.league}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-slate-300 bg-white/5 ring-1 ring-white/10 px-2 py-1 rounded-md">
                {fixture.market}
              </span>
              <span className="text-xs text-emerald-300 bg-emerald-500/10 ring-1 ring-emerald-500/20 px-2 py-1 rounded-md">
                {fixture.odds}
              </span>
            </div>
          </div>
        ))}
        {fixtures.length === 0 && (
          <div className="px-4 py-8 text-center text-slate-500 text-sm">
            No fixtures available
          </div>
        )}
      </div>
    </section>
  );
}

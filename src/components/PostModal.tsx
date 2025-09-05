'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, X, ChevronDown, Send } from 'lucide-react';
import { Post } from '@/lib/types';

interface PostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<Post, 'id' | 'user' | 'createdAt' | 'likes' | 'comments' | 'views'>) => void;
}

const sports = [
  'Football',
  'Basketball',
  'Tennis',
  'Baseball',
  'Hockey',
  'Soccer',
  'Cricket',
  'Golf',
  'Boxing',
  'MMA',
  'Esports',
  'Rugby',
  'Volleyball',
  'Badminton',
  'Table Tennis',
  'Snooker',
  'Darts',
  'Cycling',
  'Formula 1',
  'MotoGP',
  'NFL',
  'NBA',
  'MLB',
  'NHL'
];

export default function PostModal({ open, onClose, onSubmit }: PostModalProps) {
  const [sport, setSport] = useState('Football');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [showSportDropdown, setShowSportDropdown] = useState(false);

  useEffect(() => {
    if (open) {
      setSport('Football');
      setTitle('');
      setContent('');
      setTags('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    onSubmit({
      sport,
      title: title.trim(),
      content: content.trim(),
      tags: tagArray
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Create Discussion</h2>
              <p className="text-sm text-slate-400">Share your thoughts with the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Sport
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSportDropdown(!showSportDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-slate-200">{sport}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showSportDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSportDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                    {sports.map((sportOption) => (
                      <button
                        key={sportOption}
                        type="button"
                        onClick={() => {
                          setSport(sportOption);
                          setShowSportDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors text-slate-200"
                      >
                        {sportOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your discussion about?"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-slate-200 placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, insights, or questions..."
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-slate-200 placeholder:text-slate-500 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., football, analysis, premier-league"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-slate-200 placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Post Discussion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

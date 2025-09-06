'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Users, 
  UserPlus, 
  UserMinus, 
  Check, 
  Loader2,
  Filter,
  X
} from 'lucide-react';
import { User } from '@/lib/types';
import { useFollowing } from '@/lib/contexts/FollowingContext';
import { useAuth } from '@/lib/hooks/useAuth';
import { normalizeImageUrl } from '@/lib/imageUtils';
import FollowButton from './FollowButton';

interface FollowingPageProps {
  initialTab?: 'following' | 'followers' | 'suggestions' | 'search';
}

const FollowingPage: React.FC<FollowingPageProps> = ({ initialTab = 'following' }) => {
  const { 
    following, 
    followers, 
    suggestions, 
    loading, 
    searchUsers, 
    refreshFollowing, 
    refreshFollowers, 
    refreshSuggestions 
  } = useFollowing();
  
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState<'all' | 'verified' | 'sports'>('all');

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const getFilteredUsers = (users: User[]) => {
    if (filter === 'verified') {
      return users.filter(user => user.isVerified);
    }
    if (filter === 'sports') {
      return users.filter(user => user.specializations && user.specializations.length > 0);
    }
    return users;
  };

  const UserCard: React.FC<{ user: User; showFollowButton?: boolean }> = ({ 
    user, 
    showFollowButton = true 
  }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Image
            src={normalizeImageUrl(user.avatar)}
            alt={user.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
            style={{ width: 'auto', height: 'auto' }}
          />
          {user.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate">{user.name}</h3>
            {user.isVerified && (
              <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-neutral-400 truncate">{user.handle}</p>
          {user.bio && (
            <p className="text-sm text-neutral-300 mt-1 line-clamp-2">{user.bio}</p>
          )}
          {user.specializations && user.specializations.length > 0 && (
            <div className="flex gap-1 mt-2">
              {user.specializations.slice(0, 2).map((sport) => (
                <span
                  key={sport}
                  className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full"
                >
                  {sport}
                </span>
              ))}
              {user.specializations.length > 2 && (
                <span className="text-xs px-2 py-1 bg-neutral-500/20 text-neutral-400 rounded-full">
                  +{user.specializations.length - 2}
                </span>
              )}
            </div>
          )}
          <div className="flex gap-4 mt-2 text-xs text-neutral-500">
            <span>{user.followersCount} followers</span>
            <span>{user.followingCount} following</span>
          </div>
        </div>
      </div>
      {showFollowButton && (
        <FollowButton 
          targetUser={user} 
          variant="compact"
          onFollowChange={() => {
            if (activeTab === 'following') {
              refreshFollowing();
            } else if (activeTab === 'suggestions') {
              refreshSuggestions();
            }
          }}
        />
      )}
    </div>
  );

  const tabs = [
    { key: 'following', label: 'Following', count: following.length },
    { key: 'followers', label: 'Followers', count: followers.length },
    { key: 'suggestions', label: 'Suggestions', count: suggestions.length },
    { key: 'search', label: 'Search', count: searchResults.length }
  ];

  const renderContent = () => {
    if (activeTab === 'search') {
      return (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 animate-spin" />
            )}
          </div>
          
          {searchQuery && (
            <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
              <span>{searchResults.length} results for "{searchQuery}"</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {getFilteredUsers(searchResults).map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-400">No users found</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-400">Search for users to follow</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'following') {
      const filteredFollowing = getFilteredUsers(following);
      return (
        <div className="space-y-4">
          {filteredFollowing.length > 0 ? (
            <div className="space-y-3">
              {filteredFollowing.map((user) => (
                <UserCard key={user.id} user={user} showFollowButton={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-400">You're not following anyone yet</p>
              <p className="text-sm text-neutral-500 mt-2">Discover users to follow in the Suggestions tab</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'followers') {
      const filteredFollowers = getFilteredUsers(followers);
      return (
        <div className="space-y-4">
          {filteredFollowers.length > 0 ? (
            <div className="space-y-3">
              {filteredFollowers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-400">No followers yet</p>
              <p className="text-sm text-neutral-500 mt-2">Start posting to gain followers</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'suggestions') {
      const filteredSuggestions = getFilteredUsers(suggestions);
      return (
        <div className="space-y-4">
          {filteredSuggestions.length > 0 ? (
            <div className="space-y-3">
              {filteredSuggestions.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserPlus className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-400">No suggestions available</p>
              <p className="text-sm text-neutral-500 mt-2">Try searching for users instead</p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 to-[#2c1376]/70 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">People</h1>
          <p className="text-neutral-400">Discover and connect with sports enthusiasts</p>
          
          {/* Debug Info */}
          {user && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">Debug Info</h3>
              <div className="text-xs text-blue-300 space-y-1">
                <p>User ID: {user.uid}</p>
                <p>Following: {following.length}</p>
                <p>Followers: {followers.length}</p>
                <p>Suggestions: {suggestions.length}</p>
                <p>Loading: {loading ? 'Yes' : 'No'}</p>
              </div>
              <button
                onClick={refreshSuggestions}
                className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
              >
                Refresh Suggestions
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.key 
                    ? 'bg-white/20' 
                    : 'bg-neutral-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        {activeTab !== 'search' && (
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-neutral-400" />
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'verified', label: 'Verified' },
                { key: 'sports', label: 'Sports' }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    filter === filterOption.key
                      ? 'bg-blue-500 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default FollowingPage;

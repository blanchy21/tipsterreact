// Utility function for time ago
export function timeAgo(date: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'w', seconds: 604800 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
    { label: 's', seconds: 1 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) return `${count}${interval.label}`;
  }
  return 'now';
}

// Sample data
export const initialPosts = [
  {
    id: 'p1',
    user: { 
      name: 'Alex Morgan', 
      handle: '@alexm', 
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=256&auto=format&fit=crop' 
    },
    sport: 'Football',
    title: 'Arsenal vs Man United: Key Matchup Analysis',
    content: 'This is going to be an incredible match! Arsenal\'s home form has been exceptional this season, but Man United\'s counter-attacking style could cause problems. The midfield battle between Rice and Casemiro will be crucial.',
    tags: ['arsenal', 'man-united', 'premier-league', 'analysis'],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes: 45,
    comments: 12,
    views: 234
  },
  {
    id: 'p2',
    user: { 
      name: 'Jordan Lee', 
      handle: '@jordlee', 
      avatar: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=256&auto=format&fit=crop' 
    },
    sport: 'Basketball',
    title: 'Lakers vs Warriors: LeBron vs Curry Rivalry Continues',
    content: 'The greatest rivalry in modern basketball continues! LeBron and Curry facing off once again. The Warriors\' small ball lineup vs Lakers\' size advantage - this tactical battle will be fascinating to watch.',
    tags: ['lakers', 'warriors', 'nba', 'rivalry'],
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likes: 38,
    comments: 8,
    views: 189
  },
  {
    id: 'p3',
    user: { 
      name: 'Samir Khan', 
      handle: '@samk', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop' 
    },
    sport: 'Tennis',
    title: 'Djokovic vs Medvedev: Experience vs Youth',
    content: 'Djokovic\'s experience in big matches vs Medvedev\'s recent form. The Serbian\'s mental toughness in crucial moments could be the deciding factor, but Medvedev\'s improved serve and court coverage makes this unpredictable.',
    tags: ['djokovic', 'medvedev', 'tennis', 'grand-slam'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    likes: 52,
    comments: 15,
    views: 298
  }
];

export const sampleFixtures = [
  { id: 'f1', time: '19:45', league: 'EPL', teams: 'Liverpool vs Newcastle', market: 'O/U 2.5', odds: 1.90 },
  { id: 'f2', time: '20:00', league: 'UCL', teams: 'PSG vs Milan', market: 'PSG -0.5', odds: 1.88 },
  { id: 'f3', time: '21:00', league: 'NBA', teams: 'Celtics @ Heat', market: 'Heat +3.5', odds: 1.92 },
  { id: 'f4', time: '21:30', league: 'ATP', teams: 'Sinner vs Zverev', market: 'Over 23.5', odds: 1.85 },
];

export const sampleFollowing = [
  { 
    id: 'u1', 
    name: 'Mia Park', 
    handle: '@miap', 
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=256&auto=format&fit=crop', 
    winRate: 64, 
    following: true 
  },
  { 
    id: 'u2', 
    name: 'Chris Young', 
    handle: '@cyoung', 
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=256&auto=format&fit=crop', 
    winRate: 58, 
    following: false 
  },
  { 
    id: 'u3', 
    name: 'Ivy Chen', 
    handle: '@ivy', 
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=256&auto=format&fit=crop', 
    winRate: 71, 
    following: true 
  },
  { 
    id: 'u4', 
    name: 'Diego Ruiz', 
    handle: '@druiz', 
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop', 
    winRate: 66, 
    following: false 
  },
];

export const sampleTrending = [
  { id: 'tr1', label: 'Arsenal vs Man United', volume: 1234, delta: '+12%' },
  { id: 'tr2', label: 'Lakers vs Warriors', volume: 980, delta: '+8%' },
  { id: 'tr3', label: 'Djokovic vs Medvedev', volume: 876, delta: '+5%' },
  { id: 'tr4', label: 'Real Madrid vs Barcelona', volume: 654, delta: '+3%' },
  { id: 'tr5', label: 'Celtics vs Heat', volume: 432, delta: '+2%' },
];

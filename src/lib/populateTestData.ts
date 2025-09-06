import { 
  addDocument, 
  updateDocument, 
  getDocuments,
  followUser,
  unfollowUser 
} from './firebase/firebaseUtils';
import { normalizeImageUrl } from './imageUtils';

// Test users data
const testUsers = [
  {
    displayName: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    photoURL: normalizeImageUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face'),
    bio: 'Professional football analyst with 10+ years experience. Specializing in Premier League and Champions League.',
    handle: '@alexthompson',
    specializations: ['Football', 'Premier League', 'Champions League'],
    location: 'London, UK',
    website: 'https://alexthompson.com',
    socialMedia: {
      twitter: 'alexthompson',
      instagram: 'alexthompson_football'
    },
    isVerified: true,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date()
  },
  {
    displayName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    photoURL: normalizeImageUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face'),
    bio: 'Basketball expert and former WNBA player. Now providing analysis and insights.',
    handle: '@sarahjohnson',
    specializations: ['Basketball', 'WNBA', 'NBA'],
    location: 'Los Angeles, CA',
    website: 'https://sarahjohnson.com',
    socialMedia: {
      twitter: 'sarahjohnson_bb',
      instagram: 'sarahjohnson_basketball'
    },
    isVerified: true,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date()
  },
  {
    displayName: 'Mike Rodriguez',
    email: 'mike.rodriguez@example.com',
    photoURL: normalizeImageUrl('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'),
    bio: 'Tennis coach and analyst. Former ATP player with deep insights into the game.',
    handle: '@mikerodriguez',
    specializations: ['Tennis', 'ATP', 'WTA'],
    location: 'Miami, FL',
    website: 'https://mikerodriguez.com',
    socialMedia: {
      twitter: 'mikerodriguez_tennis',
      instagram: 'mikerodriguez_tennis'
    },
    isVerified: false,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date()
  },
  {
    displayName: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    photoURL: normalizeImageUrl('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=96&h=96&fit=crop&crop=face'),
    bio: 'Cricket analyst and former international player. Expert in all formats of the game.',
    handle: '@emmawilson',
    specializations: ['Cricket', 'Test Cricket', 'T20'],
    location: 'Melbourne, Australia',
    website: 'https://emmawilson.com',
    socialMedia: {
      twitter: 'emmawilson_cricket',
      instagram: 'emmawilson_cricket'
    },
    isVerified: true,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date()
  },
  {
    displayName: 'David Chen',
    email: 'david.chen@example.com',
    photoURL: normalizeImageUrl('https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=96&h=96&fit=crop&crop=face'),
    bio: 'Golf instructor and course designer. PGA certified with expertise in course strategy.',
    handle: '@davidchen',
    specializations: ['Golf', 'PGA', 'Course Design'],
    location: 'Augusta, GA',
    website: 'https://davidchen.com',
    socialMedia: {
      twitter: 'davidchen_golf',
      instagram: 'davidchen_golf'
    },
    isVerified: false,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date()
  },
  {
    displayName: 'Lisa Martinez',
    email: 'lisa.martinez@example.com',
    photoURL: normalizeImageUrl('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=96&h=96&fit=crop&crop=face'),
    bio: 'Horse racing expert and handicapper. 15+ years of experience in thoroughbred racing.',
    handle: '@lisamartinez',
    specializations: ['Horse Racing', 'Thoroughbred', 'Handicapping'],
    location: 'Lexington, KY',
    website: 'https://lisamartinez.com',
    socialMedia: {
      twitter: 'lisamartinez_racing',
      instagram: 'lisamartinez_racing'
    },
    isVerified: true,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date()
  }
];

// Test posts data
const testPosts = [
  {
    user: {
      id: 'test-user-1',
      name: 'Alex Thompson',
      handle: '@alexthompson',
      avatar: normalizeImageUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face')
    },
    sport: 'Football',
    title: 'Arsenal vs Chelsea: Tactical Analysis',
    content: 'This London derby promises to be a tactical masterclass. Arsenal\'s high press against Chelsea\'s counter-attacking style will be fascinating to watch. Key battles: Rice vs Enzo, Saka vs Chilwell.',
    tags: ['arsenal', 'chelsea', 'premier-league', 'tactical-analysis'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 0,
    comments: 0,
    views: 0,
    likedBy: []
  },
  {
    user: {
      id: 'test-user-2',
      name: 'Sarah Johnson',
      handle: '@sarahjohnson',
      avatar: normalizeImageUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face')
    },
    sport: 'Basketball',
    title: 'Lakers vs Warriors: Key Matchups',
    content: 'The battle of the superstars continues. LeBron vs Curry in what could be their final playoff meeting. The Lakers\' size advantage vs Warriors\' shooting will decide this series.',
    tags: ['lakers', 'warriors', 'nba', 'playoffs'],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 0,
    comments: 0,
    views: 0,
    likedBy: []
  },
  {
    user: {
      id: 'test-user-3',
      name: 'Mike Rodriguez',
      handle: '@mikerodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'
    },
    sport: 'Tennis',
    title: 'Djokovic vs Medvedev: French Open Preview',
    content: 'The clay court specialist vs the hard court master. Djokovic\'s experience vs Medvedev\'s power. This could be the match of the tournament.',
    tags: ['djokovic', 'medvedev', 'french-open', 'tennis'],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    likes: 0,
    comments: 0,
    views: 0,
    likedBy: []
  }
];

export const populateTestData = async () => {
  try {
    console.log('Starting to populate test data...');

    // Add test users
    const userIds: string[] = [];
    for (let i = 0; i < testUsers.length; i++) {
      const userData = testUsers[i];
      const docRef = await addDocument('users', userData);
      userIds.push(docRef.id);
      console.log(`Added user: ${userData.displayName} with ID: ${docRef.id}`);
    }

    // Add test posts
    for (let i = 0; i < testPosts.length; i++) {
      const postData = {
        ...testPosts[i],
        user: {
          ...testPosts[i].user,
          id: userIds[i] // Use the actual user ID from Firebase
        }
      };
      const docRef = await addDocument('posts', postData);
      console.log(`Added post: ${postData.title} with ID: ${docRef.id}`);
    }

    // Create some following relationships
    if (userIds.length >= 3) {
      // User 0 follows users 1, 2, 3
      await followUser(userIds[0], userIds[1]);
      await followUser(userIds[0], userIds[2]);
      await followUser(userIds[0], userIds[3]);
      
      // User 1 follows users 0, 2
      await followUser(userIds[1], userIds[0]);
      await followUser(userIds[1], userIds[2]);
      
      // User 2 follows users 0, 1, 4
      await followUser(userIds[2], userIds[0]);
      await followUser(userIds[2], userIds[1]);
      await followUser(userIds[2], userIds[4]);
      
      console.log('Created following relationships');
    }

    console.log('Test data population completed successfully!');
    return { success: true, userIds };
  } catch (error) {
    console.error('Error populating test data:', error);
    return { success: false, error };
  }
};

export const clearTestData = async () => {
  try {
    console.log('Clearing test data...');
    
    // Get all users and posts
    const users = await getDocuments('users');
    const posts = await getDocuments('posts');
    
    // Delete all users
    for (const user of users) {
      await updateDocument('users', user.id, { deleted: true });
    }
    
    // Delete all posts
    for (const post of posts) {
      await updateDocument('posts', post.id, { deleted: true });
    }
    
    console.log('Test data cleared successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error clearing test data:', error);
    return { success: false, error };
  }
};

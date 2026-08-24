import type { Conversation, ExploreItem, NotificationItem, Post, Reel, Story, Suggestion, UserProfile } from '../types/social'

export const demoUser: UserProfile = {
  id: 'user-riya',
  name: 'Riya Sharma',
  username: 'riyasharma',
  email: 'riya.sharma@thapar.edu',
  avatar: '/images/riya.jpg',
  bio: 'CSE ’27 · caffeine, code and campus sunsets ✨',
  branch: 'Computer Science',
  year: 'Third year',
  followers: 1248,
  following: 486,
}

export const people: UserProfile[] = [
  demoUser,
  { id: 'aarav', name: 'Aarav Mehta', username: 'aarav.jpg', email: 'aarav@thapar.edu', avatar: '/images/aarav.jpg', bio: 'Mechanical · football', branch: 'Mechanical', year: 'Second year', followers: 892, following: 410 },
  { id: 'meher', name: 'Meher Kaur', username: 'meherkaur', email: 'meher@thapar.edu', avatar: '/images/meher.jpg', bio: 'Design and photography', branch: 'Electronics', year: 'Third year', followers: 1532, following: 620 },
  { id: 'dev', name: 'Dev Malhotra', username: 'devmalhotra', email: 'dev@thapar.edu', avatar: '/images/dev.jpg', bio: 'DebSoc · public speaking', branch: 'Computer Science', year: 'Final year', followers: 734, following: 392 },
  { id: 'arjun', name: 'Arjun Singh', username: 'arjun.s', email: 'arjun@thapar.edu', avatar: '/images/arjun.jpg', bio: 'Basketball and bad jokes', branch: 'Civil', year: 'Second year', followers: 620, following: 480 },
  { id: 'simran', name: 'Simran Kaur', username: 'simrank', email: 'simran@thapar.edu', avatar: '/images/simran.jpg', bio: 'Music society', branch: 'Biotechnology', year: 'Third year', followers: 1104, following: 505 },
]

export const stories: Story[] = [
  { name: 'Your story', image: demoUser.avatar, mine: true },
  { name: 'aarav.jpg', image: '/images/aarav.jpg' },
  { name: 'meherkaur', image: '/images/meher.jpg' },
  { name: 'devmalhotra', image: '/images/dev.jpg' },
  { name: 'arjun.s', image: '/images/arjun.jpg' },
  { name: 'simrank', image: '/images/simran.jpg' },
]

export const posts: Post[] = [
  { id: 1, author: 'Thapar Photography Club', handle: 'tiet.photography', avatar: '/images/dev.jpg', image: '/images/campus.jpg', place: 'Main Auditorium', time: '18 min', caption: 'Golden hour found its way into campus today. Some evenings deserve a permanent spot on the feed.', likes: 1284, comments: 46, tags: ['#ThaparDiaries', '#GoldenHour'], featured: true },
  { id: 2, author: 'Naina Kapoor', handle: 'nainak', avatar: '/images/naina.jpg', image: '/images/friends.jpg', place: 'G Block Lawns', time: '1 hr', caption: 'The group project finally escaped the Google Doc. Demo day, here we come 🚀', likes: 692, comments: 31, tags: ['#ProjectWeek', '#CSED'] },
  { id: 3, author: 'Saturnalia TIET', handle: 'saturnalia.tiet', avatar: '/images/arjun.jpg', image: '/images/event.jpg', place: 'Student Activity Centre', time: '3 hr', caption: 'Practice, people, and one very loud evening. The campus countdown has officially started.', likes: 2147, comments: 88, tags: ['#Saturnalia', '#CampusLife'], featured: true },
]

export const suggestions: Suggestion[] = [
  { name: 'Kabir Anand', handle: '@kabir.a', image: '/images/kabir.jpg' },
  { name: 'Ananya Mehta', handle: '@ananyam', image: '/images/ananya.jpg' },
  { name: 'Simran Kaur', handle: '@simrank', image: '/images/simran.jpg' },
]

export const exploreItems: ExploreItem[] = [
  { id: 1, image: '/images/campus.jpg', likes: 1284, comments: 46 },
  { id: 2, image: '/images/sports.jpg', likes: 734, comments: 28, video: true },
  { id: 3, image: '/images/friends-2.jpg', likes: 985, comments: 54 },
  { id: 4, image: '/images/coding.jpg', likes: 612, comments: 19 },
  { id: 5, image: '/images/event.jpg', likes: 2147, comments: 88, video: true },
  { id: 6, image: '/images/library.jpg', likes: 458, comments: 12 },
  { id: 7, image: '/images/laptop.jpg', likes: 834, comments: 35 },
  { id: 8, image: '/images/team.jpg', likes: 1102, comments: 62 },
  { id: 9, image: '/images/workspace.jpg', likes: 389, comments: 14 },
  { id: 10, image: '/images/friends.jpg', likes: 692, comments: 31 },
  { id: 11, image: '/images/campus.jpg', likes: 1520, comments: 74, video: true },
  { id: 12, image: '/images/sports.jpg', likes: 921, comments: 40 },
]

export const reels: Reel[] = [
  { id: 1, creator: 'saturnalia.tiet', avatar: '/images/arjun.jpg', image: '/images/event.jpg', caption: 'POV: the fest preparations finally begin 🔥', likes: '12.4K', comments: '318', audio: 'Original audio · Saturnalia TIET' },
  { id: 2, creator: 'arjun.s', avatar: '/images/arjun.jpg', image: '/images/sports.jpg', caption: 'Last shot decides the match.', likes: '8,942', comments: '146', audio: 'Campus courts · Original audio' },
  { id: 3, creator: 'codechef.tiet', avatar: '/images/rohan.jpg', image: '/images/coding.jpg', caption: 'When the code runs one minute before submission.', likes: '6,201', comments: '204', audio: 'Late night lab sounds' },
]

export const conversations: Conversation[] = [
  { id: 1, name: 'Meher Kaur', username: 'meherkaur', avatar: '/images/meher.jpg', lastMessage: 'See you near the library!', time: '2m', unread: true, messages: [{ id: 1, text: 'Are you coming to the photo walk?', mine: false, time: '4:18 PM' }, { id: 2, text: 'Yes! I’ll meet you at the library gate.', mine: true, time: '4:19 PM' }, { id: 3, text: 'See you near the library!', mine: false, time: '4:20 PM' }] },
  { id: 2, name: 'Project Crew', username: 'project.crew', avatar: '/images/team.jpg', lastMessage: 'Naina sent a photo', time: '18m', messages: [{ id: 1, text: 'The final slides are in the drive.', mine: false, time: '3:40 PM' }, { id: 2, text: 'I’ll review them tonight.', mine: true, time: '3:44 PM' }] },
  { id: 3, name: 'Aarav Mehta', username: 'aarav.jpg', avatar: '/images/aarav.jpg', lastMessage: 'Match at 6?', time: '1h', messages: [{ id: 1, text: 'Match at 6?', mine: false, time: '2:10 PM' }] },
  { id: 4, name: 'Simran Kaur', username: 'simrank', avatar: '/images/simran.jpg', lastMessage: 'That reel was too accurate 😂', time: '3h', messages: [{ id: 1, text: 'That reel was too accurate 😂', mine: false, time: '12:32 PM' }] },
]

export const notifications: NotificationItem[] = [
  { id: 1, user: 'meherkaur', avatar: '/images/meher.jpg', text: 'liked your post.', time: '2m', image: '/images/campus.jpg' },
  { id: 2, user: 'kabir.a', avatar: '/images/kabir.jpg', text: 'started following you.', time: '18m', follow: true },
  { id: 3, user: 'saturnalia.tiet', avatar: '/images/arjun.jpg', text: 'mentioned you in a comment: “See you there!”', time: '1h', image: '/images/event.jpg' },
  { id: 4, user: 'ananyam', avatar: '/images/ananya.jpg', text: 'liked your comment.', time: '3h', image: '/images/friends.jpg' },
  { id: 5, user: 'arjun.s', avatar: '/images/arjun.jpg', text: 'started following you.', time: '1d', follow: true },
  { id: 6, user: 'codechef.tiet', avatar: '/images/rohan.jpg', text: 'posted a new reel.', time: '2d', image: '/images/coding.jpg' },
]

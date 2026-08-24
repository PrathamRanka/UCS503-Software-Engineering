import type { Post, Story, Suggestion } from '../types/social'

export const currentUser = {
  name: 'Riya Sharma',
  handle: '@riyasharma',
  avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&crop=face&w=240&h=240&q=95',
}

export const stories: Story[] = [
  { name: 'Your story', image: currentUser.avatar, mine: true },
  { name: 'aarav.jpg', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=face&w=240&h=240&q=95' },
  { name: 'meherkaur', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=face&w=240&h=240&q=95' },
  { name: 'devmalhotra', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=face&w=240&h=240&q=95' },
  { name: 'arjun.s', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=face&w=240&h=240&q=95' },
  { name: 'simrank', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=face&w=240&h=240&q=95' },
]

export const posts: Post[] = [
  {
    id: 1,
    author: 'Thapar Photography Club',
    handle: 'tiet.photography',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=face&w=240&h=240&q=95',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1100&q=88',
    place: 'Main Auditorium',
    time: '18 min',
    caption: 'Golden hour found its way into campus today. Some evenings deserve a permanent spot on the feed.',
    likes: 1284,
    comments: 46,
    tags: ['#ThaparDiaries', '#GoldenHour'],
    featured: true,
  },
  {
    id: 2,
    author: 'Naina Kapoor',
    handle: 'nainak',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=face&w=240&h=240&q=95',
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1100&q=88',
    place: 'G Block Lawns',
    time: '1 hr',
    caption: 'The group project finally escaped the Google Doc. Demo day, here we come 🚀',
    likes: 692,
    comments: 31,
    tags: ['#ProjectWeek', '#CSED'],
  },
]

export const suggestions: Suggestion[] = [
  { name: 'Kabir Anand', handle: '@kabir.a', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=face&w=240&h=240&q=95' },
  { name: 'Ananya Mehta', handle: '@ananyam', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=face&w=240&h=240&q=95' },
  { name: 'Simran Kaur', handle: '@simrank', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=face&w=240&h=240&q=95' },
]

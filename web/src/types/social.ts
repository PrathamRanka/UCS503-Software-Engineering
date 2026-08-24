export type UserProfile = {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  bio: string
  branch: string
  year: string
  followers: number
  following: number
}

export type Story = {
  name: string
  image: string
  mine?: boolean
}

export type Post = {
  id: number
  author: string
  handle: string
  avatar: string
  image: string
  place: string
  time: string
  caption: string
  likes: number
  comments: number
  tags: string[]
  featured?: boolean
}

export type Suggestion = {
  name: string
  handle: string
  image: string
}

export type NewPostInput = {
  caption: string
  image: string
}

export type ExploreItem = {
  id: number
  image: string
  likes: number
  comments: number
  video?: boolean
}

export type Reel = {
  id: number
  creator: string
  avatar: string
  image: string
  caption: string
  likes: string
  comments: string
  audio: string
}

export type Message = {
  id: number
  text: string
  mine: boolean
  time: string
}

export type Conversation = {
  id: number
  name: string
  username: string
  avatar: string
  lastMessage: string
  time: string
  unread?: boolean
  messages: Message[]
}

export type NotificationItem = {
  id: number
  user: string
  avatar: string
  text: string
  time: string
  image?: string
  follow?: boolean
}

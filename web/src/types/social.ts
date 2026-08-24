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

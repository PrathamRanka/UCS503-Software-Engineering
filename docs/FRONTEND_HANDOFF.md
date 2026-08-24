# Frontend to Backend Handoff

The client-side product flow is complete. The next phase should preserve these interfaces and replace mock state with API calls.

| Frontend feature | Current client behavior | Backend capability to add |
| --- | --- | --- |
| Sign in | Validates `@thapar.edu` and creates a local session | Google OAuth callback and server session |
| Registration | Collects name, username, branch and year | User creation and unique username validation |
| Feed | Displays typed mock posts | Paginated `GET /posts/feed` |
| Create post | Upload preview and immediate local insertion | Media upload and `POST /posts` |
| Likes and saves | Local toggle state | Reaction and saved-post endpoints |
| Comments | Adds comments locally | Comment create/list endpoints |
| Follow | Local relationship state | Follow/unfollow endpoints |
| Search | Filters local student profiles | User and club search endpoint |
| Explore | Displays local discovery grid | Ranked discovery endpoint |
| Reels | Interactive vertical reel feed | Reel feed, media URLs and engagement endpoints |
| Messages | Local conversations and sending | Conversation/message endpoints and realtime delivery |
| Notifications | Local activity list | Notification list and read-state endpoints |
| Profile | Posts, saved and tagged grids | Profile and profile-content endpoints |
| Settings | Persists profile in browser storage | Profile update, privacy and notification preferences |

## Recommended backend order

1. Authentication and user onboarding
2. Profiles and posts
3. Uploads, likes, comments, saves and follows
4. Search and discovery
5. Notifications
6. Messages
7. Reels

The frontend session currently uses the `thapar-talks-session-v1` local-storage key. Remove that mock when server authentication is connected.

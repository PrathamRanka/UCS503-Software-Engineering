# Thapar Talks — Easy-to-Draw DFD

This is the **simplified lab version** of the Thapar Talks Data Flow Diagram. It contains the same complete system scope as the detailed document, but related features are grouped together so the diagrams are easier to understand and reproduce in Excalidraw.

For the full technical decomposition and data dictionary, keep [DFD.md](./DFD.md) as the reference document.

---

## 1. What you should draw for the lab

Draw these in order:

1. **Context Diagram / Level 0** — one diagram
2. **Level 1 DFD** — one diagram containing five major processes
3. **Level 2 DFDs** — five small diagrams, one for each Level 1 process
4. **Level 3 DFD** — optional; draw it only if the teacher asks for deeper decomposition

This structure retains every project feature while avoiding one oversized diagram.

---

## 2. Symbols

| Element | Excalidraw shape | Example |
|---|---|---|
| External entity | Rectangle | E1 User |
| Process | Circle or rounded rectangle | 2.0 Manage Content |
| Data store | Two parallel lines or open rectangle | D2 Content & Media |
| Data flow | Labelled arrow | Content details |

Use the same color for every shape of the same type:

- External entities: light blue
- Processes: light yellow
- Data stores: light green
- Arrows: dark gray

---

# 3. Context Diagram — Level 0

## Simple diagram

~~~mermaid
flowchart LR
    U["E1 Student / Club User"]
    ID["E2 Campus Identity Provider"]
    EMAIL["E3 Email Service"]
    ADMIN["E4 Moderator / Administrator"]
    SYS(["0.0 Thapar Talks"])

    U -->|"Account data, content, searches, interactions, messages, settings, reports"| SYS
    SYS -->|"Feed, profiles, content, messages, notifications, results"| U

    SYS -->|"Verification request"| ID
    ID -->|"Verification result"| SYS

    SYS -->|"Recovery email request"| EMAIL
    EMAIL -->|"Delivery result"| SYS

    SYS -->|"Reported content/account"| ADMIN
    ADMIN -->|"Moderation decision"| SYS
~~~

## How to explain it

The student or club user is the main external entity. The user sends data to Thapar Talks and receives results from it. The system uses an external identity provider for campus verification, an email service for password recovery, and a moderator for report review.

Do not show any database in the Context Diagram because all internal processing is hidden inside Process 0.0.

---

# 4. Level 1 DFD

The complete system is divided into only five easy-to-understand processes.

| Process | Responsibility |
|---|---|
| 1.0 Manage Accounts & Profiles | Sign-in, registration, onboarding, profile, password recovery, logout |
| 2.0 Manage Content | Posts, stories, highlights, reels, uploads, editing, archive and deletion |
| 3.0 Manage Feed & Social Activity | Feed, search, Explore, profile grids, follows, likes, comments, saves and shares |
| 4.0 Manage Messages & Notifications | Direct/group chats, text/image messages, delivery/read state and notifications |
| 5.0 Manage Settings & Safety | Theme, privacy, notification settings, block, mute, reports, moderation and account deletion |

## Data stores

| Store | Contents |
|---|---|
| D1 Users & Sessions | Accounts, profiles, credentials, verification and sessions |
| D2 Content & Media | Posts, stories, highlights, reels and media metadata |
| D3 Social Activity | Follow relationships, likes, comments, saves and shares |
| D4 Messages | Conversations, participants, messages and read state |
| D5 Notifications | Notification records and unread/read state |
| D6 Settings & Safety | Preferences, privacy, blocks, mutes, reports and moderation |

## Easy Level 1 diagram

~~~mermaid
flowchart LR
    U["E1 Student / Club User"]
    ID["E2 Identity Provider"]
    EMAIL["E3 Email Service"]
    ADMIN["E4 Moderator"]

    P1(["1.0 Accounts & Profiles"])
    P2(["2.0 Content"])
    P3(["3.0 Feed & Social Activity"])
    P4(["4.0 Messages & Notifications"])
    P5(["5.0 Settings & Safety"])

    D1[("D1 Users & Sessions")]
    D2[("D2 Content & Media")]
    D3[("D3 Social Activity")]
    D4[("D4 Messages")]
    D5[("D5 Notifications")]
    D6[("D6 Settings & Safety")]

    U -->|"Sign-in, registration, profile data"| P1
    P1 -->|"Session and profile result"| U
    P1 <-->|"User and session data"| D1
    P1 <-->|"Identity check"| ID
    P1 <-->|"Password recovery"| EMAIL

    U -->|"Create or manage post/story/reel"| P2
    P2 -->|"Content result"| U
    P2 <-->|"Content and media data"| D2
    D1 -->|"Author data"| P2

    U -->|"Feed/search request or social action"| P3
    P3 -->|"Feed, results and action status"| U
    D1 -->|"Profile data"| P3
    D2 -->|"Available content"| P3
    P3 <-->|"Follows and engagement"| D3
    D6 -->|"Visibility restrictions"| P3

    U -->|"Conversation, message or notification request"| P4
    P4 -->|"Messages and notifications"| U
    P4 <-->|"Conversation data"| D4
    P4 <-->|"Notification data"| D5
    D1 -->|"Participant data"| P4
    D6 -->|"Messaging preferences/restrictions"| P4

    U -->|"Preferences, block, mute, report, delete account"| P5
    P5 -->|"Settings or safety result"| U
    P5 <-->|"Preference and safety data"| D6
    P5 -->|"Account status update"| D1
    P5 <-->|"Report review"| ADMIN

    P1 -->|"Account/profile event"| P4
    P2 -->|"New-content event"| P4
    P3 -->|"Like/comment/follow event"| P4
    P5 -->|"Safety/account event"| P4
~~~

## Read the Level 1 diagram in five sentences

1. Process 1.0 verifies the user and manages the account and profile.
2. Process 2.0 creates and manages posts, stories, and reels.
3. Process 3.0 displays content and handles follows, likes, comments, saves, and shares.
4. Process 4.0 handles conversations, messages, and notifications.
5. Process 5.0 handles preferences, privacy, blocking, muting, reports, moderation, and deletion.

---

# 5. Level 2 DFD — 1.0 Manage Accounts & Profiles

## Sub-processes

| ID | Sub-process |
|---|---|
| 1.1 | Sign In / Verify Identity |
| 1.2 | Register Account |
| 1.3 | Complete or Update Profile |
| 1.4 | Recover Password |
| 1.5 | Create / End Session |

~~~mermaid
flowchart LR
    U["User"]
    ID["Identity Provider"]
    EMAIL["Email Service"]

    A(["1.1 Sign In & Verify"])
    B(["1.2 Register"])
    C(["1.3 Manage Profile"])
    D(["1.4 Recover Password"])
    E(["1.5 Manage Session"])

    STORE[("D1 Users & Sessions")]

    U -->|"Credentials"| A
    A <-->|"Identity check"| ID
    A <-->|"Account lookup"| STORE
    A -->|"Valid user"| E

    U -->|"Name, campus email, password"| B
    B -->|"New account"| STORE
    B -->|"Onboarding required"| C

    U -->|"Username, branch, year, bio, avatar"| C
    C <-->|"Profile data"| STORE
    C -->|"Profile result"| U

    U -->|"Campus email"| D
    D <-->|"Reset data"| STORE
    D <-->|"Recovery message"| EMAIL
    D -->|"Recovery status"| U

    E <-->|"Session data"| STORE
    E -->|"Session or logout result"| U
~~~

### Easy explanation

- Existing users sign in and receive a session.
- New users register, verify their campus identity, and complete their profile.
- Profile changes are saved in D1.
- Password recovery uses the external Email Service.
- Logout ends or revokes the session.

---

# 6. Level 2 DFD — 2.0 Manage Content

## Sub-processes

| ID | Sub-process |
|---|---|
| 2.1 | Validate & Route Content Upload |
| 2.2 | Create Post |
| 2.3 | Create Story / Manage Highlight |
| 2.4 | Create Reel |
| 2.5 | Edit Content |
| 2.6 | Archive / Restore / Delete Content |

~~~mermaid
flowchart LR
    U["User"]
    V(["2.1 Validate Upload"])
    POST(["2.2 Manage Post"])
    STORY(["2.3 Manage Story & Highlight"])
    REEL(["2.4 Manage Reel"])
    EDIT(["2.5 Edit Content"])
    LIFE(["2.6 Archive / Restore / Delete"])

    USERS[("D1 Users & Sessions")]
    CONTENT[("D2 Content & Media")]
    N["4.0 Notification Event"]

    U -->|"Media, caption, content type"| V
    USERS -->|"Author status"| V
    V -->|"Invalid submission"| U

    V -->|"Valid post"| POST
    V -->|"Valid story"| STORY
    V -->|"Valid reel"| REEL

    POST -->|"Post record"| CONTENT
    STORY -->|"Story/highlight record"| CONTENT
    REEL -->|"Reel record"| CONTENT

    POST -->|"Post result"| U
    STORY -->|"Story result"| U
    REEL -->|"Reel result"| U

    U -->|"Content ID and changes"| EDIT
    EDIT <-->|"Updated content"| CONTENT
    EDIT -->|"Edit result"| U

    U -->|"Archive, restore or delete command"| LIFE
    LIFE <-->|"Content status"| CONTENT
    LIFE -->|"Operation result"| U

    POST -->|"Published"| N
    STORY -->|"Published"| N
    REEL -->|"Published"| N
~~~

### Easy explanation

The uploaded file and caption are validated first. The system then follows one of three paths: post, story, or reel. Existing content can later be edited, archived, restored, or deleted.

---

# 7. Level 2 DFD — 3.0 Manage Feed & Social Activity

## Sub-processes

| ID | Sub-process |
|---|---|
| 3.1 | Find Visible Content |
| 3.2 | Generate Feed / Search / Explore |
| 3.3 | Manage Follow Relationships |
| 3.4 | Manage Likes & Comments |
| 3.5 | Manage Saves & Shares |
| 3.6 | Retrieve Profile Collections |

~~~mermaid
flowchart LR
    U["User"]
    FIND(["3.1 Find Visible Content"])
    DISPLAY(["3.2 Feed, Search & Explore"])
    FOLLOW(["3.3 Follow / Unfollow"])
    ENGAGE(["3.4 Like & Comment"])
    SAVE(["3.5 Save & Share"])
    PROFILE(["3.6 Profile Collections"])

    USERS[("D1 Users & Sessions")]
    CONTENT[("D2 Content & Media")]
    SOCIAL[("D3 Social Activity")]
    SAFETY[("D6 Settings & Safety")]
    N["4.0 Notification Event"]

    U -->|"Feed, search or Explore request"| FIND
    USERS -->|"Profiles"| FIND
    CONTENT -->|"Posts, stories and reels"| FIND
    SOCIAL -->|"Following and engagement signals"| FIND
    SAFETY -->|"Privacy, block and mute filters"| FIND
    FIND -->|"Allowed content"| DISPLAY
    DISPLAY -->|"Feed or search results"| U

    U -->|"Follow or unfollow"| FOLLOW
    FOLLOW <-->|"Follow relationship"| SOCIAL
    FOLLOW -->|"Follow status"| U
    FOLLOW -->|"Follow event"| N

    U -->|"Like or comment"| ENGAGE
    CONTENT -->|"Target content"| ENGAGE
    ENGAGE <-->|"Likes and comments"| SOCIAL
    ENGAGE -->|"Engagement result"| U
    ENGAGE -->|"Like/comment event"| N

    U -->|"Save, unsave or share"| SAVE
    CONTENT -->|"Target content"| SAVE
    SAVE <-->|"Save/share record"| SOCIAL
    SAVE -->|"Status or share link"| U

    U -->|"Posts, saved, tagged or archived tab"| PROFILE
    CONTENT -->|"Owned/tagged/archived content"| PROFILE
    SOCIAL -->|"Saved references"| PROFILE
    PROFILE -->|"Profile content grid"| U
~~~

### Easy explanation

This process has two jobs:

1. It retrieves content for the feed, Search, Explore, Reels, and profile tabs.
2. It records social actions such as following, liking, commenting, saving, and sharing.

Before returning content, privacy, archive, block, mute, and deletion rules are applied.

---

# 8. Level 2 DFD — 4.0 Manage Messages & Notifications

## Sub-processes

| ID | Sub-process |
|---|---|
| 4.1 | Find Chat Participants |
| 4.2 | Create Direct / Group Conversation |
| 4.3 | Send / Retrieve Message |
| 4.4 | Create Notification |
| 4.5 | Retrieve / Mark Notification Read |

~~~mermaid
flowchart LR
    S["Sending User"]
    R["Recipient User(s)"]
    FIND(["4.1 Find Participants"])
    CHAT(["4.2 Create Conversation"])
    MESSAGE(["4.3 Send / Retrieve Message"])
    NOTICE(["4.4 Create Notification"])
    READ(["4.5 View / Mark Read"])

    USERS[("D1 Users & Sessions")]
    MSG[("D4 Messages")]
    NOTIF[("D5 Notifications")]
    SAFETY[("D6 Settings & Safety")]
    EVENTS["Events from Processes 1.0, 2.0, 3.0 and 5.0"]

    S -->|"Participant search"| FIND
    USERS -->|"Matching profiles"| FIND
    FIND -->|"Participant list"| S

    S -->|"Selected users/group name"| CHAT
    SAFETY -->|"Messaging restrictions"| CHAT
    CHAT -->|"Conversation record"| MSG
    CHAT -->|"Conversation result"| S

    S -->|"Text/image message"| MESSAGE
    SAFETY -->|"Block restrictions"| MESSAGE
    MESSAGE <-->|"Message and read data"| MSG
    MESSAGE -->|"Delivered message"| R
    MESSAGE -->|"Send result"| S
    MESSAGE -->|"Message event"| NOTICE

    EVENTS -->|"Follow, content, interaction or safety event"| NOTICE
    SAFETY -->|"Notification preferences"| NOTICE
    NOTICE -->|"Notification record"| NOTIF

    S -->|"Notification list/read command"| READ
    READ <-->|"Notification and read state"| NOTIF
    READ -->|"Notifications/unread count"| S
~~~

### Easy explanation

The user can find participants and create a direct or group conversation. Messages are validated against block restrictions, stored, and delivered. Message events and events from other modules are converted into notifications according to the recipient’s preferences.

---

# 9. Level 2 DFD — 5.0 Manage Settings & Safety

## Sub-processes

| ID | Sub-process |
|---|---|
| 5.1 | Update Theme & Notification Preferences |
| 5.2 | Update Privacy |
| 5.3 | Block / Mute Account |
| 5.4 | Submit Report |
| 5.5 | Review Report |
| 5.6 | Delete Account |

~~~mermaid
flowchart LR
    U["User"]
    ADMIN["Moderator"]
    PREF(["5.1 Manage Preferences"])
    PRIV(["5.2 Manage Privacy"])
    RESTRICT(["5.3 Block / Mute"])
    REPORT(["5.4 Submit Report"])
    REVIEW(["5.5 Review Report"])
    DELETE(["5.6 Delete Account"])

    USERS[("D1 Users & Sessions")]
    CONTENT[("D2 Content & Media")]
    SOCIAL[("D3 Social Activity")]
    MESSAGES[("D4 Messages")]
    SAFETY[("D6 Settings & Safety")]
    N["4.0 Notification Event"]

    U -->|"Theme/notification choices"| PREF
    PREF <-->|"Preference data"| SAFETY
    PREF -->|"Updated settings"| U

    U -->|"Private/public setting"| PRIV
    PRIV -->|"Privacy data"| SAFETY
    PRIV -->|"Privacy result"| U

    U -->|"Target account and block/mute action"| RESTRICT
    RESTRICT -->|"Block/mute record"| SAFETY
    RESTRICT -->|"Relationship restriction"| SOCIAL
    RESTRICT -->|"Action result"| U

    U -->|"Target, reason and evidence"| REPORT
    REPORT -->|"Pending report"| SAFETY
    REPORT -->|"Report confirmation"| U
    REPORT -->|"Review request"| ADMIN

    ADMIN -->|"Moderation decision"| REVIEW
    REVIEW -->|"Report status"| SAFETY
    REVIEW -->|"Account action"| USERS
    REVIEW -->|"Content action"| CONTENT
    REVIEW -->|"Decision event"| N

    U -->|"Confirmed deletion request"| DELETE
    DELETE -->|"Deactivate account/session"| USERS
    DELETE -->|"Delete/anonymize content"| CONTENT
    DELETE -->|"Remove relationships/activity"| SOCIAL
    DELETE -->|"Remove conversation membership"| MESSAGES
    DELETE -->|"Retained safety audit"| SAFETY
    DELETE -->|"Deletion result"| U
~~~

### Easy explanation

Normal settings are saved directly. Blocks and mutes restrict future feed and message results. Reports go to a moderator. Account deletion updates every store containing data owned by or linked to that user.

---

# 10. Optional Level 3 DFD — 2.1 Validate & Route Content Upload

You usually **do not need Level 3** because the Level 2 diagrams already explain the system sufficiently. If the teacher specifically requests Level 3, use this decomposition of content creation.

## Sub-processes

| ID | Sub-process |
|---|---|
| 2.1.1 | Select Content Type |
| 2.1.2 | Validate User & Input |
| 2.1.3 | Store Media |
| 2.1.4 | Create Content Record |
| 2.1.5 | Return Result & Generate Event |

~~~mermaid
flowchart LR
    U["User"]
    TYPE(["2.1.1 Select Type"])
    VALIDATE(["2.1.2 Validate Input"])
    MEDIA(["2.1.3 Store Media"])
    RECORD(["2.1.4 Create Record"])
    RESULT(["2.1.5 Return Result"])

    USERS[("D1 Users & Sessions")]
    CONTENT[("D2 Content & Media")]
    N["4.0 Notification Event"]

    U -->|"Post/story/reel, media and caption"| TYPE
    TYPE -->|"Typed submission"| VALIDATE
    USERS -->|"Author status"| VALIDATE
    VALIDATE -->|"Validation error"| U
    VALIDATE -->|"Valid media"| MEDIA
    MEDIA -->|"Media URL and metadata"| CONTENT
    MEDIA -->|"Stored media reference"| RECORD
    RECORD -->|"Post/story/reel record"| CONTENT
    RECORD -->|"Created content"| RESULT
    RESULT -->|"Publication result"| U
    RESULT -->|"New-content event"| N
~~~

### Why only one Level 3 diagram?

Level 3 is only needed when a Level 2 process is still too complex. Content creation has separate validation, media storage, record creation, and notification steps, so it is a reasonable example. Decomposing every small process further would make the submission harder to read without adding useful information.

---

# 11. Complete feature-to-process map

Nothing from the final system has been removed. Related items are simply grouped.

| Feature | Process |
|---|---|
| Campus email sign-in | 1.1 |
| Identity-provider sign-in | 1.1 |
| Registration | 1.2 |
| Onboarding | 1.3 |
| Profile viewing/editing | 1.3 |
| Password recovery | 1.4 |
| Session and logout | 1.5 |
| Post creation/editing | 2.1, 2.2, 2.5 |
| Story creation/editing/deletion | 2.1, 2.3, 2.5, 2.6 |
| Story highlights | 2.3 |
| Reel creation/editing/deletion | 2.1, 2.4, 2.5, 2.6 |
| Media upload | 2.1 |
| Archive and restore | 2.6 |
| Content deletion | 2.6 |
| Home feed | 3.1, 3.2 |
| Search | 3.1, 3.2 |
| Explore | 3.1, 3.2 |
| Reels feed | 3.1, 3.2 |
| Profile post grid | 3.6 |
| Saved posts | 3.5, 3.6 |
| Tagged posts | 3.6 |
| Archived posts | 3.6 |
| Follow/unfollow | 3.3 |
| Follow requests | 3.3 |
| Followers/following lists | 3.3 |
| Likes | 3.4 |
| Comments and mentions | 3.4 |
| Saves and shares | 3.5 |
| Direct chats | 4.1–4.3 |
| Group chats | 4.1–4.3 |
| Text messages | 4.3 |
| Image messages | 4.3 |
| Message delivery/read state | 4.3 |
| Activity notifications | 4.4 |
| Notification list/read state | 4.5 |
| Theme preference | 5.1 |
| Notification preference | 5.1 |
| Account privacy | 5.2 |
| Blocking | 5.3 |
| Muting | 5.3 |
| Reporting | 5.4 |
| Moderator review | 5.5 |
| Account deletion | 5.6 |

---

# 12. Drawing order in Excalidraw

For every diagram:

1. Add the process shapes in the center.
2. Add external entities on the left and right edges.
3. Add data stores below the processes.
4. Draw the main user-request arrows.
5. Draw process-to-store arrows.
6. Add external-service arrows last.
7. Check that every arrow has a short label.

Avoid diagonal arrows when possible. Use elbow connectors and increase the page width instead of squeezing shapes together.

---

# 13. Short lab explanation

“Thapar Talks is divided into five major processes. The first manages accounts and profiles. The second manages posts, stories, reels, and media. The third generates feeds and search results and records social activities. The fourth manages direct or group messages and notifications. The fifth handles preferences, privacy, reports, moderation, and account deletion.

The system uses six logical data stores for users and sessions, content, social activity, messages, notifications, and safety settings. External identity and email services support verification and password recovery, while a moderator reviews reports.

For example, a new post enters Process 2.0, is validated, and is stored in D2. Process 3.0 later reads it and applies social and privacy information before returning it in a feed. A like is stored in D3 and creates an event for Process 4.0, which stores a notification in D5.” 

---

## Final recommendation

For the cleanest submission:

- Draw Level 0 on one page.
- Draw Level 1 on one landscape page.
- Draw each Level 2 process on a separate page or frame.
- Keep the Level 3 diagram as an optional final page.
- Use [DFD.md](./DFD.md) only when you need the detailed data dictionary, CRUD matrix, balancing checks, or viva answers.

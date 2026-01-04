# Online Interview Platform

A professional online interview platform built with Next.js, featuring real-time video calls, collaborative code editing, interview scheduling, and comprehensive candidate management.

## 🚀 Features

### Core Features
- **Video Conferencing**: Real-time video calls powered by Stream.io with multiple layout options (Grid, Speaker)
- **Code Editor**: Integrated Monaco Editor for live coding interviews with syntax highlighting
- **Interview Scheduling**: Schedule interviews with date/time selection and candidate assignment
- **Role-Based Access**: Separate interfaces for Interviewers and Candidates
- **Interview Management**: 
  - Track interview status (Upcoming, Completed, Succeeded, Failed)
  - View interview history and recordings
  - Add comments and ratings for completed interviews
- **Dashboard**: Admin dashboard for managing all interviews and candidates
- **Dark/Light Mode**: Theme switching support

### Technical Features
- **Real-time Updates**: Powered by Convex for instant data synchronization
- **Authentication**: Secure authentication with Clerk
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Type Safety**: Full TypeScript support

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **Video SDK**: Stream.io Video React SDK
- **State Management**: Convex React hooks

### Backend
- **Database**: Convex (Real-time database)
- **Authentication**: Clerk
- **Video Platform**: Stream.io
- **API**: Convex Functions (Queries & Mutations)

### Development Tools
- **Linting**: ESLint
- **Package Manager**: npm
- **Font**: Geist Sans & Geist Mono

## 🎨 Frontend Architecture & Features

### Frontend Capabilities

The frontend is built with Next.js 15 App Router and provides a comprehensive user interface for conducting online interviews. Here's what the frontend can do:

#### 1. **User Interface Components**

**Pages & Routes:**
- **Home Page** (`(home)/page.tsx`):
  - Role-based dashboard (different views for Interviewers vs Candidates)
  - Quick action cards for Interviewers (New Call, Join Interview, Schedule, Dashboard)
  - Interview list view for Candidates showing their scheduled interviews
  - Real-time interview status updates

- **Schedule Page** (`schedule/page.tsx`):
  - Interview scheduling form with date/time picker
  - Candidate selection dropdown
  - Multi-select interviewer assignment
  - Form validation and error handling
  - Integration with Stream.io to create video calls

- **Meeting Page** (`meeting/[id]/page.tsx`):
  - Dynamic route for individual meetings
  - Pre-meeting setup (audio/video configuration)
  - Meeting room with video call interface
  - Code editor integration for technical interviews

- **Dashboard Page** (`(admin)/dashboard/page.tsx`):
  - Admin-only access for interviewers
  - Categorized interview view (Upcoming, Completed, Succeeded, Failed)
  - Interview cards with candidate information
  - Pass/Fail buttons for completed interviews
  - Comment dialog integration

- **Recordings Page** (`recordings/page.tsx`):
  - View past interview recordings
  - Filter and search functionality
  - Recording playback interface

#### 2. **Core Components**

**Video Conferencing:**
- **MeetingRoom.tsx**: 
  - Full-featured video call interface
  - Multiple layout options (Grid view, Speaker view)
  - Resizable panels for video and code editor
  - Participant list overlay
  - Call controls (mute, video toggle, screen share, etc.)
  - End call functionality

- **MeetingSetup.tsx**:
  - Pre-meeting audio/video device configuration
  - Camera and microphone permission handling
  - Device selection and testing
  - Error handling for device access issues
  - Stream.io SDK integration for media setup

- **MeetingCard.tsx**:
  - Display interview information cards
  - Status badges and time indicators
  - Quick join functionality
  - Responsive card layout

**Code Editor:**
- **CodeEditor.tsx**:
  - Monaco Editor integration (@monaco-editor/react)
  - Syntax highlighting for multiple languages (JavaScript, Python, Java)
  - Language selection dropdown
  - Real-time code sharing during interviews
  - Resizable editor panel
  - Custom editor options (font size, line numbers, word wrap)

**Interview Management:**
- **InterviewScheduleUI.tsx**:
  - Complete interview scheduling form
  - Date picker with calendar widget
  - Time slot selection (9:00 AM - 5:00 PM in 30-minute intervals)
  - Candidate and interviewer selection
  - Form state management
  - Stream.io call creation integration

- **CommentDialog.tsx**:
  - Modal dialog for adding interview feedback
  - Star rating system (1-5 stars)
  - Comment text area
  - Display previous comments with scrollable area
  - Interviewer information display
  - Timestamp formatting

- **ActionCard.tsx**:
  - Reusable card component for quick actions
  - Icon, title, and description display
  - Gradient backgrounds
  - Click handlers for navigation

**UI Components (Radix UI):**
- Button, Card, Dialog, Select, Input, Textarea
- Calendar, Badge, Avatar, Dropdown Menu
- Scroll Area, Resizable Panels
- Switch, Label components
- Fully accessible and customizable

#### 3. **Custom Hooks**

- **useUserRole.ts**:
  - Determines if user is interviewer or candidate
  - Fetches user data from Convex
  - Loading state management
  - Role-based conditional rendering

- **useGetCallById.ts**:
  - Fetches Stream.io call data by ID
  - Loading state handling
  - Error handling for missing calls

- **useGetCalls.tsx**:
  - Retrieves list of calls/interviews
  - Filters by user role
  - Real-time updates via Convex

- **useMeetingAction.ts**:
  - Meeting action handlers
  - Call creation and joining logic
  - Navigation after meeting actions

#### 4. **State Management**

- **Convex React Hooks**: Real-time data synchronization
  - `useQuery()`: Subscribe to database queries
  - `useMutation()`: Execute database mutations
  - Automatic re-rendering on data changes

- **React State**: Local component state
  - Form data management
  - UI state (modals, dropdowns, etc.)
  - Theme preferences

- **Clerk Hooks**: Authentication state
  - `useUser()`: Current user information
  - `useAuth()`: Authentication methods

#### 5. **Styling & Theming**

- **Tailwind CSS**: Utility-first CSS framework
  - Responsive design (mobile, tablet, desktop)
  - Dark/light mode support
  - Custom color palette
  - Animation utilities

- **Theme Provider**: Next-themes integration
  - System preference detection
  - Theme persistence
  - Smooth theme transitions

#### 6. **Real-time Features**

- **Live Updates**: Convex provides real-time subscriptions
  - Interview status changes appear instantly
  - New interviews show up without refresh
  - Comment updates in real-time

- **Video Streaming**: Stream.io SDK
  - Low-latency video/audio streaming
  - Screen sharing capabilities
  - Recording functionality

#### 7. **User Experience Features**

- **Loading States**: 
  - LoaderUI component for async operations
  - Skeleton screens during data fetching
  - Button loading states

- **Error Handling**:
  - Toast notifications (react-hot-toast)
  - Error messages for failed operations
  - Graceful error boundaries

- **Navigation**:
  - Next.js App Router navigation
  - Protected routes (middleware)
  - Role-based route access

- **Responsive Design**:
  - Mobile-first approach
  - Breakpoints: sm, md, lg, xl
  - Adaptive layouts for all screen sizes

## ⚙️ Backend Architecture & Features

### Backend Capabilities

The backend is powered by Convex, a real-time database platform that provides instant data synchronization, authentication integration, and serverless functions. Here's what the backend provides:

#### 1. **Database Schema** (`convex/schema.ts`)

**Users Table:**
- Stores user information synchronized with Clerk
- Fields: name, email, image, role (candidate/interviewer), clerkId
- Index: `by_clerk_id` for fast user lookups
- Role-based access control

**Interviews Table:**
- Stores all interview records
- Fields: title, description, startTime, endTime, status, streamCallId, candidateId, interviewerIds
- Indexes:
  - `by_candidate_id`: Query interviews by candidate
  - `by_stream_call_id`: Find interview by Stream call ID
- Status tracking: upcoming, completed, succeeded, failed

**Comments Table:**
- Stores interview feedback and ratings
- Fields: content, rating (1-5), interviewerId, interviewId
- Index: `by_interview_id` for efficient comment queries
- Linked to interviews and interviewers

#### 2. **Convex Functions**

**User Management** (`convex/users.ts`):

- **`upsertUser` (Mutation)**:
  - Creates or updates user records
  - Syncs with Clerk authentication
  - Handles user registration and profile updates
  - Default role assignment (candidate)
  - Prevents duplicate users by clerkId

- **`getUsers` (Query)**:
  - Retrieves all users from database
  - Requires authentication
  - Used for candidate/interviewer selection
  - Returns user list with roles

- **`getUserByClerkId` (Query)**:
  - Fetches single user by Clerk ID
  - Used for role determination
  - Error handling for missing users
  - Indexed query for performance

**Interview Management** (`convex/interview.ts`):

- **`getAllInterviews` (Query)**:
  - Retrieves all interviews (admin view)
  - Requires authentication
  - Returns complete interview list
  - Used in dashboard

- **`getMyInterviews` (Query)**:
  - Fetches interviews for current user
  - Filters by candidateId using index
  - Real-time updates for candidates
  - Returns only user's interviews

- **`getInterviewByStreamId` (Query)**:
  - Finds interview by Stream.io call ID
  - Used when joining meetings
  - Indexed lookup for performance
  - Returns single interview or null

- **`createInterview` (Mutation)**:
  - Creates new interview record
  - Validates authentication
  - Stores interview metadata
  - Links to Stream.io call
  - Returns interview ID

- **`updateInterviewStatus` (Mutation)**:
  - Updates interview status
  - Sets endTime when completed
  - Supports status transitions
  - Used for Pass/Fail actions

**Comment System** (`convex/comment.ts`):

- **`addComment` (Mutation)**:
  - Creates new comment/rating
  - Requires authentication
  - Links to interview and interviewer
  - Validates rating (1-5)
  - Stores comment content

- **`getComments` (Query)**:
  - Retrieves all comments for an interview
  - Uses index for efficient querying
  - Returns comments with ratings
  - Used in comment dialog

#### 3. **Authentication Integration** (`convex/auth.config.ts`)

- **Clerk Integration**:
  - JWT token validation
  - User identity extraction
  - Automatic user sync
  - Protected function access
  - Role-based permissions

- **Security**:
  - All functions require authentication
  - User identity verification
  - Prevents unauthorized access
  - Secure data access patterns

#### 4. **Real-time Capabilities**

**Automatic Synchronization:**
- Convex provides real-time subscriptions
- Data changes propagate instantly
- No polling or manual refresh needed
- Optimistic updates supported

**Query Subscriptions:**
- Frontend automatically receives updates
- Efficient change detection
- Minimal network overhead
- WebSocket-based connections

**Mutation Optimism:**
- Instant UI updates
- Rollback on error
- Conflict resolution
- Smooth user experience

#### 5. **Server Actions** (`src/actions/stream.action.ts`)

**Stream Token Provider:**
- Generates Stream.io user tokens
- Server-side token creation
- Clock skew prevention
- Token expiration handling (1 hour)
- Secure token generation

**Integration Points:**
- Clerk user authentication
- Stream.io API integration
- Token signing and validation
- Server-side security

#### 6. **HTTP Endpoints** (`convex/http.ts`)

- Webhook handlers for external services
- API endpoints for integrations
- Request/response handling
- Error handling and validation

#### 7. **Backend Features**

**Data Validation:**
- Convex schema validation
- Type-safe function arguments
- Runtime type checking
- Error messages for invalid data

**Indexing:**
- Optimized database queries
- Fast lookups by common fields
- Efficient filtering and sorting
- Performance optimization

**Error Handling:**
- Try-catch blocks in functions
- Meaningful error messages
- Authentication error handling
- Data validation errors

**Scalability:**
- Serverless architecture
- Automatic scaling
- No server management
- Pay-per-use model

#### 8. **Data Flow**

**Interview Creation Flow:**
1. Frontend calls `createInterview` mutation
2. Backend validates authentication
3. Creates interview record in database
4. Returns interview ID
5. Frontend receives real-time update
6. UI updates automatically

**Comment Submission Flow:**
1. User submits comment form
2. Frontend calls `addComment` mutation
3. Backend validates user and data
4. Inserts comment into database
5. Frontend query automatically updates
6. Comment appears in UI instantly

**Real-time Updates:**
1. Any mutation changes data
2. Convex detects change
3. Subscribed queries update
4. Frontend components re-render
5. UI reflects latest data

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- A Clerk account (for authentication)
- A Convex account (for database)
- A Stream.io account (for video calls)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codesync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # Convex
   CONVEX_DEPLOYMENT=your_convex_deployment_url
   NEXT_PUBLIC_CONVEX_URL=your_convex_url

   # Stream.io
   NEXT_PUBLIC_STREAM_APP_ID=your_stream_app_id
   NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
   STREAM_SECRET_KEY=your_stream_secret_key
   ```

4. **Set up Convex**
   ```bash
   npx convex dev
   ```
   This will:
   - Create a Convex project (if not already created)
   - Deploy your schema and functions
   - Set up authentication

5. **Run the development server**
```bash
npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
codesync/
├── convex/                 # Convex backend
│   ├── _generated/        # Auto-generated Convex files
│   ├── auth.config.ts     # Clerk authentication config
│   ├── schema.ts          # Database schema
│   ├── interview.ts       # Interview CRUD operations
│   ├── comment.ts         # Comment operations
│   ├── users.ts           # User management
│   └── http.ts            # HTTP endpoints
│
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (admin)/       # Admin routes
│   │   │   └── dashboard/ # Admin dashboard
│   │   ├── (root)/        # Main application routes
│   │   │   ├── (home)/    # Home page
│   │   │   ├── meeting/   # Meeting pages
│   │   │   ├── schedule/  # Schedule interview
│   │   │   └── recordings/# Recordings page
│   │   ├── layout.tsx     # Root layout
│   │   ├── globals.css    # Global styles
│   │   └── icon.tsx       # App icon
│   │
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── providers/    # Context providers
│   │   ├── CodeEditor.tsx      # Monaco code editor
│   │   ├── MeetingRoom.tsx     # Video call room
│   │   ├── MeetingSetup.tsx    # Pre-meeting setup
│   │   ├── CommentDialog.tsx   # Interview comments
│   │   └── ...
│   │
│   ├── hooks/            # Custom React hooks
│   │   ├── useGetCallById.ts
│   │   ├── useGetCalls.tsx
│   │   ├── useMeetingAction.ts
│   │   └── useUserRole.ts
│   │
│   ├── lib/              # Utility functions
│   │   └── utils.ts
│   │
│   ├── constants/        # App constants
│   │   └── index.ts
│   │
│   └── actions/          # Server actions
│       └── stream.action.ts
│
├── public/               # Static assets
│   ├── favicon.svg      # App favicon
│   └── *.png           # Language icons
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## 🗄️ Database Schema

### Users
- `name`: string
- `email`: string
- `image`: string (optional)
- `role`: "candidate" | "interviewer"
- `clerkId`: string

### Interviews
- `title`: string
- `description`: string (optional)
- `startTime`: number (timestamp)
- `endTime`: number (optional, timestamp)
- `status`: string
- `streamCallId`: string
- `candidateId`: string
- `interviewerIds`: string[]

### Comments
- `content`: string
- `rating`: number (1-5)
- `interviewerId`: string
- `interviewId`: Id<"interviews">

## 🔌 API Reference

### Convex Queries (Read Operations)

#### User Queries

**`api.users.getUsers`**
- **Description**: Get all users in the system
- **Authentication**: Required
- **Returns**: Array of user objects
- **Usage**: Used for candidate/interviewer selection dropdowns
```typescript
const users = useQuery(api.users.getUsers);
```

**`api.users.getUserByClerkId`**
- **Description**: Get user by Clerk ID
- **Parameters**: `{ clerkId: string }`
- **Authentication**: Required
- **Returns**: User object or throws error
- **Usage**: Determine user role, get user profile
```typescript
const user = useQuery(api.users.getUserByClerkId, { clerkId: "user_xxx" });
```

#### Interview Queries

**`api.interview.getAllInterviews`**
- **Description**: Get all interviews (admin view)
- **Authentication**: Required
- **Returns**: Array of interview objects
- **Usage**: Dashboard page, admin views
```typescript
const interviews = useQuery(api.interview.getAllInterviews);
```

**`api.interview.getMyInterviews`**
- **Description**: Get interviews for current user (candidate)
- **Authentication**: Required
- **Returns**: Array of interview objects filtered by candidateId
- **Usage**: Candidate home page, interview list
```typescript
const interviews = useQuery(api.interview.getMyInterviews);
```

**`api.interview.getInterviewByStreamId`**
- **Description**: Find interview by Stream.io call ID
- **Parameters**: `{ streamCallId: string }`
- **Authentication**: Required
- **Returns**: Interview object or null
- **Usage**: Join meeting by call ID
```typescript
const interview = useQuery(api.interview.getInterviewByStreamId, { 
  streamCallId: "call_xxx" 
});
```

#### Comment Queries

**`api.comment.getComments`**
- **Description**: Get all comments for an interview
- **Parameters**: `{ interviewId: Id<"interviews"> }`
- **Authentication**: Required
- **Returns**: Array of comment objects
- **Usage**: Display interview feedback
```typescript
const comments = useQuery(api.comment.getComments, { interviewId });
```

### Convex Mutations (Write Operations)

#### User Mutations

**`api.users.upsertUser`**
- **Description**: Create or update user record
- **Parameters**: 
  ```typescript
  {
    email: string;
    name: string;
    image?: string;
    clerkId: string;
    role: "candidate" | "interviewer";
  }
  ```
- **Authentication**: Required
- **Returns**: void
- **Usage**: Sync user data from Clerk, update user profile
```typescript
await upsertUser({
  email: "user@example.com",
  name: "John Doe",
  clerkId: "user_xxx",
  role: "interviewer"
});
```

#### Interview Mutations

**`api.interview.createInterview`**
- **Description**: Create a new interview
- **Parameters**:
  ```typescript
  {
    title: string;
    description?: string;
    startTime: number; // timestamp
    status: string;
    streamCallId: string;
    candidateId: string;
    interviewerIds: string[];
  }
  ```
- **Authentication**: Required
- **Returns**: Interview ID
- **Usage**: Schedule new interview
```typescript
const interviewId = await createInterview({
  title: "Frontend Developer Interview",
  description: "Technical interview for React position",
  startTime: Date.now(),
  status: "upcoming",
  streamCallId: "call_xxx",
  candidateId: "user_xxx",
  interviewerIds: ["user_yyy", "user_zzz"]
});
```

**`api.interview.updateInterviewStatus`**
- **Description**: Update interview status
- **Parameters**:
  ```typescript
  {
    interviewId: Id<"interviews">;
    status: string; // "completed" | "succeeded" | "failed"
  }
  ```
- **Authentication**: Required
- **Returns**: void
- **Usage**: Mark interview as Pass/Fail, update status
```typescript
await updateInterviewStatus({
  interviewId,
  status: "succeeded"
});
```

#### Comment Mutations

**`api.comment.addComment`**
- **Description**: Add comment and rating to interview
- **Parameters**:
  ```typescript
  {
    interviewId: Id<"interviews">;
    content: string;
    rating: number; // 1-5
  }
  ```
- **Authentication**: Required (interviewer only)
- **Returns**: Comment ID
- **Usage**: Submit interview feedback
```typescript
await addComment({
  interviewId,
  content: "Excellent problem-solving skills",
  rating: 5
});
```

### Server Actions

**`streamTokenProvider`** (`src/actions/stream.action.ts`)
- **Description**: Generate Stream.io user token for video calls
- **Authentication**: Required (Clerk)
- **Returns**: JWT token string
- **Usage**: Authenticate user with Stream.io SDK
```typescript
const token = await streamTokenProvider();
```

## 🎯 Usage

### For Interviewers

1. **Schedule an Interview**
   - Navigate to "Schedule" from the dashboard
   - Fill in interview details (title, description, candidate, date, time)
   - Select interviewers
   - Submit to create the interview

2. **Start/Join a Meeting**
   - Click "New Call" for instant calls
   - Or click "Join Interview" to enter via link
   - Set up audio/video before joining

3. **Conduct Interview**
   - Use the code editor for technical interviews
   - Switch between Grid and Speaker layouts
   - View participants list
   - End call when finished

4. **Review Candidates**
   - Go to Dashboard to see all interviews
   - Mark interviews as Pass/Fail
   - Add comments and ratings

### For Candidates

1. **View Scheduled Interviews**
   - Check the home page for upcoming interviews
   - See interview details and timing

2. **Join Interview**
   - Click on an interview card to join
   - Complete setup (audio/video check)
   - Participate in the interview

## 🏗️ Component Architecture

### Component Hierarchy

```
RootLayout
├── ConvexClerkProvider (Auth & Database)
│   ├── ThemeProvider (Theme Management)
│   │   ├── Navbar (Navigation)
│   │   └── Main Content
│   │       ├── HomePage
│   │       │   ├── ActionCard (Quick Actions)
│   │       │   ├── MeetingModal (Start/Join)
│   │       │   └── MeetingCard (Interview List)
│   │       │
│   │       ├── SchedulePage
│   │       │   └── InterviewScheduleUI
│   │       │       ├── Calendar (Date Picker)
│   │       │       ├── Select (Time/Candidate)
│   │       │       └── UserInfo (Interviewer Selection)
│   │       │
│   │       ├── MeetingPage
│   │       │   ├── MeetingSetup (Pre-meeting)
│   │       │   └── MeetingRoom
│   │       │       ├── Video Layout (Grid/Speaker)
│   │       │       ├── CodeEditor (Monaco)
│   │       │       ├── CallControls
│   │       │       └── EndCallButton
│   │       │
│   │       └── DashboardPage
│   │           ├── MeetingCard (Interview Cards)
│   │           └── CommentDialog
│   │               ├── ScrollArea (Comments)
│   │               ├── Rating Select
│   │               └── Textarea (Comment Input)
│   │
│   └── Toaster (Notifications)
```

### Data Flow

**Interview Scheduling Flow:**
```
InterviewScheduleUI
  ↓ (user input)
Form State (React useState)
  ↓ (submit)
createInterview Mutation (Convex)
  ↓ (success)
Stream.io Call Creation
  ↓ (both created)
Database Updated
  ↓ (real-time)
UI Auto-updates (Convex subscription)
```

**Meeting Join Flow:**
```
MeetingCard (Click)
  ↓
Navigate to /meeting/[id]
  ↓
useGetCallById Hook
  ↓
Fetch Interview Data (Convex)
  ↓
Stream.io Call Join
  ↓
MeetingSetup Component
  ↓ (setup complete)
MeetingRoom Component
  ↓
Video Call Active
```

**Comment Submission Flow:**
```
CommentDialog (Open)
  ↓
Display Existing Comments (useQuery)
  ↓
User Input (Rating + Comment)
  ↓
addComment Mutation (Convex)
  ↓
Database Updated
  ↓ (real-time)
Comments List Auto-updates
```

### Key Component Interactions

**MeetingRoom ↔ CodeEditor:**
- Resizable panels share space
- Code editor syncs in real-time
- Both components use Stream.io context

**InterviewScheduleUI ↔ Stream.io:**
- Creates Stream call before database record
- Links Stream call ID to interview
- Handles errors for both systems

**Dashboard ↔ CommentDialog:**
- Dashboard displays interview cards
- Clicking comment button opens dialog
- Dialog fetches comments for that interview

**HomePage ↔ useUserRole:**
- Determines user role (interviewer/candidate)
- Shows different UI based on role
- Controls access to features

### State Management Patterns

**Global State (Convex):**
- User data
- Interview list
- Comments
- Real-time updates

**Local State (React):**
- Form inputs
- UI toggles (modals, dropdowns)
- Component-specific state
- Theme preferences

**Server State (Stream.io):**
- Video call state
- Participant list
- Media device status
- Call controls

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Authentication

The app uses Clerk for authentication. Users must sign in to access the platform. Roles are assigned based on Clerk user metadata:
- **Interviewer**: Can schedule interviews, manage dashboard, and review candidates
- **Candidate**: Can view and join scheduled interviews

## 🎨 Customization

### Themes
The app supports dark and light themes. Users can toggle themes using the theme switcher in the navbar.

### Styling
Styles are managed with Tailwind CSS. Customize colors and themes in `tailwind.config.ts`.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- Clerk keys
- Convex deployment URL
- Stream.io credentials

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Convex](https://www.convex.dev/) - Backend platform
- [Clerk](https://clerk.com/) - Authentication
- [Stream.io](https://getstream.io/) - Video SDK
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📞 Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js and modern web technologies.

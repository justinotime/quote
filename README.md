# Quote - Minimalist Writing Platform

A beautiful, minimalist writing platform inspired by Medium, Steve Jobs, and Frank Ocean. Built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

## Vision

**Write hard. Write true. Everything else is noise.**

Quote is designed to cut through the clutter and provide a clean, focused environment for writers to share their stories.

## Features

- **Minimalist Design**: Clean, distraction-free interface
- **Authentication**: Google, X (Twitter), and email sign-in
- **Rich Text Editor**: Full-featured TipTap editor with auto-save
- **Draft Management**: Create, edit, and publish posts
- **User Feed**: Discover and read published content with pagination
- **Individual Post Reading**: Dedicated pages for each published post
- **Contact Form**: Working contact form with validation and sanitization
- **Responsive**: Works beautifully on all devices
- **PWA Ready**: Install as a native app
- **Modern Stack**: Built with the latest web technologies

## Writing Interface

### Rich Text Editor: TipTap

Quote uses **TipTap** as its rich text editor, chosen for its:
- **Notion-like experience**: Familiar, intuitive interface
- **Extensibility**: Highly customizable with plugins and extensions
- **Collaboration-ready**: Built-in support for real-time collaboration
- **Markdown support**: Write in Markdown or rich text
- **Modern architecture**: Built on ProseMirror for reliability

### Editor Features
- **Rich formatting**: Bold, italic, headings, lists, quotes
- **Advanced elements**: Tables, code blocks, images, embeds
- **Markdown shortcuts**: Type `#` for headings, `*` for lists, etc.
- **Auto-save**: Drafts are automatically saved every 2 seconds
- **Publishing workflow**: Draft → Review → Publish
- **Version history**: Track changes and revert if needed

### Technical Implementation
- **Data storage**: Content saved as HTML with metadata
- **Real-time sync**: Changes sync across devices
- **Offline support**: Write without internet connection
- **Export options**: Export as Markdown, HTML, or PDF

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quote
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
app/
├── Components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   │   ├── Navbar.tsx  # Navigation component
│   │   ├── TipTapEditor.tsx # Rich text editor
│   │   ├── SignInModal.tsx  # Authentication modals
│   │   └── SignUpModal.tsx
│   ├── HeroSection.tsx # Landing page hero
│   └── FooterSection.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── lib/               # Utility functions
│   ├── supabase.ts    # Supabase client & auth
│   ├── supabase-posts.ts # Posts API
│   └── utils.ts       # Helper functions (includes HTML sanitization)
├── api/               # API routes
│   └── contact/       # Contact form backend
├── auth/              # Authentication routes
├── about/             # About page
├── blog/              # Blog page
├── careers/           # Careers page
├── contact/           # Contact page
├── help/              # Help page
├── feed/              # User feed (authenticated)
├── draft/             # Writing interface (authenticated)
├── post/              # Individual post reading
│   └── [id]/          # Dynamic post routes
├── profile/           # User profile (authenticated)
└── settings/          # User settings (authenticated)
```

## Database Schema (Key Tables)

- **users**: User profiles, social links, verification
- **posts**: Posts with metadata, stats, status
- **comments**: Comment system (threaded)
- **likes**: User engagement
- **follows**: Social following
- **tags** & **post_tags**: Content categorization
- **reading_lists**: User-curated collections
- **EditorsPick, Writers, analytics**: Editorial and analytics features

> **Note:** The schema is robust and ready for engagement features, but most are not yet implemented in the UI.

## Design System

- **Colors**: Minimalist palette with black, white, and accent blue (#35b8be)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing system using Tailwind CSS
- **Animations**: Subtle, purposeful animations with Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Rich Text Editor**: TipTap (ProseMirror-based)
- **Security**: DOMPurify for HTML sanitization
- **Deployment**: Vercel (recommended)

## PWA Features

- Installable as a native app
- Offline support (coming soon)
- Push notifications (coming soon)

## Roadmap

### Completed
- [x] Authentication system (Google, X, Email)
- [x] Rich text editor with TipTap
- [x] Draft creation and auto-save
- [x] Post publishing workflow
- [x] User feed with published posts and pagination
- [x] User profile and settings pages
- [x] Responsive design and navigation
- [x] PWA manifest and setup
- [x] Complete page structure (About, Blog, Careers, Contact, Help)
- [x] Build system optimization (TypeScript, ESLint, Image optimization)
- [x] Production deployment readiness
- [x] Individual post reading pages (`/post/[id]`)
- [x] **Security Fixes**: HTML sanitization with DOMPurify
- [x] **Contact Form**: Backend API with validation and sanitization
- [x] **Feed Pagination**: Working "Load More" functionality
- [x] **View Counts**: Post view tracking and display

### In Progress
- [ ] Comments and reactions system (DB tables exist, UI needed)
- [ ] User following and discovery
- [ ] Search functionality
- [ ] Row Level Security (RLS) policies implementation

### Upcoming
- [ ] Performance optimization (caching, lazy loading, CDN)
- [ ] Rate limiting on API endpoints
- [ ] Content moderation and reporting tools
- [ ] Advanced editor features (collaboration, version history)
- [ ] Content discovery and recommendations
- [ ] Newsletter and subscription features
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Accessibility improvements

## Current Issues & Development Status

### Issues (Based on what I see)

#### Unauthenticated users
**Landing page**
- Change navbar font size on landing pages
- Add Typer on the title "Write hard. Write true. Everything else is noise."
- Change animation with sign in, get started card pulls up
- Add a dark/light mode

**Us/About page**
- Edit the boringness of the about page. 
- Add decorative background and typography
- Change the navbar
- Add a "Start reading", "Start writing", "Become a member"
- Add a footer
    - Simimilar to the landing page

**Blog page**
- Add a newsletter
- add a product news, latest, newsletter kinda navbar to the left
- To the right social medias and follow button
- Have a section (Get the best of medium delivered to you daily)

**Careers page**
- Similar to "Our culture" from monkeytops.net
- Similar to https://openai.com/careers/

**Contact**
- Improve the page itself


### Recently Fixed (Latest Updates)
- **TipTap History Plugin Conflict**:  Fixed - Removed duplicate History extension causing runtime errors
- **Contact Form Frontend**:  Fixed - Form now properly sends data to backend API with success/error handling
- **XSS Vulnerability**: Fixed - Implemented HTML sanitization using DOMPurify
- **Contact Form Backend**:  Fixed - Added API route with validation and sanitization
- **Feed Pagination**: Fixed - Working "Load More" button with proper state management
- **View Count Tracking**: Fixed - Posts now track and display view counts
- **Build Errors**: Fixed - Removed unused imports, fixed TypeScript issues
- **Image Optimization**: Fixed - Replaced `<img>` with Next.js `<Image>` components
- **Debug Mode**: Fixed - Removed Supabase debug mode for production
- **Type Safety**: Fixed - Properly typed all TypeScript interfaces
- **Individual Post Reading**: Fixed - Implemented `/post/[id]` dynamic route for reading published posts

### Critical Issues (Must Fix Before Production)
- **Row Level Security (RLS)**: **CRITICAL** - No database-level security policies implemented
- **Rate Limiting**: **CRITICAL** - No rate limiting on API endpoints
- **CORS Configuration**: **CRITICAL** - No CORS headers configured
- **Content Security Policy**: **CRITICAL** - No CSP headers for XSS protection
- **Error Boundaries**: **MEDIUM** - No React error boundaries for component failures
- **Accessibility**: **MEDIUM** - No ARIA labels, keyboard navigation, or screen reader support
- **Performance**: **MEDIUM** - No caching, lazy loading, or CDN implementation
- **User Engagement**: **HIGH** - Comments, likes, follows, and search exist in DB but not in UI

### Remaining Technical Debt & Performance Issues
- **Offline Support**: PWA manifest exists but no service worker logic
- **Error Handling**: Some API errors only logged to console, not surfaced to users
- **Database Optimization**: No indexes or query optimization implemented

### Missing Core Features
- **User Engagement**: Comments, likes, follows, and search not implemented in UI
- **User Discovery**: No follow/unfollow system or user profiles beyond basic info
- **Content Discovery**: No trending, recommendations, or tag-based discovery
- **Content Moderation**: No reporting, moderation tools, or abuse prevention
- **Analytics**: No insights into post performance for users

### Known Bugs & Issues
- **Email Verification**: No explicit check for email verification before actions
- **Error Boundaries**: Missing error boundaries for API failures
- **Placeholder Pages**: Blog and Careers pages show "Coming soon"
- **Contact Form Storage**: Currently logs to console only, not stored in database
- **Performance Issues**: No lazy loading, caching, or CDN implementation
- **Accessibility Issues**: Missing ARIA labels, keyboard navigation, screen reader support

### Updated Development Priorities (Critical Path)
1. **Implement RLS Policies** - Add Row Level Security to Supabase tables (**CRITICAL**)
2. **Add Rate Limiting** - Protect API endpoints from abuse (**CRITICAL**)
3. **Add CORS & CSP** - Security headers for production (**CRITICAL**)
4. **Add Error Boundaries** - Prevent app crashes on component errors (**MEDIUM**)
5. **Build Engagement Features** - Comments, likes, follows, and search in UI (**HIGH**)
6. **Performance Optimization** - Caching, lazy loading, and CDN (**MEDIUM**)
7. **Accessibility Audit** - Add ARIA labels and keyboard navigation (**MEDIUM**)
8. **Database Optimization** - Add indexes and query optimization
9. **Content Moderation** - User reporting and abuse prevention

## Current State Assessment (Updated)
- **Foundation**: 9/10 - Excellent architecture and database design
- **Core Features**: 7/10 - Writing/reading work, but missing engagement features
- **User Experience**: 7/10 - Good functionality, but accessibility issues remain
- **Security**: 4/10 - CRITICAL vulnerabilities: No RLS, rate limiting, CORS, or CSP
- **Performance**: 5/10 - No caching, lazy loading, or optimization
- **Reliability**: 8/10 - Editor crashes fixed, but no error boundaries
- **Production Ready**: 4/10 - **NOT SAFE FOR PRODUCTION** due to security vulnerabilities

## Security Features

### Implemented
- **HTML Sanitization**: All user-generated content sanitized with DOMPurify
- **Input Validation**: Contact form validates and sanitizes all inputs
- **XSS Prevention**: No more `dangerouslySetInnerHTML` without sanitization
- **Form Security**: Contact form protected against injection attacks
- **Authentication**: Secure OAuth and email authentication via Supabase

### Missing (Critical)
- **Row Level Security (RLS)**: No database-level access control
- **Rate Limiting**: No API endpoint protection
- **CORS Configuration**: No cross-origin request control
- **Content Security Policy**: No CSP headers
- **Input Sanitization**: Some endpoints lack proper validation

### Planned
- **Rate Limiting**: API endpoint protection
- **Row Level Security**: Database-level access control
- **Content Moderation**: User reporting and abuse prevention
- **CORS & CSP**: Security headers implementation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- **Medium** - For their clean, distraction-free design philosophy
- **Vanity Fair** - For their exceptional article layouts and typography
- **New York Times** - For their sophisticated content presentation and reading experience
- **Steve Jobs** - For his philosophy of simplicity and focus
- **Frank Ocean** - For his artistic minimalism and attention to detail
- **TipTap** - For providing an excellent rich text editing experience
- **Supabase** - For making backend development accessible and powerful
- **DOMPurify** - For providing robust HTML sanitization

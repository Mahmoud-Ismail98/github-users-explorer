# GitHub Users Explorer

A React application that fetches and displays GitHub users with search functionality, favorites management, and infinite scrolling.

![GitHub Users Explorer Screenshot](/public/Screenshot_1.png?height=400&width=800)

----------------------------------

![GitHub Users Explorer Screenshot](/public/Screenshot_2.png?height=400&width=800)

## Features

- **GitHub API Integration**: Fetches users from GitHub's public API
- **Infinite Scroll**: Loads more users as you scroll down
- **Search Functionality**: Search within fetched users with debounced input
- **Favorites Management**: Add/remove users to favorites
- **Persistent Storage**: Favorites persist across page reloads
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark Mode**: Toggle between light and dark themes
- **Error Handling**: Comprehensive error states with retry functionality
- **Loading States**: Meaningful loading indicators
- **Unit Tests**: Jest and React Testing Library tests

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **State Management**: Zustand
- **Styling**: Tailwind CSS with shadcn/ui components
- **Testing**: Jest and React Testing Library
- **API**: GitHub REST API

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/Mahmoud-Ismail98/github-users-explorer.git
cd github-users-explorer
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install

1. Start the development server:

\`\`\`bash
npm run dev

1. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

\`\`\`bash
npm test

## Technical Design Rationale

### Architecture

The application follows a component-based architecture with a global state management approach:

- **Pages**: Represent routes in the application (Home, Favorites)
- **Components**: Reusable UI elements
- **Store**: Global state management with Zustand
- **Hooks**: Custom React hooks for specific functionality
- **Types**: TypeScript type definitions

### State Management

Zustand was chosen for state management because:

1. **Simplicity**: Simpler API compared to Redux
2. **Performance**: Minimal re-renders with selective state updates
3. **Persistence**: Easy integration with localStorage
4. **TypeScript Support**: Strong typing support

### Infinite Scroll vs. Pagination

Infinite scroll was implemented instead of traditional pagination for several reasons:

1. **User Experience**: More natural browsing experience
2. **Reduced Friction**: Users don't need to click pagination controls
3. **Mobile Friendly**: Better suited for touch interfaces
4. **Progressive Loading**: Load data as needed, improving initial load time

### Error Handling Strategy

The application implements a comprehensive error handling strategy:

1. **Error Boundaries**: Catch and display runtime errors
2. **API Error Handling**: Specific error messages based on HTTP status codes
3. **Retry Mechanism**: Automatic retry for failed API calls
4. **User Feedback**: Clear error messages with recovery options

### Performance Optimizations

1. **Debounced Search**: Prevents excessive API calls during typing
2. **Intersection Observer**: Efficient detection of scroll position
3. **Selective Rendering**: Only render what's needed based on state
4. **Memoization**: Prevent unnecessary re-renders

## Code Review Notes

### Strengths

1. **Component Separation**: Clean separation of concerns between components
2. **Type Safety**: Comprehensive TypeScript types throughout the application
3. **Error Handling**: Robust error handling with user-friendly messages
4. **Testing**: Good test coverage for critical components and store
5. **Accessibility**: Proper ARIA attributes and keyboard navigation
6. **Responsive Design**: Works well across different screen sizes

### Areas for Improvement

1. **API Rate Limiting**: Could implement more sophisticated handling of GitHub API rate limits
2. **Caching**: Could add a caching layer to reduce API calls
3. **Server-Side Rendering**: Could leverage Next.js SSR for initial data loading
4. **Authentication**: Could add GitHub authentication to increase API rate limits
5. **Virtualization**: For very large lists, could implement virtualization for better performance
6. **Internationalization**: Could add support for multiple languages




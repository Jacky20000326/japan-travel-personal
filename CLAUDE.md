# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tokyo/Fujisan travel schedule web application - a React-based single-page application for tracking a 5-day trip (2/23-2/27, 2026) with interactive timeline, spot completion tracking, and Crayon Shin-chan x Snoopy themed UI.

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Tech Stack

- **Framework**: React 18 + Vite 5
- **UI Library**: MUI v5 (Material-UI)
- **Styling**: Emotion (CSS-in-JS)
- **State Management**: React hooks + localStorage
- **Build Tool**: Vite with React plugin

## Architecture

### Data Structure

- **Schedule data** (`src/data/schedule.js`): Array of 5 day objects, each containing:
  - `date`, `weekday`, `title`
  - `items` array with two types:
    - `spot`: Location/activity with `id`, `time`, `name`, `category`, `emoji`, `image`, `note`
    - `transit`: Transportation between spots with `img` (animated GIF), `duration`
  - Categories: `restaurant`, `attraction`, `hotel`, `shopping`

### Component Hierarchy

```
App (manages currentDay state + loading)
├── LoadingScreen (2.5s animated intro)
├── Header (AppBar with trip title)
├── DayTabs (5 scrollable tabs for date selection)
└── Timeline (renders current day's items)
    ├── TransitChip (transportation info between spots)
    └── SpotCard (expandable/collapsible location cards)
        ├── ImagePlaceholder (loading state)
        └── CharacterCelebration (completion animation)
```

### State Management

- **Day selection**: `useState(0)` in App.jsx, passed to DayTabs and Timeline
- **Completion tracking**: Custom hook `useCompleted()` persists to localStorage
  - Key: `'travel-schedule-completed'`
  - Stores array of completed spot IDs
  - Methods: `toggleComplete(spotId)`, `isCompleted(spotId)`
- **Loading screen**: 2500ms timeout before showing main content

### Theme Design

Custom MUI theme (`src/theme.js`) with Crayon Shin-chan x Snoopy aesthetic:
- **Colors**: Primary blue (#3B7DD8), Secondary red (#E8453C), Background (#FFF9E6)
- **Typography**: Zen Maru Gothic, Noto Sans JP
- **Borders**: Bold 2-3px black outlines on all interactive elements
- **Cards**: Left-side colored bar (5px width) indicating category/completion status
- **Animations**: 300ms collapse transitions, fade-in for images

### Key Behaviors

1. **SpotCard collapse logic**:
   - Initially expanded if not completed
   - Clicking header toggles expand/collapse
   - Clicking "標記完成" triggers celebration animation, auto-collapses after 400ms
   - Completed cards show at 60% opacity with green checkmark

2. **Image handling**:
   - Shows `ImagePlaceholder` while loading
   - On error: displays `/images/characters/snoopy-heart.png` fallback
   - Uses `Fade` transition when image loads

3. **Background**: Fixed Snoopy crown image (`/images/snoopy-crown.png`) centered at 960px width

## File Organization

```
src/
├── main.jsx                    # Entry point with ThemeProvider
├── App.jsx                     # Root component
├── theme.js                    # MUI theme configuration
├── animations.css              # Custom CSS animations
├── components/
│   ├── Header.jsx              # AppBar with title
│   ├── DayTabs.jsx             # Date selector tabs
│   ├── Timeline.jsx            # Day's schedule container
│   ├── SpotCard.jsx            # Expandable location card
│   ├── TransitChip.jsx         # Transportation display
│   ├── ImagePlaceholder.jsx    # Loading skeleton
│   ├── CharacterCelebration.jsx # Completion animation
│   └── LoadingScreen.jsx       # Initial loading animation
├── data/
│   └── schedule.js             # Structured trip data
└── hooks/
    └── useCompleted.js         # localStorage persistence

public/
└── images/
    ├── *.jpg                   # Spot photos
    ├── characters/             # Snoopy/Shin-chan assets
    └── gif/                    # Transit animations
```

## Development Notes

- All text content is in Traditional Chinese (zh-TW)
- Mobile-first design with 44px minimum touch targets
- Uses MUI's `scrollButtons="auto"` for horizontal tab scrolling
- Image paths reference `/images/` in public directory
- No external API calls - all data is static

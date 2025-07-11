# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Court Coach is a netball-focused digital whiteboard application designed for coaches and players. The app allows quick positioning of players on a netball court and drawing of movement arrows to illustrate plays and strategies.

**Current Status**: Early development stage - contains only placeholder Python files but should be developed as a web-based Progressive Web App (PWA) using HTML5 Canvas with Konva.js.

## Architecture

### Target Technology Stack
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Canvas Library**: Konva.js for interactive court elements
- **Responsive Design**: CSS Grid/Flexbox
- **PWA Features**: Service Worker, Web App Manifest
- **Storage**: Local Storage for saving court states

### Target File Structure
```
court-coach/
├── index.html
├── css/
│   ├── styles.css
│   ├── themes.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── court.js
│   ├── players.js
│   ├── tools.js
│   └── storage.js
├── images/
│   └── icons/ (for PWA)
├── manifest.json
└── sw.js
```

## Key Features to Implement

### Court Layout
- Netball court with proper proportions (three sections: two goal circles and center circle)
- Black lines on dark gray background (#404040)
- Responsive design scaling across devices

### Player Management
- 14 draggable circular tokens (7 per team)
- Blue team (left): GS, GA, WA, C, WD, GD, GK
- Teal team (right): GS, GA, WA, C, WD, GD, GK
- Touch-friendly drag-and-drop with boundary constraints

### Drawing Tools
- Arrow tool for drawing directional indicators
- Erase tool for removing arrows (not players)
- Visual feedback for active tools

### Action Buttons
- "On-court": Place all players in standard starting positions
- "Clear court": Move all players to sidelines
- "Clear arrows": Remove all drawn arrows

## Development Commands

**Note**: Currently no build system configured. Target development should use:
- Static file serving for local development
- GitHub Pages for deployment
- No build tools required initially

## Domain Knowledge

### Netball Context
- 7 players per team with specific position roles
- Court divided into three equal sections
- Standard goal post height: 3.05m (10ft)
- Reference materials in `/reference/` directory include:
  - Under-12 netball rules research
  - Court dimensions image
  - UI mockup reference

### User Requirements
- Must work on mobile devices (primary use case)
- Touch-friendly interface for tablets
- Offline capability once loaded
- Installable as PWA
- Accessibility support including colorblind users

## Implementation Priorities

1. Core canvas setup with Konva.js
2. Draggable player tokens with positioning
3. Drawing tools (arrow and erase)
4. Action buttons functionality
5. Responsive design and touch optimization
6. PWA features and offline capability
7. Accessibility and theme options

## Important Notes

- The current Python files are placeholders and should be replaced with web technologies
- Focus on mobile-first design approach
- Dark theme is the default and primary design
- Prioritize simplicity and speed over advanced features
- Target deployment to GitHub Pages
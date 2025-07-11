# Claude Code Prompt: Court Coach - Netball Whiteboard App

## Project Overview
Create a responsive web application called "Court Coach" - a digital netball court whiteboard for coaches and players. This should be a Progressive Web App (PWA) that works seamlessly across desktop, tablet, and mobile devices.

## Core Functionality Requirements

### Court Layout
- Netball court with three sections: two goal circles (left and right) and center circle
- Court should be drawn as black lines on a dark gray background (#404040 or similar)
- Responsive design that scales properly on all devices
- Court proportions should match official netball court dimensions

### Player Tokens
- 14 draggable circular tokens total (7 per team)
- **Blue team** (left side): GS, GA, WA, C, WD, GD, GK
- **Teal/green team** (right side): GS, GA, WA, C, WD, GD, GK  
- Tokens should have white text labels on colored backgrounds
- Smooth drag-and-drop functionality with touch support
- Tokens should snap back if dragged outside reasonable court bounds

### Drawing Tools
- **Arrow tool**: Click/tap and drag to draw directional arrows on the court
- **Erase tool**: Click/tap to remove arrows (not players)
- Tools should work with both mouse and touch input
- Visual feedback showing which tool is currently active

### Action Buttons
- **"On-court"**: Place all 14 players in their standard starting positions on court
- **"Clear court"**: Remove all players from court (move to sidelines)
- **"Clear arrows"**: Remove all drawn arrows, keep players in place

## Technical Requirements

### Technology Stack
Use HTML5 Canvas with Konva.js for optimal performance:
- HTML5 + CSS3 + Vanilla JavaScript
- Konva.js library for canvas interactions
- CSS Grid/Flexbox for responsive layout
- Local Storage for saving court states
- Service Worker for PWA functionality

### Design Specifications
- **Color scheme**: Dark theme with gray (#404040) court background
- **Blue team**: #4285F4 or similar blue
- **Teal team**: #1DB584 or similar teal/green
- **Buttons**: Blue for tools, green for actions
- **Typography**: Clean, readable sans-serif fonts
- **Layout**: Uncluttered, intuitive design matching the reference mockup

### Accessibility & User Experience
- **Dark mode**: Default theme (as shown in mockup)
- **Colorblind support**: Include alternative color schemes or patterns
- **Touch-friendly**: Minimum 44px touch targets
- **Keyboard navigation**: Support for keyboard users
- **Screen reader**: Proper ARIA labels and semantic HTML
- **Responsive**: Works on phones (portrait/landscape), tablets, and desktop

### PWA Features
- **Installable**: Web app manifest for "Add to Home Screen"
- **Offline capable**: Service worker for basic offline functionality
- **Fast loading**: Optimize for mobile networks
- **Full screen**: Hide browser UI when installed

## File Structure
Create a clean, organized structure:
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

## Implementation Priorities
1. **Core canvas setup** with Konva.js and basic court drawing
2. **Draggable player tokens** with proper positioning
3. **Drawing tools** (arrow and erase functionality)
4. **Action buttons** and their respective functions
5. **Responsive design** and touch optimization
6. **PWA features** and offline capability
7. **Accessibility features** and theme options

## GitHub Pages Deployment
Set up the project for easy GitHub Pages deployment:
- Ensure all files use relative paths
- Create a simple build process if needed
- Include deployment instructions in README
- Set up GitHub Actions for automatic deployment (optional)

## Success Criteria
The app should:
- Load quickly on mobile devices
- Provide smooth drag-and-drop on touch screens
- Allow coaches to quickly set up and modify player positions
- Work offline once initially loaded
- Be installable as a PWA on mobile devices
- Support users with different abilities and color vision

## Additional Notes
- Prioritize simplicity and speed over advanced features
- Focus on the core coaching workflow: position players, draw movement arrows, reset/clear as needed
- Ensure the app feels native on mobile devices
- Test thoroughly on various screen sizes and input methods

Please create a complete, production-ready implementation with clean, well-commented code and comprehensive documentation.
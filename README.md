# Court Coach - Netball Whiteboard App

A responsive Progressive Web App (PWA) for netball coaches and players to visualize court positions and movement strategies.

## Features

### Core Functionality
- **Interactive Netball Court**: Accurate court dimensions with goal circles and thirds
- **Player Tokens**: 14 draggable player tokens (7 per team) with position labels
- **Drawing Tools**: Arrow tool for movement patterns and erase tool for cleanup
- **Action Buttons**: Quick positioning and clearing functions
- **Local Storage**: Save and load court setups
- **Multi-theme Support**: Dark, light, high-contrast, and colorblind-friendly themes

### Technical Features
- **PWA Capabilities**: Installable, works offline, responsive design
- **Touch Optimized**: Smooth drag-and-drop on mobile and tablet devices
- **Keyboard Navigation**: Full keyboard support with shortcuts
- **Accessibility**: Screen reader support, high contrast mode, reduced motion
- **Cross-platform**: Works on desktop, tablet, and mobile devices

## Quick Start

1. **Open the app**: Simply open `index.html` in a web browser
2. **Position players**: Drag player tokens from the sidelines onto the court
3. **Draw movements**: Select the arrow tool and draw movement patterns
4. **Save setup**: Use the save button to store your court arrangement
5. **Install as PWA**: Use your browser's "Add to Home Screen" option

## Usage Guide

### Tools
- **Select Tool (1/S)**: Default tool for selecting and dragging players
- **Arrow Tool (2/A)**: Click and drag to draw movement arrows
- **Erase Tool (3/E)**: Click on arrows to remove them

### Actions
- **On-court**: Automatically positions all players in standard netball positions
- **Clear court**: Moves all players back to the sidelines
- **Clear arrows**: Removes all drawn arrows from the court

### Keyboard Shortcuts
- **1, S**: Select tool
- **2, A**: Arrow tool
- **3, E**: Erase tool
- **Ctrl+S**: Save current setup
- **Ctrl+O**: Load saved setup
- **Ctrl+R**: Position players on court
- **Ctrl+C**: Clear court
- **F1**: Show help dialog
- **F11**: Toggle fullscreen
- **Escape**: Return to select tool

## Installation

### Development Setup
1. Clone or download the repository
2. Open `index.html` in a web browser
3. No build process required - it's a static web app

### Production Deployment
1. Upload all files to a web server
2. Ensure HTTPS is enabled for full PWA functionality
3. Configure server to serve the correct MIME types

### GitHub Pages Deployment
1. Push the code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source as "Deploy from a branch"
4. Choose the main branch and root folder
5. The app will be available at `https://yourusername.github.io/repository-name`

## Browser Support

- **Chrome/Edge**: Full support including PWA features
- **Firefox**: Full support, PWA features may vary
- **Safari**: Good support, limited PWA features
- **Mobile browsers**: Optimized for touch interaction

## Technical Architecture

### File Structure
```
court-coach/
├── index.html          # Main HTML file
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── offline.html       # Offline fallback page
├── css/
│   ├── styles.css     # Base styles
│   ├── themes.css     # Theme variations
│   └── responsive.css # Responsive design
├── js/
│   ├── app.js         # Main application controller
│   ├── court.js       # Court rendering and management
│   ├── players.js     # Player token management
│   ├── tools.js       # Drawing tools functionality
│   └── storage.js     # Local storage management
└── images/
    └── icons/         # PWA icons (placeholder)
```

### Key Technologies
- **HTML5 Canvas**: Via Konva.js for interactive court elements
- **Vanilla JavaScript**: No framework dependencies
- **CSS Grid/Flexbox**: Responsive layout system
- **Local Storage**: Client-side data persistence
- **Service Worker**: Offline functionality and caching

## Netball Context

### Court Layout
- Standard netball court proportions (30.5m x 15.25m)
- Three equal thirds: two goal thirds and one center third
- Goal circles with 4.9m radius
- Center circle with 0.9m radius

### Player Positions
- **Blue Team**: GS, GA, WA, C, WD, GD, GK
- **Teal Team**: GS, GA, WA, C, WD, GD, GK
- Each position has specific court movement restrictions

### Standard Positions
- **Goal Shooter (GS)**: Attacking third and goal circle
- **Goal Attack (GA)**: Center third, attacking third, and goal circle
- **Wing Attack (WA)**: Center third and attacking third (no goal circle)
- **Centre (C)**: All three thirds (no goal circles)
- **Wing Defence (WD)**: Center third and defensive third (no goal circle)
- **Goal Defence (GD)**: Center third, defensive third, and goal circle
- **Goal Keeper (GK)**: Defensive third and goal circle

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **High Contrast Mode**: Enhanced visibility option
- **Reduced Motion**: Respects user motion preferences
- **Touch Targets**: Minimum 44px touch areas
- **Colorblind Support**: Alternative color schemes and patterns

## Performance Optimizations

- **Efficient Rendering**: Konva.js for smooth canvas operations
- **Lazy Loading**: Resources loaded as needed
- **Caching Strategy**: Service worker caches static assets
- **Responsive Images**: Optimized for different screen sizes
- **Minimal Dependencies**: Only essential libraries included

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different devices and browsers
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests:
1. Check the browser console for error messages
2. Ensure you're using a modern browser with JavaScript enabled
3. Try clearing your browser cache and local storage
4. Test in an incognito/private window

## Changelog

### Version 1.0.0
- Initial release with full netball court functionality
- PWA capabilities with offline support
- Multi-theme support
- Comprehensive accessibility features
- Touch-optimized interface
- Local storage for court setups
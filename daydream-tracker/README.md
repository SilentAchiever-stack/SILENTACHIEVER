# Daydream Tracker

A React-based web application designed to help users monitor and manage maladaptive daydreaming patterns. The app features a beautiful linear gradient background (yellow, red, green) and provides comprehensive tracking and analysis tools.

## Features

### 🎯 Core Functionality
- **Session Timer**: Track daydreaming sessions in real-time with visual feedback
- **Session Types**: Categorize sessions (daydreaming, fantasy, rumination, planning, other)
- **Trigger Tracking**: Record what triggers daydreaming episodes
- **Notes System**: Add detailed notes about each session

### 📊 Analytics & Insights
- **Daily Progress**: Monitor daily time against set goals
- **Statistics Dashboard**: Comprehensive analytics with multiple time ranges
- **Session History**: Detailed history with search and filtering
- **Pattern Recognition**: Identify peak hours and common triggers
- **Goal Tracking**: Set and monitor daily time limits

### ⚙️ Settings & Data Management
- **Customizable Goals**: Set personal daily time limits
- **Data Export/Import**: Backup and restore your data
- **Local Storage**: All data stored securely on your device
- **Privacy First**: No external data transmission

### 🎨 Design Features
- **Linear Gradient Background**: Beautiful yellow → red → green gradient
- **Glassmorphism UI**: Modern frosted glass effect cards
- **Responsive Design**: Works perfectly on desktop and mobile
- **Smooth Animations**: Engaging transitions and hover effects
- **Intuitive Navigation**: Easy-to-use tabbed interface

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Getting Started

1. **Navigate to the project directory:**
   ```bash
   cd daydream-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the app

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Usage Guide

### Starting a Session
1. Go to the **Timer** tab
2. Select session type and optionally add a trigger
3. Click "Start Session" to begin tracking
4. Use pause/resume as needed
5. Click "End Session" when finished
6. Add notes about the session

### Viewing History
1. Navigate to the **History** tab
2. Use search and filters to find specific sessions
3. Sessions are grouped by date with daily totals
4. Delete unwanted sessions if needed

### Analyzing Patterns
1. Visit the **Statistics** tab
2. Select different time ranges (week, month, year, all time)
3. Review session types, common triggers, and time patterns
4. Monitor progress against your daily goals

### Managing Settings
1. Go to the **Settings** tab
2. Adjust your daily goal and preferences
3. Export data for backup
4. Import previously exported data
5. Reset settings or clear all data if needed

## Technical Details

### Built With
- **React 18**: Modern React with hooks
- **CSS3**: Custom styling with gradients and animations
- **Local Storage**: Client-side data persistence
- **Font Awesome**: Icon library for UI elements

### Project Structure
```
src/
├── components/
│   ├── Timer.js          # Session timing functionality
│   ├── SessionHistory.js # Historical data display
│   ├── Statistics.js     # Analytics and insights
│   └── Settings.js       # App configuration
├── App.js               # Main application component
├── App.css              # Global styles and gradient
└── index.js             # React entry point
```

### Key Features Implementation

#### Gradient Background
The signature linear gradient is implemented in CSS:
```css
background: linear-gradient(135deg, #ffeb3b 0%, #ff5722 50%, #4caf50 100%);
```

#### Data Persistence
All user data is stored in browser localStorage:
- Sessions data
- User settings
- Export/import functionality for data portability

#### Responsive Design
Mobile-first approach with breakpoints:
- Desktop: Full feature layout
- Tablet: Adapted grid layouts
- Mobile: Stacked components and touch-friendly controls

## Privacy & Data

- **Local Storage Only**: All data remains on your device
- **No External Servers**: No data is transmitted anywhere
- **Export Control**: You control your data with export/import features
- **Secure**: No account creation or personal information required

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is a personal tracking tool, but suggestions and improvements are welcome. The codebase is designed to be easily extensible for additional features.

## License

This project is for personal use. Feel free to modify and adapt for your own needs.

## Support

If you encounter any issues or have questions about using the app, the interface is designed to be intuitive with helpful tooltips and clear navigation.

---

**Remember**: This tool is designed to help with self-awareness and management of daydreaming patterns. For professional support with maladaptive daydreaming, consider consulting with a mental health professional.
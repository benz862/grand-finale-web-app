# Teleprompter Pro iOS App

A professional teleprompter app for iOS built with SwiftUI, featuring AI-assisted script generation, simultaneous video recording, and advanced text display with gradient fade effects.

## Features

### 🎯 Core Teleprompter Features
- **Gradient Text Fade**: Text fades from transparent at bottom to fully opaque at 3/4 screen height
- **Smooth Auto-Scroll**: Adjustable speed control (0.5x to 5x)
- **Manual Control**: Touch and drag to manually adjust scroll position
- **Professional Controls**: Play/pause, reset, speed adjustment, font size control

### 📹 Video Recording
- **Simultaneous Recording**: Record video while teleprompter is active
- **Front/Back Camera**: Easy camera switching
- **High Quality**: Supports up to 4K recording
- **Auto-Save**: Videos automatically saved to photo library

### 🤖 AI Script Generation
- **Keyword-Based**: Generate scripts from key points and keywords
- **Multiple Styles**: Formal, Casual, and News presenter styles
- **Smart Templates**: AI creates natural-flowing scripts based on your input
- **Instant Generation**: Quick script creation in 2-3 seconds

### 📝 Script Management
- **In-App Editor**: Full-featured text editor with syntax highlighting
- **Save/Load**: Local storage for multiple scripts
- **Import/Export**: Import from files or export to share
- **Script Library**: Organize and manage multiple scripts

### ⚙️ Advanced Settings
- **Text Customization**: Font size, color, opacity, and style options
- **Video Quality**: Adjustable recording quality and frame rate
- **Mirror Mode**: Support for external monitors
- **Professional Layout**: Dark theme optimized for video production

## Technical Implementation

### Architecture
- **SwiftUI**: Modern declarative UI framework
- **MVVM Pattern**: Clean separation of concerns
- **Combine Framework**: Reactive data binding
- **AVFoundation**: Professional video recording capabilities

### Key Components

#### TeleprompterView
- Main interface with camera preview background
- Gradient-masked text overlay
- Touch controls and gesture handling
- Real-time scroll position updates

#### CameraManager
- AVCaptureSession management
- Video recording with quality control
- Camera switching (front/back)
- Photo library integration

#### ScriptGenerator
- AI-powered script creation
- Multiple writing styles and templates
- Keyword processing and natural language generation
- Asynchronous generation with progress feedback

#### TeleprompterViewModel
- State management for scroll position, speed, and playback
- Auto-scroll timer with customizable speed
- Script loading and management
- Real-time updates with Combine

## Setup Instructions

### Prerequisites
- Xcode 15.0 or later
- iOS 16.0 or later
- iPhone/iPad with camera

### Installation
1. Clone or download the project files
2. Open the project in Xcode
3. Configure your development team and bundle identifier
4. Build and run on device (camera features require physical device)

### Permissions
The app requires the following permissions (automatically handled in Info.plist):
- Camera access for video recording
- Microphone access for audio recording
- Photo library access for saving videos

## Usage Guide

### Basic Operation
1. **Launch App**: Opens to main teleprompter view
2. **Load Script**: Use Scripts tab to create or edit content
3. **Start Recording**: Tap red record button to begin video capture
4. **Begin Teleprompter**: Tap play button to start text scrolling
5. **Control Speed**: Use slider to adjust scroll speed in real-time
6. **Manual Control**: Touch and drag to manually position text

### AI Script Generation
1. Navigate to Scripts tab
2. Tap "AI Script Assistant" to expand
3. Enter keywords separated by commas
4. Choose style: Formal, Casual, or News
5. Generated script appears in editor
6. Edit as needed and load to teleprompter

### Video Recording Tips
- Use landscape orientation for better framing
- Ensure good lighting on your face
- Position camera at eye level
- Test audio levels before important recordings
- Use front camera for direct eye contact

## Advanced Features

### Gradient Text Effect
The app implements a sophisticated gradient mask that creates the professional teleprompter fade effect:
- Bottom 25%: Completely transparent
- Middle 50%: Gradual fade from transparent to opaque
- Top 25%: Fully opaque before scrolling off screen

### Professional Controls
- **Speed Control**: Real-time adjustment from 0.1x to 5.0x
- **Font Scaling**: 16pt to 72pt with live preview
- **Color Customization**: Full color picker for text
- **Opacity Control**: Fine-tune text visibility

### Script Templates
The AI system includes three distinct writing styles:
- **Formal**: Professional presentation style
- **Casual**: YouTuber/vlogger friendly tone
- **News**: Broadcast journalism format

## Customization

### Extending AI Features
To add new script styles, modify the `ScriptGenerator` class:

```swift
private func generateCustomScript(keywords: [String]) -> String {
    // Implement your custom generation logic
    return customScript
}
```

### UI Modifications
The SwiftUI architecture makes it easy to customize:
- Modify colors in theme files
- Adjust layouts in view files
- Add new control options in SettingsView

### Video Settings
Customize recording parameters in `CameraManager`:
- Video quality presets
- Frame rate options
- Compression settings

## Performance Optimization

- Efficient memory usage with lazy loading
- Optimized scroll rendering with minimal redraws
- Background thread processing for AI generation
- Smart caching for improved responsiveness

## Troubleshooting

### Common Issues
1. **Camera not working**: Ensure app has camera permissions
2. **Poor video quality**: Check video settings in Settings tab
3. **Text not visible**: Adjust opacity and color settings
4. **Slow scrolling**: Reduce font size or simplify text formatting

### Performance Tips
- Close other apps to free memory
- Use newer devices for 4K recording
- Keep scripts under 10,000 words for best performance
- Restart app if experiencing issues

## Future Enhancements

### Planned Features
- Cloud sync for scripts across devices
- Advanced AI with GPT integration
- External monitor support
- Multi-language script generation
- Team collaboration features
- Professional teleprompter hardware integration

### Contributing
This project is open for contributions. Areas for improvement:
- Additional AI writing styles
- Enhanced video effects
- Better accessibility features
- Performance optimizations

## License

This project is available for educational and commercial use. Please respect camera and privacy permissions when distributing.

---

Built with ❤️ using Swift and SwiftUI

import SwiftUI
import AVFoundation

struct TeleprompterView: View {
    @EnvironmentObject var viewModel: TeleprompterViewModel
    @EnvironmentObject var cameraManager: CameraManager
    @State private var showingControls = true
    @State private var dragOffset: CGFloat = 0
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Camera Preview Background
                CameraPreviewView(cameraManager: cameraManager)
                    .ignoresSafeArea()
                
                // Teleprompter Text Overlay with Gradient
                TeleprompterTextView(
                    script: viewModel.currentScript,
                    scrollOffset: viewModel.scrollOffset,
                    fontSize: viewModel.fontSize,
                    textColor: viewModel.textColor,
                    scrollSpeed: viewModel.scrollSpeed,
                    isPlaying: viewModel.isPlaying,
                    screenHeight: geometry.size.height
                )
                .opacity(viewModel.textOpacity)
                
                // Controls Overlay
                if showingControls {
                    VStack {
                        Spacer()
                        TeleprompterControlsView()
                            .environmentObject(viewModel)
                            .environmentObject(cameraManager)
                            .padding()
                            .background(
                                Color.black.opacity(0.7)
                                    .cornerRadius(15)
                            )
                            .padding()
                    }
                    .transition(.opacity)
                }
                
                // Recording Indicator
                if cameraManager.isRecording {
                    VStack {
                        HStack {
                            RecordingIndicator()
                            Spacer()
                        }
                        Spacer()
                    }
                    .padding()
                }
            }
        }
        .onTapGesture {
            withAnimation(.easeInOut(duration: 0.3)) {
                showingControls.toggle()
            }
        }
        .gesture(
            DragGesture()
                .onChanged { value in
                    dragOffset = value.translation.y
                    viewModel.adjustScrollOffset(by: -dragOffset * 0.5)
                }
                .onEnded { _ in
                    dragOffset = 0
                }
        )
        .onAppear {
            cameraManager.setupCamera()
        }
    }
}

struct TeleprompterTextView: View {
    let script: String
    let scrollOffset: CGFloat
    let fontSize: CGFloat
    let textColor: Color
    let scrollSpeed: Double
    let isPlaying: Bool
    let screenHeight: CGFloat
    
    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(spacing: 20) {
                // Top spacer to start text from bottom
                Spacer()
                    .frame(height: screenHeight)
                
                // Script text with gradient mask
                Text(script)
                    .font(.system(size: fontSize, weight: .medium, design: .rounded))
                    .foregroundColor(textColor)
                    .multilineTextAlignment(.center)
                    .lineSpacing(8)
                    .padding(.horizontal, 40)
                    .mask(
                        // Gradient mask for fade effect
                        LinearGradient(
                            gradient: Gradient(stops: [
                                .init(color: .clear, location: 0.0),           // Bottom: transparent
                                .init(color: .black, location: 0.25),          // Fade in starts
                                .init(color: .black, location: 0.75),          // Fully opaque region
                                .init(color: .clear, location: 1.0)            // Top: fade out
                            ]),
                            startPoint: .bottom,
                            endPoint: .top
                        )
                    )
                
                // Bottom spacer
                Spacer()
                    .frame(height: screenHeight)
            }
        }
        .offset(y: scrollOffset)
        .animation(.linear(duration: scrollSpeed), value: scrollOffset)
        .disabled(true) // Disable user scrolling
    }
}

struct TeleprompterControlsView: View {
    @EnvironmentObject var viewModel: TeleprompterViewModel
    @EnvironmentObject var cameraManager: CameraManager
    
    var body: some View {
        VStack(spacing: 15) {
            // Main Controls Row
            HStack(spacing: 20) {
                // Play/Pause Button
                Button(action: {
                    viewModel.togglePlayPause()
                }) {
                    Image(systemName: viewModel.isPlaying ? "pause.circle.fill" : "play.circle.fill")
                        .font(.system(size: 50))
                        .foregroundColor(.white)
                }
                
                Spacer()
                
                // Record Button
                Button(action: {
                    if cameraManager.isRecording {
                        cameraManager.stopRecording()
                    } else {
                        cameraManager.startRecording()
                    }
                }) {
                    ZStack {
                        Circle()
                            .fill(cameraManager.isRecording ? Color.red : Color.white)
                            .frame(width: 60, height: 60)
                        
                        if cameraManager.isRecording {
                            RoundedRectangle(cornerRadius: 4)
                                .fill(Color.white)
                                .frame(width: 20, height: 20)
                        } else {
                            Circle()
                                .fill(Color.red)
                                .frame(width: 50, height: 50)
                        }
                    }
                }
                
                Spacer()
                
                // Reset Button
                Button(action: {
                    viewModel.resetScript()
                }) {
                    Image(systemName: "gobackward")
                        .font(.system(size: 30))
                        .foregroundColor(.white)
                }
            }
            
            // Speed Control
            HStack {
                Text("Speed")
                    .foregroundColor(.white)
                    .font(.caption)
                
                Slider(value: $viewModel.scrollSpeed, in: 0.5...5.0, step: 0.1)
                    .accentColor(.blue)
                
                Text("\(viewModel.scrollSpeed, specifier: "%.1f")x")
                    .foregroundColor(.white)
                    .font(.caption)
                    .frame(width: 40)
            }
            
            // Font Size Control
            HStack {
                Text("Size")
                    .foregroundColor(.white)
                    .font(.caption)
                
                Slider(value: $viewModel.fontSize, in: 16...72, step: 2)
                    .accentColor(.green)
                
                Text("\(Int(viewModel.fontSize))")
                    .foregroundColor(.white)
                    .font(.caption)
                    .frame(width: 30)
            }
        }
        .padding()
    }
}

struct RecordingIndicator: View {
    @State private var isBlinking = false
    
    var body: some View {
        HStack {
            Circle()
                .fill(Color.red)
                .frame(width: 12, height: 12)
                .opacity(isBlinking ? 0.3 : 1.0)
                .animation(.easeInOut(duration: 1.0).repeatForever(), value: isBlinking)
            
            Text("REC")
                .foregroundColor(.red)
                .font(.system(size: 14, weight: .bold))
        }
        .onAppear {
            isBlinking = true
        }
    }
}

#Preview {
    TeleprompterView()
        .environmentObject(TeleprompterViewModel())
        .environmentObject(CameraManager())
}

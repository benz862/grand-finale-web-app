import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var viewModel: TeleprompterViewModel
    @State private var selectedFont: FontOption = .rounded
    @State private var backgroundOpacity: Double = 0.3
    @State private var mirrorText: Bool = false
    @State private var showWordCount: Bool = true
    
    var body: some View {
        NavigationView {
            List {
                // Text Appearance Section
                Section("Text Appearance") {
                    // Font Size
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Font Size: \(Int(viewModel.fontSize))")
                            .font(.subheadline)
                        
                        Slider(value: $viewModel.fontSize, in: 16...72, step: 2)
                            .accentColor(.blue)
                    }
                    .padding(.vertical, 4)
                    
                    // Font Style
                    Picker("Font Style", selection: $selectedFont) {
                        ForEach(FontOption.allCases, id: \.self) { font in
                            Text(font.displayName).tag(font)
                        }
                    }
                    
                    // Text Color
                    ColorPicker("Text Color", selection: $viewModel.textColor)
                    
                    // Text Opacity
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Text Opacity: \(Int(viewModel.textOpacity * 100))%")
                            .font(.subheadline)
                        
                        Slider(value: $viewModel.textOpacity, in: 0.1...1.0, step: 0.1)
                            .accentColor(.blue)
                    }
                    .padding(.vertical, 4)
                }
                
                // Scrolling Behavior Section
                Section("Scrolling Behavior") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Default Speed: \(viewModel.scrollSpeed, specifier: "%.1f")x")
                            .font(.subheadline)
                        
                        Slider(value: $viewModel.scrollSpeed, in: 0.1...5.0, step: 0.1)
                            .accentColor(.green)
                    }
                    .padding(.vertical, 4)
                    
                    Toggle("Mirror Text (for external monitor)", isOn: $mirrorText)
                }
                
                // Video Settings Section
                Section("Video Settings") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Background Opacity: \(Int(backgroundOpacity * 100))%")
                            .font(.subheadline)
                        
                        Slider(value: $backgroundOpacity, in: 0.0...1.0, step: 0.1)
                            .accentColor(.orange)
                    }
                    .padding(.vertical, 4)
                    
                    NavigationLink("Video Quality Settings") {
                        VideoQualitySettingsView()
                    }
                }
                
                // Script Management Section
                Section("Script Management") {
                    NavigationLink("Saved Scripts") {
                        SavedScriptsView()
                    }
                    
                    Toggle("Show Word Count", isOn: $showWordCount)
                    
                    Button("Import Script from Files") {
                        // Implement file import
                    }
                    .foregroundColor(.blue)
                    
                    Button("Export Current Script") {
                        // Implement export functionality
                    }
                    .foregroundColor(.blue)
                }
                
                // App Information Section
                Section("App Information") {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundColor(.secondary)
                    }
                    
                    Button("Reset All Settings") {
                        resetToDefaults()
                    }
                    .foregroundColor(.red)
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    private func resetToDefaults() {
        viewModel.fontSize = 32
        viewModel.scrollSpeed = 1.0
        viewModel.textColor = .white
        viewModel.textOpacity = 0.9
        selectedFont = .rounded
        backgroundOpacity = 0.3
        mirrorText = false
        showWordCount = true
    }
}

enum FontOption: String, CaseIterable {
    case rounded = "rounded"
    case serif = "serif"
    case monospace = "monospace"
    case system = "system"
    
    var displayName: String {
        switch self {
        case .rounded: return "Rounded"
        case .serif: return "Serif"
        case .monospace: return "Monospace"
        case .system: return "System"
        }
    }
}

struct VideoQualitySettingsView: View {
    @State private var selectedQuality: VideoQuality = .high
    @State private var frameRate: Double = 30
    
    var body: some View {
        List {
            Section("Video Quality") {
                Picker("Quality", selection: $selectedQuality) {
                    ForEach(VideoQuality.allCases, id: \.self) { quality in
                        Text(quality.displayName).tag(quality)
                    }
                }
                .pickerStyle(.segmented)
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("Frame Rate: \(Int(frameRate)) fps")
                        .font(.subheadline)
                    
                    Slider(value: $frameRate, in: 24...60, step: 6)
                        .accentColor(.blue)
                }
                .padding(.vertical, 4)
            }
            
            Section("Storage") {
                HStack {
                    Text("Estimated file size (5 min)")
                    Spacer()
                    Text(estimatedFileSize())
                        .foregroundColor(.secondary)
                }
            }
        }
        .navigationTitle("Video Quality")
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private func estimatedFileSize() -> String {
        let baseSizeMB = selectedQuality.estimatedSizeMB
        let frameRateMultiplier = frameRate / 30.0
        let totalSize = baseSizeMB * frameRateMultiplier
        
        if totalSize < 1000 {
            return "\(Int(totalSize)) MB"
        } else {
            return "\(String(format: "%.1f", totalSize / 1000)) GB"
        }
    }
}

enum VideoQuality: String, CaseIterable {
    case low = "low"
    case medium = "medium"
    case high = "high"
    case ultra = "ultra"
    
    var displayName: String {
        switch self {
        case .low: return "Low (720p)"
        case .medium: return "Medium (1080p)"
        case .high: return "High (1080p+)"
        case .ultra: return "Ultra (4K)"
        }
    }
    
    var estimatedSizeMB: Double {
        switch self {
        case .low: return 150
        case .medium: return 300
        case .high: return 500
        case .ultra: return 1200
        }
    }
}

struct SavedScriptsView: View {
    @StateObject private var scriptStorage = ScriptStorage.shared
    @State private var showingDeleteAlert = false
    @State private var scriptToDelete: SavedScript?
    
    var body: some View {
        List {
            ForEach(scriptStorage.scripts) { script in
                VStack(alignment: .leading, spacing: 4) {
                    Text(script.title)
                        .font(.headline)
                    
                    Text(script.content.prefix(100) + "...")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                    
                    Text(script.createdDate.formatted(date: .abbreviated, time: .shortened))
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                    Button("Delete") {
                        scriptToDelete = script
                        showingDeleteAlert = true
                    }
                    .tint(.red)
                }
            }
        }
        .navigationTitle("Saved Scripts")
        .navigationBarTitleDisplayMode(.inline)
        .alert("Delete Script", isPresented: $showingDeleteAlert) {
            Button("Cancel", role: .cancel) {}
            Button("Delete", role: .destructive) {
                if let script = scriptToDelete {
                    deleteScript(script)
                }
            }
        } message: {
            Text("Are you sure you want to delete this script?")
        }
    }
    
    private func deleteScript(_ script: SavedScript) {
        scriptStorage.scripts.removeAll { $0.id == script.id }
        if let data = try? JSONEncoder().encode(scriptStorage.scripts) {
            UserDefaults.standard.set(data, forKey: "SavedScripts")
        }
    }
}

#Preview {
    SettingsView()
        .environmentObject(TeleprompterViewModel())
}

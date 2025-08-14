import SwiftUI
import AVFoundation

struct ContentView: View {
    @StateObject private var teleprompterViewModel = TeleprompterViewModel()
    @StateObject private var cameraManager = CameraManager()
    @StateObject private var scriptGenerator = ScriptGenerator()
    
    var body: some View {
        NavigationView {
            TabView {
                // Main Teleprompter View
                TeleprompterView()
                    .environmentObject(teleprompterViewModel)
                    .environmentObject(cameraManager)
                    .tabItem {
                        Image(systemName: "play.rectangle")
                        Text("Teleprompter")
                    }
                
                // Script Editor View
                ScriptEditorView()
                    .environmentObject(teleprompterViewModel)
                    .environmentObject(scriptGenerator)
                    .tabItem {
                        Image(systemName: "doc.text")
                        Text("Scripts")
                    }
                
                // Settings View
                SettingsView()
                    .environmentObject(teleprompterViewModel)
                    .tabItem {
                        Image(systemName: "gear")
                        Text("Settings")
                    }
            }
        }
    }
}

#Preview {
    ContentView()
}

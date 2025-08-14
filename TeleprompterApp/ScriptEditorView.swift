import SwiftUI
import Foundation

struct ScriptEditorView: View {
    @EnvironmentObject var teleprompterViewModel: TeleprompterViewModel
    @EnvironmentObject var scriptGenerator: ScriptGenerator
    
    @State private var editingScript = ""
    @State private var keywords = ""
    @State private var scriptTitle = ""
    @State private var showingAIAssist = false
    @State private var isGenerating = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 16) {
                // Script Title
                TextField("Script Title", text: $scriptTitle)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding(.horizontal)
                
                // AI Assist Section
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("AI Script Assistant")
                            .font(.headline)
                            .foregroundColor(.primary)
                        
                        Spacer()
                        
                        Button(action: {
                            showingAIAssist.toggle()
                        }) {
                            Image(systemName: showingAIAssist ? "chevron.up" : "chevron.down")
                                .foregroundColor(.blue)
                        }
                    }
                    
                    if showingAIAssist {
                        VStack(spacing: 12) {
                            // Keywords Input
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Keywords/Key Points:")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                                
                                TextEditor(text: $keywords)
                                    .frame(height: 100)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                                    )
                                    .overlay(
                                        Group {
                                            if keywords.isEmpty {
                                                Text("Enter key points, topics, or keywords separated by commas...")
                                                    .foregroundColor(.gray)
                                                    .padding(8)
                                                    .allowsHitTesting(false)
                                            }
                                        },
                                        alignment: .topLeading
                                    )
                            }
                            
                            // AI Generation Buttons
                            HStack(spacing: 12) {
                                Button(action: {
                                    generateScript(type: .formal)
                                }) {
                                    Text("Generate Formal")
                                        .font(.subheadline)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 8)
                                        .background(Color.blue)
                                        .foregroundColor(.white)
                                        .cornerRadius(8)
                                }
                                
                                Button(action: {
                                    generateScript(type: .casual)
                                }) {
                                    Text("Generate Casual")
                                        .font(.subheadline)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 8)
                                        .background(Color.green)
                                        .foregroundColor(.white)
                                        .cornerRadius(8)
                                }
                                
                                Button(action: {
                                    generateScript(type: .news)
                                }) {
                                    Text("News Style")
                                        .font(.subheadline)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 8)
                                        .background(Color.orange)
                                        .foregroundColor(.white)
                                        .cornerRadius(8)
                                }
                                
                                Spacer()
                            }
                            
                            if isGenerating {
                                HStack {
                                    ProgressView()
                                        .scaleEffect(0.8)
                                    Text("Generating script...")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(12)
                    }
                }
                .padding(.horizontal)
                
                // Script Editor
                VStack(alignment: .leading, spacing: 8) {
                    Text("Script Content:")
                        .font(.headline)
                        .padding(.horizontal)
                    
                    TextEditor(text: $editingScript)
                        .font(.system(size: 16, design: .rounded))
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                        )
                        .overlay(
                            Group {
                                if editingScript.isEmpty {
                                    Text("Type your script here or use AI assistance above...")
                                        .foregroundColor(.gray)
                                        .padding(8)
                                        .allowsHitTesting(false)
                                }
                            },
                            alignment: .topLeading
                        )
                        .padding(.horizontal)
                }
                
                // Action Buttons
                HStack(spacing: 16) {
                    Button(action: {
                        loadScript()
                    }) {
                        Text("Load to Teleprompter")
                            .font(.headline)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(12)
                    }
                    
                    Button(action: {
                        saveScript()
                    }) {
                        Text("Save Script")
                            .font(.headline)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.green)
                            .foregroundColor(.white)
                            .cornerRadius(12)
                    }
                }
                .padding(.horizontal)
                
                Spacer()
            }
            .navigationTitle("Script Editor")
            .navigationBarTitleDisplayMode(.inline)
        }
        .onAppear {
            editingScript = teleprompterViewModel.currentScript
        }
    }
    
    // MARK: - Methods
    
    private func generateScript(type: ScriptType) {
        guard !keywords.isEmpty else { return }
        
        isGenerating = true
        
        scriptGenerator.generateScript(
            keywords: keywords,
            type: type
        ) { result in
            DispatchQueue.main.async {
                isGenerating = false
                switch result {
                case .success(let script):
                    editingScript = script
                case .failure(let error):
                    print("Error generating script: \(error)")
                    // Could show an alert here
                }
            }
        }
    }
    
    private func loadScript() {
        teleprompterViewModel.loadScript(editingScript)
    }
    
    private func saveScript() {
        // Implementation for saving script to local storage
        let script = SavedScript(
            id: UUID(),
            title: scriptTitle.isEmpty ? "Untitled Script" : scriptTitle,
            content: editingScript,
            createdDate: Date()
        )
        
        // Save to UserDefaults or Core Data
        ScriptStorage.shared.saveScript(script)
    }
}

enum ScriptType {
    case formal
    case casual
    case news
}

struct SavedScript: Codable, Identifiable {
    let id: UUID
    let title: String
    let content: String
    let createdDate: Date
}

class ScriptStorage: ObservableObject {
    static let shared = ScriptStorage()
    private let key = "SavedScripts"
    
    @Published var scripts: [SavedScript] = []
    
    init() {
        loadScripts()
    }
    
    func saveScript(_ script: SavedScript) {
        scripts.append(script)
        saveToUserDefaults()
    }
    
    private func saveToUserDefaults() {
        if let data = try? JSONEncoder().encode(scripts) {
            UserDefaults.standard.set(data, forKey: key)
        }
    }
    
    private func loadScripts() {
        if let data = UserDefaults.standard.data(forKey: key),
           let decodedScripts = try? JSONDecoder().decode([SavedScript].self, from: data) {
            scripts = decodedScripts
        }
    }
}

#Preview {
    ScriptEditorView()
        .environmentObject(TeleprompterViewModel())
        .environmentObject(ScriptGenerator())
}

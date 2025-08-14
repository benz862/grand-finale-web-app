import SwiftUI
import Combine
import Foundation

class TeleprompterViewModel: ObservableObject {
    @Published var currentScript: String = """
    Hey everyone! Welcome to today's video!
    
    I wanted to start by saying a huge THANK YOU to all of my subscribers and followers for being so amazing and supportive.
    
    Today we're going to be talking about something really exciting that I think you're all going to love.
    
    But before we dive in, don't forget to hit that subscribe button and turn on notifications so you never miss any of our content.
    
    Alright, let's get started with today's topic...
    """
    
    @Published var isPlaying: Bool = false
    @Published var scrollOffset: CGFloat = 0
    @Published var scrollSpeed: Double = 1.0
    @Published var fontSize: CGFloat = 32
    @Published var textColor: Color = .white
    @Published var textOpacity: Double = 0.9
    
    private var scrollTimer: Timer?
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        setupScrolling()
    }
    
    private func setupScrolling() {
        // Auto-scroll when playing
        $isPlaying
            .sink { [weak self] playing in
                if playing {
                    self?.startAutoScroll()
                } else {
                    self?.stopAutoScroll()
                }
            }
            .store(in: &cancellables)
    }
    
    func togglePlayPause() {
        isPlaying.toggle()
    }
    
    func resetScript() {
        scrollOffset = 0
        isPlaying = false
    }
    
    func loadScript(_ script: String) {
        currentScript = script
        resetScript()
    }
    
    func adjustScrollOffset(by amount: CGFloat) {
        scrollOffset += amount
    }
    
    private func startAutoScroll() {
        stopAutoScroll()
        
        scrollTimer = Timer.scheduledTimer(withTimeInterval: 0.016, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            
            DispatchQueue.main.async {
                self.scrollOffset -= CGFloat(self.scrollSpeed * 2.0)
            }
        }
    }
    
    private func stopAutoScroll() {
        scrollTimer?.invalidate()
        scrollTimer = nil
    }
    
    deinit {
        stopAutoScroll()
    }
}

class ScriptGenerator: ObservableObject {
    func generateScript(keywords: String, type: ScriptType, completion: @escaping (Result<String, Error>) -> Void) {
        // Simulate AI script generation with a delay
        DispatchQueue.global().asyncAfter(deadline: .now() + 2.0) {
            let script = self.createScript(from: keywords, type: type)
            completion(.success(script))
        }
    }
    
    private func createScript(from keywords: String, type: ScriptType) -> String {
        let keywordArray = keywords.components(separatedBy: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
        
        switch type {
        case .formal:
            return generateFormalScript(keywords: keywordArray)
        case .casual:
            return generateCasualScript(keywords: keywordArray)
        case .news:
            return generateNewsScript(keywords: keywordArray)
        }
    }
    
    private func generateFormalScript(keywords: [String]) -> String {
        var script = "Good day, and thank you for joining us.\n\n"
        
        script += "Today, I'd like to discuss several important topics that are relevant to our current situation.\n\n"
        
        for (index, keyword) in keywords.enumerated() {
            if index == 0 {
                script += "First, let's examine \(keyword.lowercased()). This is a crucial aspect that deserves our attention because it impacts our understanding of the broader context.\n\n"
            } else if index == keywords.count - 1 {
                script += "Finally, we must consider \(keyword.lowercased()). This concluding point ties together all the elements we've discussed and provides a clear path forward.\n\n"
            } else {
                script += "Next, we should address \(keyword.lowercased()). This element is significant because it connects to our previous points while introducing new considerations.\n\n"
            }
        }
        
        script += "In conclusion, these topics provide us with a comprehensive framework for understanding the subject at hand. Thank you for your attention."
        
        return script
    }
    
    private func generateCasualScript(keywords: [String]) -> String {
        var script = "Hey everyone! Welcome back to the channel!\n\n"
        
        script += "I'm super excited to talk to you today about some really cool stuff that's been on my mind lately.\n\n"
        
        for (index, keyword) in keywords.enumerated() {
            if index == 0 {
                script += "So first up, let's chat about \(keyword.lowercased()). I've been thinking about this a lot, and I think you're going to find it as interesting as I do!\n\n"
            } else if index == keywords.count - 1 {
                script += "And last but definitely not least, we've got to talk about \(keyword.lowercased()). This is probably my favorite part of what we're discussing today!\n\n"
            } else {
                script += "Oh, and another thing I wanted to mention is \(keyword.lowercased()). This is something that really caught my attention and I think you'll love it too.\n\n"
            }
        }
        
        script += "That's a wrap for today! Don't forget to like this video if it helped you out, and subscribe for more content like this. See you in the next one!"
        
        return script
    }
    
    private func generateNewsScript(keywords: [String]) -> String {
        var script = "Good evening. I'm here with your latest update.\n\n"
        
        for (index, keyword) in keywords.enumerated() {
            if index == 0 {
                script += "Tonight's top story concerns \(keyword.lowercased()). Sources indicate this development has significant implications for the community.\n\n"
            } else if index == keywords.count - 1 {
                script += "In other news, \(keyword.lowercased()) continues to be a topic of interest. We'll continue monitoring this situation and bring you updates as they become available.\n\n"
            } else {
                script += "Meanwhile, \(keyword.lowercased()) has also been making headlines. Officials are closely watching these developments.\n\n"
            }
        }
        
        script += "That concludes tonight's update. We'll be back with more news at the top of the hour. Thank you for watching."
        
        return script
    }
}

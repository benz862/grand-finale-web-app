// FIXED CAPTION EDITOR - Copy this to replace your CaptionEditorView

// MARK: - Caption Editor View
struct CaptionEditorView: View {
    @Binding var videoURL: URL
    @State private var captionLines: [CaptionLine] = []
    @State private var originalCaptions: [CaptionLine] = []
    @State private var player: AVPlayer
    @State private var isLoading = true
    @State private var isApplying = false
    @State private var currentTime: TimeInterval = 0
    
    @State private var captionFontSize: CGFloat = 24
    @State private var highlightColor: Color = .yellow
    
    @Environment(\.presentationMode) var presentationMode
    
    init(videoURL: Binding<URL>) {
        self._videoURL = videoURL
        _player = State(initialValue: AVPlayer(url: videoURL.wrappedValue))
    }
    
    var body: some View {
        NavigationView {
            VStack {
                ZStack {
                    VideoPlayer(player: player)
                    
                    // Caption preview overlay
                    VStack {
                        Spacer()
                        karaokeView()
                            .padding(.bottom, 30)
                    }
                    .onAppear {
                        player.addPeriodicTimeObserver(forInterval: CMTime(seconds: 0.1, preferredTimescale: 600), queue: .main) { time in
                            self.currentTime = time.seconds
                        }
                    }
                }
                
                if isLoading {
                    ProgressView("Generating Captions...")
                        .padding()
                } else if isApplying {
                    ProgressView("Applying Captions to Video...")
                        .padding()
                } else {
                    // FIXED: Better caption editing interface
                    VStack {
                        Text("Edit Captions (\(captionLines.count) lines)")
                            .font(.headline)
                            .padding(.top)
                        
                        List {
                            ForEach($captionLines) { $line in
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Time: \(String(format: "%.1f", line.startTime))s - \(String(format: "%.1f", line.endTime))s")
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                    
                                    TextField("Caption text", text: $line.text, axis: .vertical)
                                        .textFieldStyle(RoundedBorderTextFieldStyle())
                                }
                                .padding(.vertical, 2)
                            }
                            .onDelete(perform: deleteCaption)
                        }
                    }
                }
                
                // Caption styling controls
                if !isLoading && !isApplying {
                    VStack {
                        HStack {
                            Text("Font Size: \(Int(captionFontSize))")
                            Slider(value: $captionFontSize, in: 16...48, step: 1)
                        }
                        ColorPicker("Caption Color", selection: $highlightColor)
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(10)
                    .padding(.horizontal)
                }
            }
            .navigationTitle("Caption Editor")
            .navigationBarItems(
                leading: Button("Undo") {
                    self.captionLines = self.originalCaptions
                }.disabled(isApplying),
                
                trailing: HStack {
                    Button("Preview") {
                        // Reset player to beginning to see captions
                        player.seek(to: .zero)
                        player.play()
                    }
                    .disabled(isApplying)
                    
                    Button("Apply") {
                        Task {
                            await applyCaptionsToVideo()
                        }
                    }
                    .disabled(isApplying || captionLines.isEmpty)
                }
            )
            .onAppear(perform: generateCaptions)
        }
    }
    
    @ViewBuilder
    private func karaokeView() -> some View {
        // Show current caption line with word-by-word highlighting
        if let currentLine = captionLines.first(where: { currentTime >= $0.startTime && currentTime <= $0.endTime }) {
            HStack(spacing: 0) {
                ForEach(currentLine.words) { word in
                    Text(word.text + " ")
                        .font(.system(size: captionFontSize, weight: .bold))
                        .foregroundColor(currentTime >= word.startTime ? highlightColor : .white)
                        .shadow(color: .black, radius: 2)
                }
            }
            .padding(.horizontal)
            .background(Color.black.opacity(0.5))
            .cornerRadius(10)
        } else {
            Text(" ") // Keep space for layout consistency
        }
    }
    
    private func deleteCaption(at offsets: IndexSet) {
        captionLines.remove(atOffsets: offsets)
    }
    
    func generateCaptions() {
        SFSpeechRecognizer.requestAuthorization { authStatus in
            guard authStatus == .authorized else {
                print("Speech recognition permission not granted.")
                DispatchQueue.main.async { 
                    isLoading = false 
                }
                return
            }
            
            let recognizer = SFSpeechRecognizer()
            let request = SFSpeechURLRecognitionRequest(url: videoURL)
            request.shouldReportPartialResults = false
            request.addsPunctuation = true
            
            recognizer?.recognitionTask(with: request) { (result, error) in
                guard let result = result else {
                    print("Recognition failed: \(error?.localizedDescription ?? "Unknown error")")
                    DispatchQueue.main.async { isLoading = false }
                    return
                }
                
                if result.isFinal {
                    var lines: [CaptionLine] = []
                    
                    // FIXED: Use only bestTranscription to avoid duplicates
                    if let bestTranscription = result.bestTranscription {
                        var currentLineWords: [Word] = []
                        
                        for segment in bestTranscription.segments {
                            let newWord = Word(
                                text: segment.substring, 
                                startTime: segment.timestamp, 
                                duration: segment.duration
                            )
                            currentLineWords.append(newWord)
                            
                            // Create new line every 6 words or at natural breaks
                            if currentLineWords.count >= 6 || segment.substring.hasSuffix(".") || segment.substring.hasSuffix("!") || segment.substring.hasSuffix("?") {
                                if !currentLineWords.isEmpty {
                                    lines.append(CaptionLine(words: currentLineWords))
                                    currentLineWords = []
                                }
                            }
                        }
                        
                        // Add any remaining words
                        if !currentLineWords.isEmpty {
                            lines.append(CaptionLine(words: currentLineWords))
                        }
                    }
                    
                    DispatchQueue.main.async {
                        self.captionLines = lines
                        self.originalCaptions = lines
                        self.isLoading = false
                        print("Generated \(lines.count) caption lines")
                    }
                }
            }
        }
    }
    
    // ADDED: Function to actually burn captions into the video
    func applyCaptionsToVideo() async {
        guard !captionLines.isEmpty else {
            DispatchQueue.main.async {
                presentationMode.wrappedValue.dismiss()
            }
            return
        }
        
        DispatchQueue.main.async {
            isApplying = true
        }
        
        let asset = AVURLAsset(url: videoURL)
        
        guard let exportSession = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetHighestQuality) else {
            print("Failed to create export session")
            DispatchQueue.main.async {
                isApplying = false
                presentationMode.wrappedValue.dismiss()
            }
            return
        }
        
        // Create new video with burned-in captions
        let composition = AVMutableComposition()
        
        // Add video track
        guard let videoTrack = asset.tracks(withMediaType: .video).first,
              let compositionVideoTrack = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid) else {
            DispatchQueue.main.async {
                isApplying = false
                presentationMode.wrappedValue.dismiss()
            }
            return
        }
        
        do {
            try compositionVideoTrack.insertTimeRange(CMTimeRange(start: .zero, duration: asset.duration), of: videoTrack, at: .zero)
        } catch {
            print("Failed to insert video: \(error)")
            DispatchQueue.main.async {
                isApplying = false
                presentationMode.wrappedValue.dismiss()
            }
            return
        }
        
        // Add audio track if exists
        if let audioTrack = asset.tracks(withMediaType: .audio).first,
           let compositionAudioTrack = composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) {
            do {
                try compositionAudioTrack.insertTimeRange(CMTimeRange(start: .zero, duration: asset.duration), of: audioTrack, at: .zero)
            } catch {
                print("Warning: Failed to insert audio: \(error)")
            }
        }
        
        // Create video composition for captions
        let videoComposition = AVMutableVideoComposition()
        videoComposition.frameDuration = CMTime(value: 1, timescale: 30)
        videoComposition.renderSize = videoTrack.naturalSize
        
        // Create layers for caption overlay
        let parentLayer = CALayer()
        let videoLayer = CALayer()
        let captionLayer = CALayer()
        
        let size = videoTrack.naturalSize
        parentLayer.frame = CGRect(origin: .zero, size: size)
        videoLayer.frame = CGRect(origin: .zero, size: size)
        captionLayer.frame = CGRect(origin: .zero, size: size)
        
        parentLayer.addSublayer(videoLayer)
        parentLayer.addSublayer(captionLayer)
        
        // Add text layers for each caption
        for (index, line) in captionLines.enumerated() {
            let textLayer = CATextLayer()
            textLayer.string = line.text
            textLayer.font = CTFontCreateWithName("Helvetica-Bold" as CFString, captionFontSize, nil)
            textLayer.fontSize = captionFontSize
            textLayer.foregroundColor = UIColor(highlightColor).cgColor
            textLayer.backgroundColor = UIColor.black.withAlphaComponent(0.7).cgColor
            textLayer.alignmentMode = .center
            textLayer.isWrapped = true
            textLayer.cornerRadius = 8
            
            // Position captions at bottom
            let textWidth = size.width * 0.9
            let textHeight = captionFontSize * 2.5
            textLayer.frame = CGRect(
                x: size.width * 0.05,
                y: size.height * 0.15, // Bottom area
                width: textWidth,
                height: textHeight
            )
            
            // Set timing for when caption appears/disappears
            let startTime = line.startTime
            let endTime = line.endTime
            let duration = endTime - startTime
            
            // Initially hidden
            textLayer.opacity = 0
            
            // Show animation
            let showAnimation = CABasicAnimation(keyPath: "opacity")
            showAnimation.fromValue = 0.0
            showAnimation.toValue = 1.0
            showAnimation.duration = 0.2
            showAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + startTime
            showAnimation.fillMode = .forwards
            showAnimation.isRemovedOnCompletion = false
            
            // Hide animation
            let hideAnimation = CABasicAnimation(keyPath: "opacity")
            hideAnimation.fromValue = 1.0
            hideAnimation.toValue = 0.0
            hideAnimation.duration = 0.2
            hideAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + endTime
            hideAnimation.fillMode = .forwards
            hideAnimation.isRemovedOnCompletion = false
            
            textLayer.add(showAnimation, forKey: "show\(index)")
            textLayer.add(hideAnimation, forKey: "hide\(index)")
            
            captionLayer.addSublayer(textLayer)
        }
        
        videoComposition.animationTool = AVVideoCompositionCoreAnimationTool(
            postProcessingAsVideoLayer: videoLayer, 
            in: parentLayer
        )
        
        // Set up export
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        let outputURL = paths[0].appendingPathComponent("captioned_video_\(Date().timeIntervalSince1970).mov")
        
        try? FileManager.default.removeItem(at: outputURL)
        
        exportSession.outputURL = outputURL
        exportSession.outputFileType = .mov
        exportSession.videoComposition = videoComposition
        
        await exportSession.export()
        
        DispatchQueue.main.async {
            self.isApplying = false
            
            if let error = exportSession.error {
                print("Export failed: \(error)")
            } else if let outputURL = exportSession.outputURL {
                print("Captions applied successfully!")
                // Update video URL to the captioned version
                self.videoURL = outputURL
            }
            
            self.presentationMode.wrappedValue.dismiss()
        }
    }
}

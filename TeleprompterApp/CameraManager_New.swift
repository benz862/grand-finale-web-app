import AVFoundation
import SwiftUI
import UIKit

class CameraManager: NSObject, ObservableObject {
    @Published var isRecording = false
    @Published var isSetup = false
    
    private var captureSession: AVCaptureSession?
    private var videoDevice: AVCaptureDevice?
    private var videoDeviceInput: AVCaptureDeviceInput?
    private var movieFileOutput: AVCaptureMovieFileOutput?
    private var previewLayer: AVCaptureVideoPreviewLayer?
    
    private let sessionQueue = DispatchQueue(label: "session queue")
    
    override init() {
        super.init()
        checkPermissions()
    }
    
    private func checkPermissions() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            sessionQueue.async {
                self.setupCaptureSession()
            }
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { granted in
                if granted {
                    self.sessionQueue.async {
                        self.setupCaptureSession()
                    }
                }
            }
        default:
            print("Camera access denied")
            break
        }
    }
    
    func setupCamera() {
        sessionQueue.async {
            if self.captureSession == nil {
                self.setupCaptureSession()
            }
        }
    }
    
    private func setupCaptureSession() {
        let captureSession = AVCaptureSession()
        
        // Configure session
        captureSession.beginConfiguration()
        captureSession.sessionPreset = .high
        
        // Add video input
        guard let videoDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front),
              let videoDeviceInput = try? AVCaptureDeviceInput(device: videoDevice),
              captureSession.canAddInput(videoDeviceInput) else {
            print("Could not create video device input")
            captureSession.commitConfiguration()
            return
        }
        
        captureSession.addInput(videoDeviceInput)
        self.videoDevice = videoDevice
        self.videoDeviceInput = videoDeviceInput
        
        // Add movie file output
        let movieFileOutput = AVCaptureMovieFileOutput()
        if captureSession.canAddOutput(movieFileOutput) {
            captureSession.addOutput(movieFileOutput)
            self.movieFileOutput = movieFileOutput
        }
        
        captureSession.commitConfiguration()
        
        self.captureSession = captureSession
        
        DispatchQueue.main.async {
            self.isSetup = true
        }
        
        captureSession.startRunning()
    }
    
    func startRecording() {
        sessionQueue.async {
            guard let movieFileOutput = self.movieFileOutput,
                  !movieFileOutput.isRecording else { return }
            
            let outputFileName = "teleprompter_video_\(Date().timeIntervalSince1970).mov"
            let outputURL = self.documentsDirectory().appendingPathComponent(outputFileName)
            
            movieFileOutput.startRecording(to: outputURL, recordingDelegate: self)
            
            DispatchQueue.main.async {
                self.isRecording = true
            }
        }
    }
    
    func stopRecording() {
        sessionQueue.async {
            guard let movieFileOutput = self.movieFileOutput,
                  movieFileOutput.isRecording else { return }
            
            movieFileOutput.stopRecording()
            
            DispatchQueue.main.async {
                self.isRecording = false
            }
        }
    }
    
    func switchCamera() {
        sessionQueue.async {
            guard let captureSession = self.captureSession,
                  let currentInput = self.videoDeviceInput else { return }
            
            captureSession.beginConfiguration()
            captureSession.removeInput(currentInput)
            
            let newPosition: AVCaptureDevice.Position = currentInput.device.position == .front ? .back : .front
            
            if let newDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: newPosition),
               let newInput = try? AVCaptureDeviceInput(device: newDevice),
               captureSession.canAddInput(newInput) {
                
                captureSession.addInput(newInput)
                self.videoDeviceInput = newInput
                self.videoDevice = newDevice
            } else {
                captureSession.addInput(currentInput)
            }
            
            captureSession.commitConfiguration()
        }
    }
    
    private func documentsDirectory() -> URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    }
    
    func getPreviewLayer() -> AVCaptureVideoPreviewLayer? {
        guard let captureSession = captureSession else { return nil }
        
        if previewLayer == nil {
            previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
            previewLayer?.videoGravity = .resizeAspectFill
        }
        
        return previewLayer
    }
}

// MARK: - AVCaptureFileOutputRecordingDelegate
extension CameraManager: AVCaptureFileOutputRecordingDelegate {
    func fileOutput(_ output: AVCaptureFileOutput, didStartRecordingTo fileURL: URL, from connections: [AVCaptureConnection]) {
        print("Started recording to: \(fileURL)")
    }
    
    func fileOutput(_ output: AVCaptureFileOutput, didFinishRecordingTo outputFileURL: URL, from connections: [AVCaptureConnection], error: Error?) {
        if let error = error {
            print("Recording error: \(error)")
        } else {
            print("Recording finished successfully: \(outputFileURL)")
            // Save to photo library
            saveVideoToPhotoLibrary(url: outputFileURL)
        }
    }
    
    private func saveVideoToPhotoLibrary(url: URL) {
        UISaveVideoAtPathToSavedPhotosAlbum(url.path, nil, nil, nil)
    }
}

// MARK: - SwiftUI Camera Preview
struct CameraPreviewView: UIViewRepresentable {
    let cameraManager: CameraManager
    
    func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
        view.backgroundColor = UIColor.black
        
        if let previewLayer = cameraManager.getPreviewLayer() {
            previewLayer.frame = view.bounds
            view.layer.addSublayer(previewLayer)
        }
        
        return view
    }
    
    func updateUIView(_ uiView: UIView, context: Context) {
        if let previewLayer = cameraManager.getPreviewLayer() {
            previewLayer.frame = uiView.bounds
        }
    }
}

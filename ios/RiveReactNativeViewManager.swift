import UIKit
import RiveRuntime


@objc(RiveReactNativeViewManager)
class RiveReactNativeViewManager: RCTViewManager {
    
    override func view() -> UIView! {
        return RiveReactNativeView()
    }
    
    @objc func play(_ node: NSNumber, animationNames: [String], loopMode: String, direction: String, areStateMachines: Bool) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! RiveReactNativeView
            component.play(animationNames: animationNames, rnLoopMode: RNLoopMode.mapToRNLoopMode(value: loopMode), rnDirection: RNDirection.mapToRNDirection(value: direction), areStateMachines: areStateMachines)
            
        }
    }
    
    @objc func pause(_ node: NSNumber, animationNames: [String], areStateMachines: Bool) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! RiveReactNativeView
            component.pause(animationNames: animationNames, areStateMachines: areStateMachines)
        }
    }
    
    @objc func stop(_ node: NSNumber, animationNames: [String], areStateMachines: Bool) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! RiveReactNativeView
            component.stop(animationNames: animationNames, areStateMachines: areStateMachines)
        }
    }
    
}

//class ContainerView: UIView {
//
//    @objc var resourceName: String? {
//        didSet {
//            if let _ = resourceName, !resourceName!.isEmpty {
//                startRive()
//            }
//        }
//    }
//    let resourceExt = "riv"
//    var artboard: RiveArtboard?
//    var instance: RiveLinearAnimationInstance?
//    var displayLink: CADisplayLink?
//    var lastTime: CFTimeInterval = 0
//    let rView = MyRiveView()
//
//    override init(frame: CGRect) {
//        super.init(frame: frame)
//        setupView()
//    }
//
//    required init?(coder aDecoder: NSCoder) {
//        super.init(coder: aDecoder)
//        fatalError("init(coder:) has not been implemented")
//    }
//
//    func setupView() {
//        self.addSubview(rView)
//    }
//
//    override func reactSetFrame(_ frame: CGRect) {
//        super.reactSetFrame(frame)
//        rView.reactSetFrame(frame)
//    }
//
//    func startRive() {
//        guard let name = self.resourceName else {
//            fatalError("No resource name specified")
//        }
//        guard let url = Bundle.main.url(forResource: name, withExtension: resourceExt) else {
//            fatalError("Failed to locate \(name) in bundle.")
//        }
//        guard var data = try? Data(contentsOf: url) else {
//            fatalError("Failed to load \(url) from bundle.")
//        }
//
//        // Import the data into a RiveFile
//        let bytes = [UInt8](data)
//
//        data.withUnsafeMutableBytes{(riveBytes:UnsafeMutableRawBufferPointer) in
//            guard let rawPointer = riveBytes.baseAddress else {
//                fatalError("File pointer is messed up")
//            }
//            let pointer = rawPointer.bindMemory(to: UInt8.self, capacity: bytes.count)
//
//            guard let riveFile = RiveFile(bytes:pointer, byteLength: UInt64(bytes.count)) else {
//                fatalError("Failed to import \(url).")
//            }
//
//            let artboard = riveFile.artboard()
//
//            self.artboard = artboard
//            // update the artboard in the view
//            rView.updateArtboard(artboard)
//
//            if (artboard.animationCount() == 0) {
//                fatalError("No animations in the file.")
//            }
//
//            // Fetch an animation
//            let animation = artboard.animation(at: 0)
//            self.instance = animation.instance()
//
//            // Advance the artboard, this will ensure the first
//            // frame is displayed when the artboard is drawn
//            artboard.advance(by: 0)
//
//            // Start the animation loop
//            runTimer()
//        }
//    }
//
//    // Starts the animation timer
//    func runTimer() {
//        displayLink = CADisplayLink(target: self, selector: #selector(tick));
//        displayLink?.add(to: .main, forMode: .default)
//    }
//
//    // Stops the animation timer
//    func stopTimer() {
//        displayLink?.remove(from: .main, forMode: .default)
//    }
//
//    // Animates a frame
//    @objc func tick() {
//        guard let displayLink = displayLink, let artboard = artboard else {
//            // Something's gone wrong, clean up and bug out
//            stopTimer()
//            return
//        }
//
//        let timestamp = displayLink.timestamp
//        // last time needs to be set on the first tick
//        if (lastTime == 0) {
//            lastTime = timestamp
//        }
//        // Calculate the time elapsed between ticks
//        let elapsedTime = timestamp - lastTime;
//        lastTime = timestamp;
//
//        // Advance the animation instance and the artboard
//        instance!.advance(by: elapsedTime) // advance the animation
//        instance!.apply(to: artboard)      // apply to the artboard
//
//        artboard.advance(by: elapsedTime) // advance the artboard
//
//        // Trigger a redraw
//        rView.setNeedsDisplay()
//    }
//
//    @objc func play() {
//        runTimer()
//    }
//
//    @objc func pause() {
//        stopTimer()
//    }
//
//
//}

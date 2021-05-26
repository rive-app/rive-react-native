import UIKit
import RiveRuntime

class RiveReactNativeView: UIView, PlayDelegate, PauseDelegate, StopDelegate, LoopDelegate, StateChangeDelegate {
    private var shouldBeReloaded = true
    private var resourceFromBundle = true
    
    @objc var onPlay: RCTDirectEventBlock?
    @objc var onPause: RCTDirectEventBlock?
    @objc var onStop: RCTDirectEventBlock?
    @objc var onLoopEnd: RCTDirectEventBlock?
    @objc var onStateChanged: RCTDirectEventBlock?
    
    @objc var resourceName: String? = nil {
        didSet {
            if let _ = resourceName {
                url = nil
                resourceFromBundle = true
                shouldBeReloaded = true
            }
        }
    }
    @objc var url: String? = nil {
        didSet {
            if let _ = url {
                resourceFromBundle = false
                shouldBeReloaded = true
            }
        }
    }
    @objc var fit: String? {
        didSet {
            if let safeFit = fit {
                let rnFit = RNFit.mapToRNFit(value: safeFit)
                riveView.fit = RNFit.mapToRiveFit(rnFit: rnFit)
            }
        }
    }
    @objc var alignment: String? {
        didSet {
            if let safeAlignment = alignment {
                let rnAlignment = RNAlignment.mapToRNAlignment(value: safeAlignment)
                riveView.alignment = RNAlignment.mapToRiveAlignment(rnAlignment: rnAlignment)
            }
        }
    }
    
    @objc var autoplay: Bool { // Bool? cannot be used because objc cannot interop with it
        didSet {
            shouldBeReloaded = true
        }
    }
    
    @objc var animationName: String? {
        didSet {
            if let _ = animationName {
                shouldBeReloaded = true
            }
        }
    }
    
    @objc var stateMachineName: String? {
        didSet {
            if let _ = stateMachineName {
                shouldBeReloaded = true
            }
        }
    }
    
    @objc var artboardName: String? {
        didSet {
            if let _ = artboardName {
                shouldBeReloaded = true
            }
        }
    }
    
    let riveView = RiveView()
    
    override func didSetProps(_ changedProps: [String]!) {
        reloadIfNeeded()
    }
    
    
    override init(frame: CGRect) {
        self.autoplay = true // will be changed by react native
        super.init(frame: frame)
        riveView.playDelegate = self
        riveView.pauseDelegate = self
        riveView.stopDelegate = self
        riveView.loopDelegate = self
        riveView.stateChangeDelegate = self
        addSubview(riveView)
    }
    
    
    override func layoutSubviews() {
        super.layoutSubviews()
        for view in subviews {
            view.reactSetFrame(self.bounds)
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        self.autoplay = true
        super.init(coder: aDecoder)
        fatalError("init(coder:) has not been implemented")
    }
    
    private func reloadIfNeeded() {
        if(shouldBeReloaded) {
            if let safeUrl = url {
                if !resourceFromBundle {
                    riveView.configure(getRiveURLResource(from: safeUrl),andArtboard: artboardName ,andAnimation: animationName, andStateMachine: stateMachineName, andAutoPlay: autoplay)
                } else {
                    fatalError("You cannot pass both resourceName and url at the same time")
                }
            } else {
                if resourceFromBundle, let safeResourceName = resourceName {
                    riveView.configure(getRiveFile(resourceName: safeResourceName),andArtboard: artboardName, andAnimation: animationName, andStateMachine: stateMachineName, andAutoPlay: autoplay)
                } else {
                    fatalError("You must provide a url or a resourceName!")
                }
            }
            shouldBeReloaded = false
        }
    }
    
    func play(_ animationName: String, isStateMachine: Bool) {
        onPlay?(["animationName": animationName, "isStateMachine": isStateMachine])
    }
    
    func pause(_ animationName: String, isStateMachine: Bool) {
        onPause?(["animationName": animationName, "isStateMachine": isStateMachine])
    }
    
    func stop(_ animationName: String, isStateMachine: Bool) {
        onStop?(["animationName": animationName, "isStateMachine": isStateMachine])
    }
    
    func loop(_ animationName: String, type: Int) {
        onLoopEnd?(["animationName": animationName, "loopMode": RNLoopMode.mapToRNLoopMode(value: type).rawValue])
    }
    
    func stateChange(_ stateName: String) {
        onStateChanged?(["stateName": stateName])
    }
    
    func play(animationNames: [String], rnLoopMode: RNLoopMode, rnDirection: RNDirection, areStateMachines: Bool) {
        let loop = RNLoopMode.mapToRiveLoop(rnLoopMode: rnLoopMode)
        let direction = RNDirection.mapToRiveDirection(rnDirection: rnDirection)
        if animationNames.isEmpty {
            riveView.play(loop: loop, direction: direction)
        } else {
            riveView.play(animationNames: animationNames, loop: loop, direction: direction, isStateMachine: areStateMachines)
        }
        
    }
    
    func pause(animationNames: [String], areStateMachines: Bool) {
        if animationNames.isEmpty {
            riveView.pause()
        } else {
            riveView.pause(animationNames: animationNames, isStateMachine: areStateMachines)
        }
    }
    
    func stop(animationNames: [String], areStateMachines: Bool) {
        if animationNames.isEmpty {
            shouldBeReloaded = true
            autoplay = false // we want to stop animation after reload
            reloadIfNeeded()
        } else {
            riveView.stop(animationNames: animationNames, isStateMachine: areStateMachines)
        }
    }
    
    func reset() {
        shouldBeReloaded = true
        reloadIfNeeded()
    }
    
    func fireState(stateMachineName: String, inputName: String) {
        riveView.fireState(stateMachineName, inputName: inputName)
    }
    
    func setNumberState(stateMachineName: String, inputName: String, value: Float) {
        riveView.setNumberState(stateMachineName, inputName: inputName, value: value)
    }
    
    func setBooleanState(stateMachineName: String, inputName: String, value: Bool) {
        riveView.setBooleanState(stateMachineName, inputName: inputName, value: value)
    }
}


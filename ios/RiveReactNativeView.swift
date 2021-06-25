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
    @objc var onError: RCTDirectEventBlock?
    @objc var isUserHandlingErrors: Bool
    
    
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
        self.isUserHandlingErrors = false
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
        self.isUserHandlingErrors = false
        super.init(coder: aDecoder)
        fatalError("init(coder:) has not been implemented")
    }
    
    private func reloadIfNeeded() {
        if(shouldBeReloaded) {
            if let safeUrl = url {
                if !resourceFromBundle {
                    do {
                        let riveUrlResource = try getRiveURLResource(from: safeUrl)
                        try riveView.configure(riveUrlResource,andArtboard: artboardName ,andAnimation: animationName, andStateMachine: stateMachineName, andAutoPlay: autoplay)
                    } catch let error as NSError {
                        handleRiveError(error: error)
                    }
                    
                } else {
                    RCTLogError("You cannot pass both resourceName and url at the same time")
                }
            } else {
                if resourceFromBundle, let safeResourceName = resourceName {
                    do {
                        let resourceRiveFile = try getRiveFile(resourceName: safeResourceName)
                        try riveView.configure(resourceRiveFile,andArtboard: artboardName, andAnimation: animationName, andStateMachine: stateMachineName, andAutoPlay: autoplay)
                        
                    } catch let error as NSError {
                        handleRiveError(error: error)
                    }
                    
                } else {
                    let message = "File resource not found. You must provide correct url or resourceName!"
                    if isUserHandlingErrors {
                        var rnRiveError = RNRiveError.FileNotFound
                        rnRiveError.message = message
                        onRNRiveError(rnRiveError)
                    } else {
                        RCTLogError(message)
                    }
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
    
    func stateChange(_ stateMachineName: String, _ stateName: String) {
        onStateChanged?(["stateMachineName": stateMachineName, "stateName": stateName])
    }
    
    func play(animationNames: [String], rnLoopMode: RNLoopMode, rnDirection: RNDirection, areStateMachines: Bool) {
        let loop = RNLoopMode.mapToRiveLoop(rnLoopMode: rnLoopMode)
        let direction = RNDirection.mapToRiveDirection(rnDirection: rnDirection)
        do {
            if animationNames.isEmpty {
                try riveView.play(loop: loop, direction: direction)
            } else {
                try riveView.play(animationNames: animationNames, loop: loop, direction: direction, isStateMachine: areStateMachines)
            }
        } catch let error as NSError {
            handleRiveError(error: error)
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
        do {
            try riveView.fireState(stateMachineName, inputName: inputName)
        } catch let error as NSError {
            handleRiveError(error: error)
        }
    }
    
    func setNumberState(stateMachineName: String, inputName: String, value: Float) {
        do {
            try riveView.setNumberState(stateMachineName, inputName: inputName, value: value)
        } catch let error as NSError {
            handleRiveError(error: error)
        }
    }
    
    func setBooleanState(stateMachineName: String, inputName: String, value: Bool) {
        do {
            try riveView.setBooleanState(stateMachineName, inputName: inputName, value: value)
        } catch let error as NSError {
            handleRiveError(error: error)
        }
    }
    
    private func onRNRiveError(_ rnRiveError: BaseRNRiveError) {
        onError?(["type": rnRiveError.type, "message": rnRiveError.message])
    }
    
    private func handleRiveError(error: NSError) {
        if isUserHandlingErrors {
            let rnRiveError = RNRiveError.mapToRNRiveError(riveError: error)
            if let safeRnRiveError = rnRiveError {
                onRNRiveError(safeRnRiveError)
            }
        } else {
            RCTLogError(error.localizedDescription)
        }
    }
}


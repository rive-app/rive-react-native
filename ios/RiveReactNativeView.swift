import UIKit
import RiveRuntime

class RiveReactNativeView: UIView, RivePlayerDelegate, RiveStateMachineDelegate {
    // MARK: RiveReactNativeView Properties
    private var shouldBeReloaded = true
    private var resourceFromBundle = true
    
    // MARK: React Callbacks
    @objc var onPlay: RCTDirectEventBlock?
    @objc var onPause: RCTDirectEventBlock?
    @objc var onStop: RCTDirectEventBlock?
    @objc var onLoopEnd: RCTDirectEventBlock?
    @objc var onStateChanged: RCTDirectEventBlock?
    @objc var onError: RCTDirectEventBlock?
    @objc var isUserHandlingErrors: Bool
    
    // MARK: RiveRuntime Bindings
    var viewModel: RiveViewModel! {
        didSet {
            viewModel.riveView?.removeFromSuperview()
            _ = viewModel.createRiveView()
            viewModel.riveView!.playerDelegate = self
            viewModel.riveView!.stateMachineDelegate = self
            addSubview(viewModel.riveView!)
        }
    }
    
    @objc var resourceName: String? = nil {
        didSet {
            if let name = resourceName {
                url = nil
                resourceFromBundle = true
                shouldBeReloaded = true
                viewModel = stateMachineName 
                RiveViewModel(fileName: <#T##String#>, stateMachineName: <#T##String?#>, fit: <#T##Fit#>, alignment: <#T##Alignment#>, autoPlay: <#T##Bool#>, artboardName: <#T##String?#>)
                RiveViewModel(fileName: <#T##String#>, animationName: <#T##String?#>, fit: <#T##Fit#>, alignment: <#T##Alignment#>, autoPlay: <#T##Bool#>, artboardName: <#T##String?#>)
            }
        }
    }
    @objc var url: String? = nil {
        didSet {
            if let url = url {
                resourceFromBundle = false
                shouldBeReloaded = true
                viewModel = RiveViewModel(webURL: url)
            }
        }
    }
    @objc var fit: String? {
        didSet {
            if let safeFit = fit {
                let rnFit = RNFit.mapToRNFit(value: safeFit)
                viewModel.fit = RNFit.mapToRiveFit(rnFit: rnFit)
            }
        }
    }
    @objc var alignment: String? {
        didSet {
            if let safeAlignment = alignment {
                let rnAlignment = RNAlignment.mapToRNAlignment(value: safeAlignment)
                viewModel.alignment = RNAlignment.mapToRiveAlignment(rnAlignment: rnAlignment)
            }
        }
    }
    
    @objc var autoplay: Bool {
        didSet {
            shouldBeReloaded = true
            viewModel.autoPlay = autoplay
        }
    }
    
    @objc var animationName: String? {
        didSet {
            if let name = animationName {
                shouldBeReloaded = true
                try! viewModel.riveModel?.setAnimation(name)
            }
        }
    }
    
    @objc var stateMachineName: String? {
        didSet {
            if let name = stateMachineName {
                shouldBeReloaded = true
                try! viewModel?.riveModel?.setStateMachine(name)
            }
        }
    }
    
    @objc var artboardName: String? {
        didSet {
            if let name = artboardName {
                shouldBeReloaded = true
                    try! viewModel.riveModel?.setArtboard(name)
            }
        }
    }
    
    override init(frame: CGRect) {
        self.autoplay = true // will be changed by react native
        self.isUserHandlingErrors = false
        super.init(frame: frame)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - React Native Helpers
    
    override func didSetProps(_ changedProps: [String]!) {
        reloadIfNeeded()
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        for view in subviews {
            view.reactSetFrame(self.bounds)
        }
    }
    
    private func reloadIfNeeded() {
        if(shouldBeReloaded) {
            if let safeUrl = url {
                if !resourceFromBundle {
                    if let sm = stateMachineName {
                        viewModel = RiveViewModel(
                            webURL: safeUrl,
                            stateMachineName: sm,
                            autoPlay: autoplay,
                            artboardName: artboardName
                        )
                    }
                    else {
                        viewModel = RiveViewModel(
                            webURL: safeUrl,
                            animationName: animationName,
                            autoPlay: autoplay,
                            artboardName: artboardName
                        )
                    }
                } else {
                    RCTLogError("You cannot pass both resourceName and url at the same time")
                }
            } else {
                if resourceFromBundle, let safeResourceName = resourceName {
                    if let sm = stateMachineName {
                        viewModel = RiveViewModel(
                            fileName: safeResourceName,
                            stateMachineName: sm,
                            autoPlay: autoplay,
                            artboardName: artboardName
                        )
                    }
                    else {
                        viewModel = RiveViewModel(
                            fileName: safeResourceName,
                            animationName: animationName,
                            autoPlay: autoplay,
                            artboardName: artboardName
                        )
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
    
    // MARK: - Playback Controls
    
    func play(animationName: String? = nil, rnLoopMode: RNLoopMode, rnDirection: RNDirection) {
        let loop = RNLoopMode.mapToRiveLoop(rnLoopMode: rnLoopMode)
        let direction = RNDirection.mapToRiveDirection(rnDirection: rnDirection)
        let model = viewModel.riveModel!
        viewModel.play(animationName: animationName, loop: loop, direction: direction)
        
        
        onPlay?([
            "animationName": model.animation ?? model.stateMachine!,
            "isStateMachine": model.stateMachine != nil
        ])
    }
    
    func pause() {
        viewModel.pause()
    }
    
    func stop() {
        viewModel.stop()
    }
    
    func reset() {
        viewModel.reset()
        shouldBeReloaded = true
        reloadIfNeeded()
    }
    
    // MARK: - StateMachine Inputs
    
    func fireState(stateMachineName: String, inputName: String) {
        viewModel.triggerInput(inputName)
    }
    
    func setNumberState(stateMachineName: String, inputName: String, value: Float) {
        viewModel.setInput(inputName, value: value)
    }
    
    func setBooleanState(stateMachineName: String, inputName: String, value: Bool) {
        viewModel.setInput(inputName, value: value)
    }
    
    // MARK: - StateMachineDelegate
    
    //func stateMachine(_ stateMachine: RiveStateMachineInstance, receivedInput input: StateMachineInput) { }
    
    func stateMachine(_ stateMachine: RiveStateMachineInstance, didChangeState stateName: String) {
        onStateChanged?(["stateMachineName": stateMachine.name(), "stateName": stateName])
    }
    
    // MARK: - PlayerDelegate
    
    func player(playedWithModel riveModel: RiveModel?) {
        
    }
    
    func player(pausedWithModel riveModel: RiveModel?) {
        onPause?([
            "animationName": riveModel!.animation ?? riveModel!.stateMachine!,
            "isStateMachine": riveModel!.stateMachine != nil
        ])
    }
    
    func player(loopedWithModel riveModel: RiveModel?, type: Int) {
        onLoopEnd?([
            "animationName": riveModel!.animation!.name(),
            "loopMode": RNLoopMode.mapToRNLoopMode(value: type).rawValue
        ])
    }
    
    func player(stoppedWithModel riveModel: RiveModel?) {
        shouldBeReloaded = true
        autoplay = false // we want to stop animation after reload
        reloadIfNeeded()
        
        onStop?([
            "animationName": riveModel!.animation ?? riveModel!.stateMachine!,
            "isStateMachine": riveModel!.stateMachine != nil
        ])
    }
    
    func player(didAdvanceby seconds: Double, riveModel: RiveModel?) { }
    
    // MARK: - Touch Events
    
    open func touchBegan(_ location: CGPoint) {
        handleTouch(location: location) { machine, abLocation in
            guard let riveView = viewModel?.riveView else { fatalError("No RiveView") }
            guard let artboard = viewModel?.riveModel?.artboard else { fatalError("Malformed RiveModel") }
            riveView.stateMachineDelegate?.touchBegan?(onArtboard: artboard, atLocation: abLocation)
        }
    }
    
    open func touchMoved(_ location: CGPoint) {
        handleTouch(location: location) { machine, abLocation in
            guard let riveView = viewModel?.riveView else { fatalError("No RiveView") }
            guard let artboard = viewModel?.riveModel?.artboard else { fatalError("Malformed RiveModel") }
            riveView.stateMachineDelegate?.touchMoved?(onArtboard: artboard, atLocation: abLocation)
        }
    }
    
    open func touchEnded(_ location: CGPoint) {
        handleTouch(location: location) { machine, abLocation in
            guard let riveView = viewModel?.riveView else { fatalError("No RiveView") }
            guard let artboard = viewModel?.riveModel?.artboard else { fatalError("Malformed RiveModel") }
            riveView.stateMachineDelegate?.touchEnded?(onArtboard: artboard, atLocation: abLocation)
        }
    }
    
    open func touchCancelled(_ location: CGPoint) {
        handleTouch(location: location) { machine, abLocation in
            guard let riveView = viewModel?.riveView else { fatalError("No RiveView") }
            guard let artboard = viewModel?.riveModel?.artboard else { fatalError("Malformed RiveModel") }
            riveView.stateMachineDelegate?.touchCancelled?(onArtboard: artboard, atLocation: abLocation)
        }
    }
    
    private func handleTouch(location: CGPoint, action: (RiveStateMachineInstance, CGPoint)->Void) {
        let artboardLocation = viewModel.riveView!.artboardLocation(
            fromTouchLocation: location,
            inArtboard: viewModel.riveModel!.artboard!.bounds(),
            fit: viewModel.fit,
            alignment: viewModel.alignment
        )

        if let stateMachine = viewModel.riveModel?.stateMachine {
            viewModel.play()
            action(stateMachine, artboardLocation)
        }
    }
    
    // MARK: - Error Handling
    
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

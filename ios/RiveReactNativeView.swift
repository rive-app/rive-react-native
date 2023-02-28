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
       willSet {
           viewModel?.riveView?.playerDelegate = nil
           viewModel?.riveView?.stateMachineDelegate = nil
           viewModel?.riveView?.removeFromSuperview()
           viewModel?.deregisterView()
           viewModel = nil
       }
       didSet {
           let riveView = viewModel.createRiveView()
            riveView.playerDelegate = self
            riveView.stateMachineDelegate = self
//            DispatchQueue.main.async {
//               riveView.stateMachineDelegate = self
//              riveView.playerDelegate = self
//            }
           addSubview(riveView)
       }
   }
    
    @objc var resourceName: String? = nil {
        didSet {
            if let name = resourceName {
                url = nil
                resourceFromBundle = true
                if (viewModel == nil) {
                    debugPrint("SETTING RESOURCE (no VM)")
                    shouldBeReloaded = false
                }
                debugPrint("SETTING RESOURCE - autoplay \(autoplay) artboard \(artboardName) animation \(animationName) stateMachineName \(stateMachineName)")
                if let smName = stateMachineName {
                    viewModel = RiveViewModel(fileName: name, stateMachineName: smName, artboardName: artboardName)
                } else if let animName = animationName {
                    viewModel = RiveViewModel(fileName: name, animationName: animName, artboardName: artboardName)
                } else {
                    viewModel = RiveViewModel(fileName: name, artboardName: artboardName)
                }
            }
        }
    }
    @objc var url: String? = nil {
        didSet {
            if let url = url {
                resourceName = nil
                resourceFromBundle = false
//                if (viewModel == nil) {
//                    debugPrint("SETTING URL (noVM)")
//                    shouldBeReloaded = false
//                }
                debugPrint("SETTING URL - autoplay \(autoplay) artboard \(artboardName) animation \(animationName) stateMachineName \(stateMachineName)")
                viewModel = RiveViewModel(webURL: url)
//                if let smName = stateMachineName {
//                    viewModel = RiveViewModel(webURL: url, stateMachineName: smName, artboardName: artboardName)
//                } else if let animName = animationName {
//                    viewModel = RiveViewModel(webURL: url, animationName: animName, artboardName: artboardName)
//                } else {
//                    viewModel = RiveViewModel(webURL: url)
//                }
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
            viewModel.autoPlay = autoplay
        }
    }
    
    @objc var artboardName: String? {
        didSet {
            if viewModel != nil, let name = artboardName {
//                shouldBeReloaded = true
                // RiveFile may not be set yet so artboard will be set on the reload
                debugPrint("artboardName - current \(viewModel?.riveModel?.artboard?.name()) \(name)")
                if (url == nil && viewModel?.riveModel?.artboard?.name() != name) {
                    debugPrint("artboardName - SETTING \(viewModel?.riveModel?.artboard?.name()) \(name)")
                    shouldBeReloaded = true
                    try! viewModel?.riveModel?.setArtboard(name)
                 }
            }
        }
    }
    
    @objc var animationName: String? {
        didSet {
            if let name = animationName {
                if viewModel != nil && viewModel?.riveModel?.animation?.name() != name {
                    debugPrint("animationName - SETTING \(viewModel?.riveModel?.animation?.name()) \(name)")
                    shouldBeReloaded = true
                    try! viewModel?.riveModel?.setAnimation(name)
                }
//                shouldBeReloaded = true
//                try! viewModel?.riveModel?.setAnimation(name)
            }
        }
    }
    
    @objc var stateMachineName: String? {
        didSet {
            if viewModel != nil, let name = stateMachineName {
                if viewModel?.riveModel?.stateMachine?.name() != name {
                    debugPrint("stateMachineName - SETTING \(viewModel?.riveModel?.stateMachine?.name()) \(name)")
                    shouldBeReloaded = true
                    try! viewModel?.riveModel?.setStateMachine(name)
                }
            }
        }
    }
    
    override init(frame: CGRect) {
        self.autoplay = false // will be changed by react native
        self.isUserHandlingErrors = false
        super.init(frame: frame)
    }
    
    required init?(coder aDecoder: NSCoder) {
        self.autoplay = true
        self.isUserHandlingErrors = false
        super.init(coder: aDecoder)
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - React Native Helpers
    
    override func didSetProps(_ changedProps: [String]!) {
        print("DID SET PROPS \(changedProps)")
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
                        debugPrint("reload new VM (State Machine) - \(artboardName) \(sm)")
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
                    // TODO: DONT REMOVE THIS LINE OR THINGS BREAK. Figure out why
                    viewModel?.stop()
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
        if (animationName ?? "").isEmpty {
            viewModel.play(loop: loop, direction: direction)
        } else {
            viewModel.play(animationName: animationName, loop: loop, direction: direction)
        }
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

    
    @objc func stateMachine(_ stateMachine: RiveStateMachineInstance, didChangeState stateName: String) {
        debugPrint("STATE MACHINE callback \(stateMachine.name()) \(stateName)")
        onStateChanged?(["stateMachineName": stateMachine.name(), "stateName": stateName])
    }
    
    @objc func stateMachine(_ stateMachine: RiveStateMachineInstance, receivedInput input: StateMachineInput) {
        debugPrint("STATE MACHINE callback")
    }
    
    // MARK: - PlayerDelegate
    
    func player(playedWithModel riveModel: RiveModel?) {
        if (riveModel?.animation != nil || riveModel?.stateMachine != nil) {
            debugPrint("ADVANCE BY PLAY \(animationName) \(stateMachineName) \(riveModel?.animation?.name() ?? riveModel?.stateMachine?.name())");
            onPlay?([
                "animationName": riveModel?.animation?.name() ?? riveModel?.stateMachine?.name(),
                "isStateMachine": riveModel?.stateMachine != nil
            ])
        }
    }
    
    func player(pausedWithModel riveModel: RiveModel?) {
        debugPrint("ADVANCE BY PAUSE")
         onPause?([
            "animationName": riveModel?.animation?.name() ?? riveModel?.stateMachine?.name(),
             "isStateMachine": riveModel?.stateMachine != nil
         ])
    }
    
    func player(loopedWithModel riveModel: RiveModel?, type: Int) {
         onLoopEnd?([
             "animationName": riveModel?.animation!.name(),
             "loopMode": RNLoopMode.mapToRNLoopMode(value: type).rawValue
         ])
    }
    
    func player(stoppedWithModel riveModel: RiveModel?) {
        debugPrint("ADVANCE BY STOP \(riveModel?.animation?.name())")
//        shouldBeReloaded = true
//        autoplay = false // we want to stop animation after reload
//        reloadIfNeeded()
         onStop?([
            "animationName": riveModel?.animation?.name() ?? riveModel?.stateMachine?.name(),
             "isStateMachine": riveModel?.stateMachine != nil
         ])
    }
    
    func player(didAdvanceby seconds: Double, riveModel: RiveModel?) {
    }
    
    // MARK: - Touch Events
    
    @objc open func touchBegan(_ location: CGPoint) {
        handleTouch(location: location) { machine, abLocation in
            guard let riveView = viewModel?.riveView else { fatalError("No RiveView") }
            guard let artboard = viewModel?.riveModel?.artboard else { fatalError("Malformed RiveModel") }
            if (riveView.stateMachineDelegate?.touchBegan != nil) {
                riveView.stateMachineDelegate?.touchBegan?(onArtboard: artboard, atLocation: abLocation)
            }
        }
    }
    
    @objc open func touchMoved(_ location: CGPoint) {
        handleTouch(location: location) { machine, abLocation in
            guard let riveView = viewModel?.riveView else { fatalError("No RiveView") }
            guard let artboard = viewModel?.riveModel?.artboard else { fatalError("Malformed RiveModel") }
            riveView.stateMachineDelegate?.touchMoved?(onArtboard: artboard, atLocation: abLocation)
        }
    }
    
    @objc open func touchEnded(_ location: CGPoint) {
        handleTouch(location: location) { machine, abLocation in
            guard let riveView = viewModel?.riveView else { fatalError("No RiveView") }
            guard let artboard = viewModel?.riveModel?.artboard else { fatalError("Malformed RiveModel") }
            riveView.stateMachineDelegate?.touchEnded?(onArtboard: artboard, atLocation: abLocation)
        }
    }
    
    @objc open func touchCancelled(_ location: CGPoint) {
        handleTouch(location: location) { machine, abLocation in
            guard let riveView = viewModel?.riveView else { fatalError("No RiveView") }
            guard let artboard = viewModel?.riveModel?.artboard else { fatalError("Malformed RiveModel") }
            riveView.stateMachineDelegate?.touchCancelled?(onArtboard: artboard, atLocation: abLocation)
        }
    }
    
    private func handleTouch(location: CGPoint, action: (RiveStateMachineInstance, CGPoint)->Void) {
        if let rView = viewModel.riveView {
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

import UIKit
import RiveRuntime

class RiveReactNativeView: UIView, RivePlayerDelegate, RiveStateMachineDelegate {
    // MARK: RiveReactNativeView Properties
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
    var riveView: RiveView!
    var viewModel: RiveViewModel!
    
    @objc var resourceName: String? = nil {
        didSet {
            configureViewModelFromResource()
        }
    }
    @objc var url: String? = nil {
        didSet {
            if let url = url {
                resourceName = nil
                resourceFromBundle = false
                // Don't construct until didSetProps is run
//                configureViewModelFromUrl()
            }
        }
    }
    @objc var fit: String?
    
    @objc var alignment: String?
    
    @objc var autoplay: Bool {
        didSet {
            if let viewModel = viewModel {
                viewModel.autoPlay = autoplay
            }
        }
    }
    
    @objc var artboardName: String?
    
    
    @objc var animationName: String?
    
    
    @objc var stateMachineName: String?
    
    
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
    
    override func removeFromSuperview() {
        removeReactSubview(riveView) // TODO: Investigate if this is the optimal place to remove, and if this is necessary.
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        for view in subviews {
            view.reactSetFrame(self.bounds)
        }
    }
    
    override func didSetProps(_ changedProps: [String]!) {
        reloadView()
    }
    
    private func convertFit(_ fit: String? = nil) -> RiveFit {
        if let safeFit = fit {
            let rnFit = RNFit.mapToRNFit(value: safeFit)
            return RNFit.mapToRiveFit(rnFit: rnFit)
        }
        return RiveFit.contain
    }
    
    private func convertAlignment(_ alignment: String? = nil) -> RiveAlignment {
        if let safeAlignment = alignment {
            let rnAlignment = RNAlignment.mapToRNAlignment(value: safeAlignment)
            return RNAlignment.mapToRiveAlignment(rnAlignment: rnAlignment)
        }
        return RiveAlignment.center
    }
    
    private func createNewView(updatedViewModel : RiveViewModel){
        removeReactSubview(riveView)
        viewModel = updatedViewModel
        riveView = viewModel.createRiveView();
        addSubview(riveView)
    }
    
    private func configureViewModelFromResource() {
        if let name = resourceName {
            url = nil
            resourceFromBundle = true
            
            var updatedViewModel: RiveViewModel
            if let smName = stateMachineName {
                updatedViewModel = RiveViewModel(fileName: name, stateMachineName: smName, fit: convertFit(fit), alignment: convertAlignment(alignment), artboardName: artboardName)
            } else if let animName = animationName {
                updatedViewModel = RiveViewModel(fileName: name, animationName: animName, fit: convertFit(fit), alignment: convertAlignment(alignment), artboardName: artboardName)
            } else {
                updatedViewModel = RiveViewModel(fileName: name, fit: convertFit(fit), alignment: convertAlignment(alignment), artboardName: artboardName)
            }
            
            createNewView(updatedViewModel: updatedViewModel)
        }
    }
    
    private func configureViewModelFromUrl() {
        if let url = url {
            resourceName = nil
            resourceFromBundle = false
            
            var updatedViewModel: RiveViewModel
            if let smName = stateMachineName {
                updatedViewModel = RiveViewModel(webURL: url, stateMachineName: smName, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName)
            } else if let animName = animationName {
                updatedViewModel = RiveViewModel(webURL: url, animationName: animName, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName)
            } else {
                updatedViewModel = RiveViewModel(webURL: url, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay)
            }
            
            createNewView(updatedViewModel: updatedViewModel)
        }
    }
    
    private func reloadView() {
        if resourceFromBundle {
            do {
                try viewModel?.configureModel(artboardName: artboardName, stateMachineName: stateMachineName, animationName: animationName)
                viewModel.fit = convertFit(fit)
                viewModel.alignment = convertAlignment(alignment)
            } catch let error as NSError {
                handleRiveError(error: error)
            }
            
        } else {
            configureViewModelFromUrl() // TODO: calling viewModel?.configureModel for a URL ViewModel throws. Requires further investigation. Currently recreating the whole ViewModel upon URL change.
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
        reloadView()
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

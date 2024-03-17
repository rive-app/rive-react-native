import UIKit
import RiveRuntime

struct FileHandlerOptions {
    var willHandleAsset: Bool
    var bundledAssetName: String?
    var assetUrl: String?

    init(from dictionary: NSDictionary) {
        // If the user omits this property but supplies a bundledAssetName, we can
        // most likely assume they meant to handle the asset themselves since they
        // want to load the specified asset from the bundle
        self.willHandleAsset = dictionary["willHandleAsset"] as? Bool ?? (dictionary["bundledAssetName"] as? String)?.isEmpty ?? false
        self.bundledAssetName = dictionary["bundledAssetName"] as? String ?? nil
        self.assetUrl = dictionary["assetUrl"] as? String ?? nil
    }
}

struct SwiftFilesHandled {
    var files: [String: FileHandlerOptions]

    init(from rnFilesHandled: NSDictionary) {
        var filesHandled = [String: FileHandlerOptions]()
        if let dictionary = rnFilesHandled as? [String: NSDictionary] {
            for (key, value) in dictionary {
                filesHandled[key] = FileHandlerOptions(from: value)
            }
        }
        self.files = filesHandled
    }
}

class RiveReactNativeView: RCTView, RivePlayerDelegate, RiveStateMachineDelegate {
    // MARK: RiveReactNativeView Properties
    private var resourceFromBundle = true
    private var requiresLocalResourceReconfigure = false
    
    // MARK: React Callbacks
    @objc var onPlay: RCTDirectEventBlock?
    @objc var onPause: RCTDirectEventBlock?
    @objc var onStop: RCTDirectEventBlock?
    @objc var onLoopEnd: RCTDirectEventBlock?
    @objc var onStateChanged: RCTDirectEventBlock?
    @objc var onRiveEventReceived: RCTDirectEventBlock?
    @objc var onError: RCTDirectEventBlock?
    @objc var onCustomAssetLoader: RCTDirectEventBlock?
    @objc var isUserHandlingErrors: Bool
    
    // MARK: RiveRuntime Bindings
    var riveView: RiveView?
    var viewModel: RiveViewModel?
    
    @objc var resourceName: String? = nil {
        didSet {
            if (resourceName != nil) {
                url = nil
                resourceFromBundle = true;
                requiresLocalResourceReconfigure = true;
            }
        }
    }
    
    @objc var url: String? = nil {
        didSet {
            if (url != nil) {
                resourceName = nil
                resourceFromBundle = false
            }
        }
    }
    
    @objc var initialAssetsHandled: NSDictionary?
    
    @objc var fit: String?
    
    @objc var alignment: String?
    
    @objc var autoplay: Bool
    {
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
        if (changedProps.contains("url") || changedProps.contains("resourceName") || changedProps.contains("artboardName") || changedProps.contains("animationName") || changedProps.contains("stateMachineName")) {
            reloadView()
        }
        
        if (changedProps.contains("fit")) {
            viewModel?.fit = convertFit(fit)
        }
        
        if (changedProps.contains("alignment"))  {
            viewModel?.alignment = convertAlignment(alignment)
        }
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
        riveView?.playerDelegate = nil
        riveView?.stateMachineDelegate = nil
        removeReactSubview(riveView)
        
        viewModel = updatedViewModel
        riveView = viewModel!.createRiveView();
        addSubview(riveView!)
        riveView?.playerDelegate = self
        riveView?.stateMachineDelegate = self
    }
    
    private func isImageFile(fileName: String) -> Bool {
        // May need a better way to detect image assets
        let imageFileExtensions = ["jpg", "jpeg", "png", "webp"]

        let lowercasedFileName = fileName.lowercased()
        for ext in imageFileExtensions {
            if lowercasedFileName.hasSuffix(".\(ext)") {
                return true
            }
        }
        return false
    }
    
    private func splitFileNameAndExtension(fileName: String) -> (name: String, ext: String)? {
        let components = fileName.components(separatedBy: ".")

        // Ensure there is at least one period in the filename
        guard components.count > 1 else {
            return nil
        }

        // Extract the name and extension
        let name = components.dropLast().joined(separator: ".")
        let ext = components.last!

        return (name, ext)
    }
    
    private func configureViewModelFromResource() {
        if let name = resourceName {
            url = nil
            resourceFromBundle = true
            
            let updatedViewModel : RiveViewModel
            if let smName = stateMachineName {
                updatedViewModel = RiveViewModel(fileName: name, stateMachineName: smName, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName, loadCdn: true,
                    customLoader: {(asset: RiveFileAsset, data: Data, factory: RiveFactory) -> Bool in
                    
                    // Check for configuration that dictates whether to load in assets from the bundle here
                    // and/or whether the asset loading should be handled by the consumer
                    //
                    // Note: This config object is used to avoid synchronous calls over the bridge to React Native
                    // as this is not recommended. So we use a config object for consumers to dictate what assets are
                    // included in the xcode project that we can load in, and the return value for customAssetLoader
                    if let workingFilesHandled = self.initialAssetsHandled {
                        let convertedFilesHandled = SwiftFilesHandled(from: workingFilesHandled)
                        if let fileToHandle = convertedFilesHandled.files["\(asset.name())"] {
                            // Load asset flow:
                            // 1. Load from bundle if bundle asset name provided
                            // 2. Load from URL if url to load from is provided
                            // 3. Load the raw bytes passed in from RN if provided
                            if let bundleAssetName = fileToHandle.bundledAssetName as String? {
                                self.handleBundleAsset(bundleAssetName: bundleAssetName, asset: asset, factory: factory)
                            } else if let assetUrl = fileToHandle.assetUrl as String? {
                                self.handleUrlAsset(assetUrl: assetUrl, asset: asset, factory: factory)
                            }
                            return fileToHandle.willHandleAsset;
                        }
                    }
                    return false
                    }
                )
            } else if let animName = animationName {
                updatedViewModel = RiveViewModel(fileName: name, animationName: animName, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName)
            } else {
                updatedViewModel = RiveViewModel(fileName: name, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName)
            }
            
            createNewView(updatedViewModel: updatedViewModel)
            requiresLocalResourceReconfigure = false
        }
    }
    
    private func handleBundleAsset(bundleAssetName: String, asset: RiveFileAsset, factory: RiveFactory) {
        let splitBundleAssetName = self.splitFileNameAndExtension(fileName: bundleAssetName)
        guard let folderUrl = Bundle.main.url(forResource: splitBundleAssetName?.name, withExtension: splitBundleAssetName?.ext) else {
            fatalError("Could not find the asset \(bundleAssetName)")
       }
        // TODO: also handle fonts
       do {
           let fileData = try Data(contentsOf: folderUrl)
           if self.isImageFile(fileName: bundleAssetName) {
               let renderImage = factory.decodeImage(fileData)
               (asset as! RiveImageAsset).renderImage(renderImage)
           }
       } catch {
           fatalError("Could not create a Rive render image for \(bundleAssetName)")
       }
    }
    
    private func handleUrlAsset(assetUrl: String, asset: RiveFileAsset, factory: RiveFactory) {
        let url = URL(string: assetUrl)!
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            if let data = data {
                if self.isImageFile(fileName: asset.name()) {
                    let renderImage = factory.decodeImage(data)
                    debugPrint("IS IMAGE \(renderImage)");
                    (asset as! RiveImageAsset).renderImage(renderImage)
                }
            }
            
//            if (first){
//                first=false;
//                if let fontAsset = self.cachedFont, let font=self.fontCache.randomElement() {
//                    fontAsset.font(font);
//                }
//            }
        
        }
        task.resume()
    }
    
    private func configureViewModelFromUrl() {
        if let url = url {
            resourceName = nil
            resourceFromBundle = false
            
            let updatedViewModel : RiveViewModel
            // TODO: Need to make change in rive-ios to add customLoader callback when passing a URL for the Rive asset
            if let smName = stateMachineName {
                updatedViewModel = RiveViewModel(webURL: url, stateMachineName: smName, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, loadCdn: true, artboardName: artboardName
                )
            } else if let animName = animationName {
                updatedViewModel = RiveViewModel(webURL: url, animationName: animName, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName)
            } else {
                updatedViewModel = RiveViewModel(webURL: url, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName)
            }
            
            createNewView(updatedViewModel: updatedViewModel)
        }
    }
    
    private func reloadView() {
        if resourceFromBundle {
            if requiresLocalResourceReconfigure {
                configureViewModelFromResource()
                return; // exit early, new RiveViewModel created, no need to configure further
            }
            
            do {
                try viewModel?.configureModel(artboardName: artboardName, stateMachineName: stateMachineName, animationName: animationName)
            } catch let error as NSError {
                handleRiveError(error: error)
            }
            
        } else {
            configureViewModelFromUrl() // TODO: calling viewModel?.configureModel for a URL ViewModel throws. Requires further investigation. Currently recreating the whole ViewModel for certain prop changes.
        }
        
        
    }
    
    // MARK: - Playback Controls
    
    func play(animationName: String? = nil, rnLoopMode: RNLoopMode, rnDirection: RNDirection, isStateMachine: Bool) {
        let loop = RNLoopMode.mapToRiveLoop(rnLoopMode: rnLoopMode)
        let direction = RNDirection.mapToRiveDirection(rnDirection: rnDirection)
        if (animationName ?? "").isEmpty || isStateMachine {
            viewModel?.play(loop: loop, direction: direction)
        } else {
            viewModel?.play(animationName: animationName, loop: loop, direction: direction)
        }
    }
    
    func pause() {
        viewModel?.pause()
    }
    
    func stop() {
        viewModel?.stop()
    }
    
    func reset() {
        viewModel?.reset()
        reloadView()
    }
    
    // MARK: - StateMachine Inputs
    
    func fireState(stateMachineName: String, inputName: String) {
        viewModel?.triggerInput(inputName)
    }
    
    func setNumberState(stateMachineName: String, inputName: String, value: Float) {
        viewModel?.setInput(inputName, value: value)
    }
    
    func setBooleanState(stateMachineName: String, inputName: String, value: Bool) {
        viewModel?.setInput(inputName, value: value)
    }
    
    // MARK: - Text Runs
    func setTextRunValue(textRunName: String, textRunValue: String) throws {
        do {
            try viewModel?.setTextRunValue(textRunName, textValue: textRunValue)
        } catch let error as NSError {
            handleRiveError(error: error)
        }
    }
    
    // MARK: - StateMachineDelegate
    
    @objc func stateMachine(_ stateMachine: RiveStateMachineInstance, didChangeState stateName: String) {
        onStateChanged?(["stateMachineName": stateMachine.name(), "stateName": stateName])
    }
    
    @objc func stateMachine(_ stateMachine: RiveStateMachineInstance, receivedInput input: StateMachineInput) {
    }
    
    @objc func onRiveEventReceived(onRiveEvent riveEvent: RiveEvent) {
        // Need to convert NSObject to Dictionary so React Native can support the serialization to JS
        // Might be a better way to convert NSObject -> Dictionary in the future
        var eventDict = [
            "name": riveEvent.name(),
            "type": riveEvent.type(),
            "delay": riveEvent.delay(),
            "properties": riveEvent.properties(),
        ] as [String : Any]
        if let openUrlEvent = riveEvent as? RiveOpenUrlEvent {
            eventDict["url"] = openUrlEvent.url()
            eventDict["target"] = openUrlEvent.target()
        }
        onRiveEventReceived?(["riveEvent": eventDict])
    }
    
    // MARK: - PlayerDelegate
    
    func player(playedWithModel riveModel: RiveModel?) {
        if (riveModel?.animation != nil || riveModel?.stateMachine != nil) {
            onPlay?([
                "animationName": riveModel?.animation?.name() ?? riveModel?.stateMachine?.name() ?? "",
                "isStateMachine": riveModel?.stateMachine != nil
            ])
        }
    }
    
    func player(pausedWithModel riveModel: RiveModel?) {
        onPause?([
            "animationName": riveModel?.animation?.name() ?? riveModel?.stateMachine?.name() ?? "",
            "isStateMachine": riveModel?.stateMachine != nil
        ])
    }
    
    func player(loopedWithModel riveModel: RiveModel?, type: Int) {
        onLoopEnd?([
            "animationName": riveModel?.animation?.name() ?? "",
            "loopMode": RNLoopMode.mapToRNLoopMode(value: type).rawValue
        ])
    }
    
    func player(stoppedWithModel riveModel: RiveModel?) {
        onStop?([
            "animationName": riveModel?.animation?.name() ?? riveModel?.stateMachine?.name() ?? "",
            "isStateMachine": riveModel?.stateMachine != nil
        ])
    }
    
    func player(didAdvanceby seconds: Double, riveModel: RiveModel?) {
        // TODO: implement if in Android
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
        if let viewModel = viewModel, let riveView = viewModel.riveView {
            let artboardLocation = riveView.artboardLocation(
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

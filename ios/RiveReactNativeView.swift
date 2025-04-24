import UIKit
import RiveRuntime

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
    @objc var isUserHandlingErrors: Bool
    
    // MARK: RiveRuntime Bindings
    var riveView: RiveView?
    var viewModel: RiveViewModel?
    var cachedRiveFactory: RiveFactory?
    var previousReferencedAssets: NSDictionary?
    var cachedFileAssets: [String: RiveFileAsset] = [:]

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
    
    @objc var fit: String?
    
    @objc var layoutScaleFactor: NSNumber = -1.0 // -1.0 will inform the iOS runtime to determine the correct scale factor automatically
    
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

    @objc var referencedAssets: NSDictionary? {
        didSet {
            guard referencedAssets != previousReferencedAssets else { return }
            updateReferencedAssets(incomingReferencedAssets: referencedAssets)
            previousReferencedAssets = referencedAssets
        }
    }
    
    
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
        cleanupResources()
        
        super.removeFromSuperview()
    }
    
    private func cleanupResources() {
        cleanupFileAssetCache()
        previousReferencedAssets = nil
        removeReactSubview(riveView)
        riveView?.playerDelegate = nil
        riveView?.stateMachineDelegate = nil
        riveView = nil;
        viewModel?.deregisterView();
        viewModel = nil;
    }
    
    private func cleanupFileAssetCache() {
        cachedFileAssets.removeAll()
        cachedRiveFactory = nil
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        for view in subviews {
            view.reactSetFrame(self.bounds)
        }
    }
    
    override func didSetProps(_ changedProps: [String]!) {
        if (changedProps.contains("url") || changedProps.contains("resourceName") || changedProps.contains("artboardName") || changedProps.contains("animationName") || changedProps.contains("stateMachineName") || changedProps.contains("referencedAssets")) {
            reloadView()
        }
        
        if (changedProps.contains("fit")) {
            viewModel?.fit = convertFit(fit)
        }
        
        if (changedProps.contains("alignment"))  {
            viewModel?.alignment = convertAlignment(alignment)
        }
        
        if (changedProps.contains("layoutScaleFactor"))  {
            viewModel?.layoutScaleFactor = layoutScaleFactor.doubleValue
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
    
    private func configureViewModelFromResource() {
        cleanupFileAssetCache()
        
        if let name = resourceName {
            url = nil
            resourceFromBundle = true
            
            let updatedViewModel : RiveViewModel
            if let smName = stateMachineName {
                updatedViewModel = RiveViewModel(fileName: name, stateMachineName: smName, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName, customLoader: customLoader)
            } else if let animName = animationName {
                updatedViewModel = RiveViewModel(fileName: name, animationName: animName, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName, customLoader: customLoader)
            } else {
                updatedViewModel = RiveViewModel(fileName: name, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName, customLoader: customLoader)
            }
            
            updatedViewModel.layoutScaleFactor = layoutScaleFactor.doubleValue
            
            createNewView(updatedViewModel: updatedViewModel)
            requiresLocalResourceReconfigure = false
        }
    }
    
    private func configureViewModelFromUrl() {
        if let url = url {
            resourceName = nil
            resourceFromBundle = false
            
            let updatedViewModel : RiveViewModel
            if let smName = stateMachineName {
                updatedViewModel = RiveViewModel(webURL: url, stateMachineName: smName, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName)
            } else if let animName = animationName {
                updatedViewModel = RiveViewModel(webURL: url, animationName: animName, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName)
            } else {
                updatedViewModel = RiveViewModel(webURL: url, fit: convertFit(fit), alignment: convertAlignment(alignment), autoPlay: autoplay, artboardName: artboardName)
            }

            updatedViewModel.layoutScaleFactor = layoutScaleFactor.doubleValue
            
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
    
    private func updateReferencedAssets(incomingReferencedAssets: NSDictionary?) {
        guard let referencedAssets = incomingReferencedAssets?.copy() as? NSDictionary,
            let cachedReferencedAssets = previousReferencedAssets?.copy() as? NSDictionary else {
            return
        }

        let referencedKeys = Set(referencedAssets.allKeys as! [String])
        let cachedKeys = Set(cachedReferencedAssets.allKeys as! [String])

        // The keys are different, reloading the whole file
        if referencedKeys != cachedKeys {
            requiresLocalResourceReconfigure = true
            return
        }

        var hasChanged = false
        for (key, value) in referencedAssets {
            guard let keyString = key as? String,
                let cachedValue = cachedReferencedAssets[keyString] as? NSDictionary,
                let newValue = value as? NSDictionary,
                  !cachedValue.isEqual(to: newValue as! [AnyHashable : Any]) else {
                continue
            }

            hasChanged = true
            if let source = newValue["source"] as? NSDictionary,
            let asset = cachedFileAssets[keyString],
            let factory = cachedRiveFactory {
                loadAsset(source: source, asset: asset, factory: factory)
            }
        }

        if hasChanged && viewModel?.isPlaying == false {
//            riveView?.advance(delta: 0);            
           viewModel?.play() // manually calling play to force an update, ideally want to do a single advance
        }
    }

    private func customLoader(asset: RiveFileAsset, data: Data, factory: RiveFactory) -> Bool {
        guard let assetData = referencedAssets?[asset.uniqueName()] as? NSDictionary ?? referencedAssets?[asset.name()] as? NSDictionary else {
            return false
        }
        let usedKey = referencedAssets?[asset.uniqueName()] != nil ? asset.uniqueName() : asset.name()
        
        cachedRiveFactory = factory
        if cachedFileAssets[usedKey] == nil {
            cachedFileAssets[usedKey] = asset
        }

        if let source = assetData["source"] as? NSDictionary {
            loadAsset(source: source, asset: asset, factory: factory)
            return true
        }
        
        return false
    }
    
    private func loadAsset(source: NSDictionary, asset: RiveFileAsset, factory: RiveFactory) {
        let sourceAssetId = source["sourceAssetId"] as? String
        let sourceUrl = source["sourceUrl"] as? String
        let sourceAsset = source["sourceAsset"] as? String
        
        if let sourceAssetId = sourceAssetId {
            handleSourceAssetId(sourceAssetId, asset: asset, factory: factory)
        } else if let sourceUrl = sourceUrl {
            handleSourceUrl(sourceUrl, asset: asset, factory: factory)
        } else if let sourceAsset = sourceAsset {
            handleSourceAsset(sourceAsset, path: source["path"] as? String, asset: asset, factory: factory)
        }
    }
    
    private func handleSourceAssetId(_ sourceAssetId: String, asset: RiveFileAsset, factory: RiveFactory) {
        guard URL(string: sourceAssetId) != nil else {
            return
        }
        
        downloadUrlAsset(url: sourceAssetId) { [weak self] data in
            self?.processAssetBytes(data, asset: asset, factory: factory)
        }
    }
    
    private func handleSourceUrl(_ sourceUrl: String, asset: RiveFileAsset, factory: RiveFactory) {
        downloadUrlAsset(url: sourceUrl) { [weak self] data in
            self?.processAssetBytes(data, asset: asset, factory: factory)
        }
    }
    
    private func handleSourceAsset(_ sourceAsset: String, path: String?, asset: RiveFileAsset, factory: RiveFactory) {
        loadResourceAsset(sourceAsset: sourceAsset, path: path) {[weak self] data in
            self?.processAssetBytes(data, asset: asset, factory: factory)
        }
    }
    
    private func processAssetBytes(_ data: Data, asset: RiveFileAsset, factory: RiveFactory) {
        if (data.isEmpty == true) {
            return;
        }
        DispatchQueue.global(qos: .background).async {
            switch asset {
            case let imageAsset as RiveImageAsset:
                let decodedImage = factory.decodeImage(data)
                DispatchQueue.main.async {
                    imageAsset.renderImage(decodedImage)
                }
            case let fontAsset as RiveFontAsset:
                let decodedFont = factory.decodeFont(data)
                DispatchQueue.main.async {
                    fontAsset.font(decodedFont)
                }
            case let audioAsset as RiveAudioAsset:
                let decodedAudio = factory.decodeAudio(data)
                DispatchQueue.main.async {
                    audioAsset.audio(decodedAudio)
                }
            default:
                break
            }
        }
    }
    
    private func downloadUrlAsset(url: String, listener: @escaping (Data) -> Void) {
        guard isValidUrl(url) else {
            handleInvalidUrlError(url: url)
            return
        }
        
        let queue = URLSession.shared
        guard let requestUrl = URL(string: url) else {
            handleInvalidUrlError(url: url)
            return
        }
        
        let request = URLRequest(url: requestUrl)
        let task = queue.dataTask(with: request) {[weak self] data, response, error in
            if error != nil {
                self?.handleInvalidUrlError(url: url)
            } else if let data = data {
                listener(data)
            }
        }
        
        task.resume()
    }
    
    private func isValidUrl(_ url: String) -> Bool {
        if let url = URL(string: url) {
            return UIApplication.shared.canOpenURL(url)
        } else {
            return false
        }
    }
    
    private func splitFileNameAndExtension(fileName: String) -> (name: String?, ext: String?)? {
        let components = fileName.split(separator: ".")
        let name = (fileName as NSString).deletingPathExtension;
        let fileExtension = (fileName as NSString).pathExtension;
        guard components.count == 2 else { return nil }
        return (name: name, ext: fileExtension)
    }
    
    private func loadResourceAsset(sourceAsset: String, path: String?, listener: @escaping (Data) -> Void) {
        guard let splitSourceAssetName = splitFileNameAndExtension(fileName: sourceAsset),
              let name = splitSourceAssetName.name,
              let ext = splitSourceAssetName.ext else {
            handleRiveError(error: createAssetFileError(sourceAsset))
            return
        }
        
        guard let folderUrl = Bundle.main.url(forResource: name, withExtension: ext) else {
            handleRiveError(error: createAssetFileError(sourceAsset))
            return
        }
        
        DispatchQueue.global(qos: .background).async { [weak self] in
            do {
                let fileData = try Data(contentsOf: folderUrl)
                DispatchQueue.main.async {
                    listener(fileData)
                }
            } catch {
                DispatchQueue.main.async {
                    self?.handleRiveError(error: createAssetFileError(sourceAsset))
                }
            }
        }
    }
    
    private func handleInvalidUrlError(url: String) {
        handleRiveError(error: createIncorrectRiveURL(url))
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
    
    func getBooleanState(inputName: String) -> Bool? {
        return viewModel?.boolInput(named: inputName)?.value();
    }
    
    func getNumberState(inputName: String) -> Float? {
        return viewModel?.numberInput(named: inputName)?.value();
    }

    func getBooleanStateAtPath(inputName: String, path: String) -> Bool? {
        let input = viewModel?.riveModel?.artboard?.getBool(inputName, path: path);
        return input?.value();
    }
    
    func getNumberStateAtPath(inputName: String, path: String) -> Float? {
        let input = viewModel?.riveModel?.artboard?.getNumber(inputName, path: path);
        return input?.value();
    }

    func setBooleanState(stateMachineName: String, inputName: String, value: Bool) {
        viewModel?.setInput(inputName, value: value)
    }

    func fireStateAtPath(inputName: String, path: String) {
        viewModel?.triggerInput(inputName, path: path)
    }

    func setNumberStateAtPath(inputName: String, value: Float, path: String) {
        viewModel?.setInput(inputName, value: value, path: path)
    }
    
    func setBooleanStateAtPath(inputName: String, value: Bool, path: String) {
        viewModel?.setInput(inputName, value: value, path: path)
    }
    
    // MARK: - Text Runs
    func setTextRunValue(textRunName: String, textRunValue: String) throws {
        do {
            try viewModel?.setTextRunValue(textRunName, textValue: textRunValue)
        } catch let error as NSError {
            handleRiveError(error: error)
        }
    }

    func setTextRunValueAtPath(textRunName: String, textRunValue: String, path: String) throws {
        do {
            try viewModel?.setTextRunValue(textRunName, path: path, textValue: textRunValue)
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
                inArtboard: viewModel.riveModel?.artboard?.bounds() ?? CGRect.zero,
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

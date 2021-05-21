import UIKit
import RiveRuntime

class RiveReactNativeView: UIView, PlayDelegate {
    private var shouldBeReloaded = true
    private var resourceFromBundle = true
    
    @objc var onPlay: RCTDirectEventBlock?
    
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
    let riveView = RiveView()
    
    override func didSetProps(_ changedProps: [String]!) {
        reloadIfNeeded()
    }
    
    
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        riveView.playDelegate = self
        addSubview(riveView)
    }
    
    
    override func layoutSubviews() {
        super.layoutSubviews()
        for view in subviews {
            view.reactSetFrame(self.bounds)
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        fatalError("init(coder:) has not been implemented")
    }
    
    private func reloadIfNeeded() {
        if(shouldBeReloaded) {
            if let safeUrl = url {
                if !resourceFromBundle {
                    riveView.configure(getRiveURLResource(from: safeUrl), andAutoPlay: true)
                } else {
                    fatalError("You cannot pass both resourceName and url at the same time")
                }
            } else {
                if resourceFromBundle, let safeResourceName = resourceName {
                    riveView.configure(getRiveFile(resourceName: safeResourceName), andAutoPlay: true)
                } else {
                    fatalError("You must provide a url or a resourceName!")
                }
            }
            shouldBeReloaded = false
        }
    }
    
    func play(_ animationName: String) {
        onPlay?(["animationName": animationName])
    }
    
    @objc func play() {
        riveView.play()
    }
    
    @objc func pause() {
        riveView.pause()
    }
    
    //    func updateArtboard(_ artboard: RiveArtboard) {
    //        self.artboard = artboard;
    //    }
    
    //    override func draw(_ rect: CGRect) {
    //        guard let context = UIGraphicsGetCurrentContext(), let artboard = self.artboard else {
    //            return
    //        }
    //        let renderer = RiveRenderer(context: context);
    //        renderer.align(with: rect, withContentRect: artboard.bounds(), with: Alignment.Center, with: Fit.Contain)
    //        artboard.draw(renderer)
    //    }
    
}


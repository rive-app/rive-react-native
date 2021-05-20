import UIKit
import RiveRuntime

class RiveReactNativeView: UIView {
    @objc var resourceName: String?
    let riveView = RiveView()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        riveView.frame = frame
        riveView.configure(getRiveFile(resourceName: "truck_v7"), andAutoPlay: false)
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


import UIKit
import RiveRuntime

class MyRiveView: UIView {
    var riveView: RiveView!
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        riveView = RiveView()
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


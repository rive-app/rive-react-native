import Foundation
import RiveRuntime

enum RNFit: String {
    case Contain = "contain"
    case Cover = "cover"
    case Fill = "fill"
    case FitWidth = "fitWidth"
    case FitHeight = "fitHeight"
    case None = "none"
    case ScaleDown = "scaleDown"
    
    static func mapToRNFit(value: String) -> RNFit {
        if let rnEnum = RNFit(rawValue: value) {
            return rnEnum
        } else {
            fatalError("Unsupported fit type: \(value)")
        }
    }
    
    static func mapToRiveFit(rnFit: RNFit) -> Fit {
        switch rnFit {
        case .Contain:
            return Fit.fitContain
        case .Cover:
            return Fit.fitCover
        case .Fill:
            return Fit.fitFill
        case .FitWidth:
            return Fit.fitFitWidth
        case .FitHeight:
            return Fit.fitFitHeight
        case .None:
            return Fit.fitNone
        case .ScaleDown:
            return Fit.fitScaleDown
        }
    }
}

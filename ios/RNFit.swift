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
    case Layout = "layout"

    static func mapToRNFit(value: String) -> RNFit {
        if let rnEnum = RNFit(rawValue: value) {
            return rnEnum
        } else {
            // Return a default value instead of crashing
            RCTLogWarn("Unsupported fit type: \(value), defaulting to Contain")
            return .Contain
        }
    }

    static func mapToRiveFit(rnFit: RNFit) -> RiveFit {
        switch rnFit {
        case .Contain:
            return RiveFit.contain
        case .Cover:
            return RiveFit.cover
        case .Fill:
            return RiveFit.fill
        case .FitWidth:
            return RiveFit.fitWidth
        case .FitHeight:
            return RiveFit.fitHeight
        case .None:
            return RiveFit.noFit
        case .ScaleDown:
            return RiveFit.scaleDown
        case .Layout:
            return RiveFit.layout
        }
    }
}

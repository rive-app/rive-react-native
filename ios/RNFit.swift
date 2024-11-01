import Foundation
import RiveRuntime

enum RNFit: String {
    case Contain = "contain"
    case Layout = "layout"
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

    static func mapToRiveFit(rnFit: RNFit) -> RiveFit {
        switch rnFit {
        case .Contain:
            return RiveFit.contain
        case .Layout:
            return RiveFit.layout
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
        }
    }
}

import Foundation
import RiveRuntime

enum RNAlignment: String {
    case TopLeft = "topLeft"
    case TopCenter = "topCenter"
    case TopRight = "topRight"
    case CenterLeft = "centerLeft"
    case Center = "center"
    case CenterRight = "centerRight"
    case BottomLeft = "bottomLeft"
    case BottomCenter = "bottomCenter"
    case BottomRight = "bottomRight"

    static func mapToRNAlignment(value: String) -> RNAlignment {
        if let rnEnum = RNAlignment(rawValue: value) {
            return rnEnum
        } else {
            // Return a default value instead of crashing
            RCTLogWarn("Unsupported alignment type: \(value), defaulting to Center")
            return .Center
        }
    }

    static func mapToRiveAlignment(rnAlignment: RNAlignment) ->  RiveAlignment {
        switch rnAlignment {
        case .TopLeft:
            return RiveAlignment.topLeft
        case .TopCenter:
            return RiveAlignment.topCenter
        case .TopRight:
            return RiveAlignment.topRight
        case .CenterLeft:
            return RiveAlignment.centerLeft
        case .Center:
            return RiveAlignment.center
        case .CenterRight:
            return RiveAlignment.centerRight
        case .BottomLeft:
            return RiveAlignment.bottomLeft
        case .BottomCenter:
            return RiveAlignment.bottomCenter
        case .BottomRight:
            return RiveAlignment.bottomRight
        }
    }
}


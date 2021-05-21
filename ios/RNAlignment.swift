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
            fatalError("Unsupported alignment type: \(value)")
        }
    }
    
    static func mapToRiveAlignment(rnAlignment: RNAlignment) ->  Alignment{
        switch rnAlignment {
        case .TopLeft:
            return Alignment.alignmentTopLeft
        case .TopCenter:
            return Alignment.alignmentTopCenter
        case .TopRight:
            return Alignment.alignmentTopRight
        case .CenterLeft:
            return Alignment.alignmentCenterLeft
        case .Center:
            return Alignment.alignmentCenter
        case .CenterRight:
            return Alignment.alignmentCenterRight
        case .BottomLeft:
            return Alignment.alignmentBottomLeft
        case .BottomCenter:
            return Alignment.alignmentBottomCenter
        case .BottomRight:
            return Alignment.alignmentBottomRight
        }
    }
}


enum RNDirection: String {
    case Backwards = "backwards"
    case Auto = "auto"
    case Forwards = "forwards"
    
    static func mapToRNDirection(value: String) -> RNDirection {
        if let rnEnum = RNDirection(rawValue: value) {
            return rnEnum
        } else {
            fatalError("Unsupported direction type: \(value)")
        }
    }
    
    static func mapToRiveDirection(rnDirection: RNDirection) -> Direction {
        switch rnDirection {
        case .Backwards:
            return .directionBackwards
        case .Auto:
            return .directionAuto
        case .Forwards:
            return .directionForwards
        }
    }
}

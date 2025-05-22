enum RNDirection: String {
    case Backwards = "backwards"
    case Auto = "auto"
    case Forwards = "forwards"

    static func mapToRNDirection(value: String) -> RNDirection {
        if let rnEnum = RNDirection(rawValue: value) {
            return rnEnum
        } else {
            // Return a default value instead of crashing
            RCTLogWarn("Unsupported direction type: \(value), defaulting to Auto")
            return .Auto
        }
    }

    static func mapToRiveDirection(rnDirection: RNDirection) -> RiveDirection {
        switch rnDirection {
        case .Backwards:
            return .backwards
        case .Auto:
            return .autoDirection
        case .Forwards:
            return .forwards
        }
    }
}

enum RNLoopMode: String {
    case OneShot = "oneShot"
    case Loop = "loop"
    case PingPong = "pingPong"
    case Auto = "auto"

    static func mapToRNLoopMode(value: String) -> RNLoopMode {
        if let rnEnum = RNLoopMode(rawValue: value) {
            return rnEnum
        } else {
            // Return a default value instead of crashing
            RCTLogWarn("Unsupported loop mode type: \(value), defaulting to Auto")
            return .Auto
        }
    }


    static func mapToRNLoopMode(value: Int) -> RNLoopMode {
        if let riveEnum = RiveRuntime.RiveLoop(rawValue: value) {
            switch (riveEnum) {
            case .oneShot:
                return .OneShot
            case .loop:
                return .Loop
            case .pingPong:
                return .PingPong
            case .autoLoop:
                return .Auto
            default:
                return .Auto
            }


        } else {
            // Return a default value instead of crashing
            RCTLogWarn("Unsupported loop mode type: \(value), defaulting to Auto")
            return .Auto
        }
    }

    static func mapToRiveLoop(rnLoopMode: RNLoopMode) ->  RiveLoop {
        switch rnLoopMode {
        case .OneShot:
            return .oneShot
        case .Loop:
            return .loop
        case .PingPong:
            return .pingPong
        case .Auto:
            return .autoLoop
        }
    }
}

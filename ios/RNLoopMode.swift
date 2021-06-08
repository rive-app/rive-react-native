enum RNLoopMode: String {
    case OneShot = "oneShot"
    case Loop = "loop"
    case PingPong = "pingPong"
    case Auto = "auto"
    
    static func mapToRNLoopMode(value: String) -> RNLoopMode {
        if let rnEnum = RNLoopMode(rawValue: value) {
            return rnEnum
        } else {
            fatalError("Unsupported loop mode type: \(value)")
        }
    }
    
    
    static func mapToRNLoopMode(value: Int) -> RNLoopMode {
        if let riveEnum = RiveRuntime.Loop(rawValue: value) {
            switch (riveEnum) {
            case .loopOneShot:
                return .OneShot
            case .loopLoop:
                return .Loop
            case .loopPingPong:
                return .PingPong
            case .loopAuto:
                return .Auto
            default:
                return .Auto
            }
            
            
        } else {
            fatalError("Unsupported loop mode type: \(value)")
        }
    }
    
    static func mapToRiveLoop(rnLoopMode: RNLoopMode) ->  Loop{
        switch rnLoopMode {
        case .OneShot:
            return .loopOneShot
        case .Loop:
            return .loopLoop
        case .PingPong:
            return .loopPingPong
        case .Auto:
            return .loopAuto
        }
    }
}

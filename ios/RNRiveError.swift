struct BaseRNRiveError {
    let type: String;
    var message: String = "Default Message"
}


struct RNRiveError {
    static let FileNotFound = BaseRNRiveError(type: "FileNotFound")
    static let UnsupportedRuntimeVersion = BaseRNRiveError(type: "UnsupportedRuntimeVersion")
    static let IncorrectAnimationName = BaseRNRiveError(type: "IncorrectAnimationName")
    static let MalformedFile = BaseRNRiveError(type: "MalformedFile")
    
    
    static func mapToRNRiveError(riveError: NSError) -> BaseRNRiveError? {
        let riveErrorName = riveError.userInfo["name"] as! String
        var resultError: BaseRNRiveError? = nil
        switch riveErrorName {
        case "UnsupportedVersion":
            resultError = RNRiveError.UnsupportedRuntimeVersion
            break;
        case "Malformed":
            break
        case "FileNotFound":
            break;
        case "IncorrectRiveFileURL":
            break;
        case "NoAnimationFound":
            resultError = RNRiveError.IncorrectAnimationName
            break;
        case "NoArtboardFound":
            break;
        case "NoStateMachineFound":
            break;
        case "NoStateMachineInputFound":
            break;
        default:
            return nil
        }
        
        resultError?.message = riveError.localizedDescription
        return resultError
    }
}

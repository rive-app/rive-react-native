struct BaseRNRiveError {
    let type: String;
    var message: String = "Default Message"
}


struct RNRiveError {
    static let FileNotFound = BaseRNRiveError(type: "FileNotFound")
    static let UnsupportedRuntimeVersion = BaseRNRiveError(type: "UnsupportedRuntimeVersion")
    static let IncorrectAnimationName = BaseRNRiveError(type: "IncorrectAnimationName")
    static let MalformedFile = BaseRNRiveError(type: "MalformedFile")
    static let IncorrectRiveFileUrl = BaseRNRiveError(type: "IncorrectRiveFileUrl")
    static let IncorrectArtboardName = BaseRNRiveError(type: "IncorrectArtboardName")
    static let IncorrectStateMachineName = BaseRNRiveError(type: "IncorrectStateMachineName")
    static let IncorrectStateMachineInput = BaseRNRiveError(type: "IncorrectStateMachineInput")
    
    
    static func mapToRNRiveError(riveError: NSError) -> BaseRNRiveError? {
        let riveErrorName = riveError.userInfo["name"] as! String
        var resultError: BaseRNRiveError? = nil
        switch riveErrorName {
        case "UnsupportedVersion":
            resultError = RNRiveError.UnsupportedRuntimeVersion
            break;
        case "Malformed":
            resultError = RNRiveError.MalformedFile
            break
        case "FileNotFound":
            resultError = RNRiveError.FileNotFound
            break;
        case "IncorrectRiveFileURL":
            resultError = RNRiveError.IncorrectRiveFileUrl
            break;
        case "NoAnimationFound":
            resultError = RNRiveError.IncorrectAnimationName
            break;
        case "NoArtboardFound":
            resultError = RNRiveError.IncorrectArtboardName
            break;
        case "NoStateMachineFound":
            resultError = RNRiveError.IncorrectStateMachineName
            break;
        case "NoStateMachineInputFound":
            resultError = RNRiveError.IncorrectStateMachineInput
            break;
        default:
            return nil
        }
        
        resultError?.message = riveError.localizedDescription
        return resultError
    }
}

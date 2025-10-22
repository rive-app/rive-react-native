enum RiveErrorCode: Int {
    case malformedFile = 100
    case fileNotFound = 800
    case assetFileError = 801
    case incorrectRiveURL = 900
}

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
    static let TextRunNotFoundError = BaseRNRiveError(type: "TextRunNotFoundError")
    static let DataBindingError = BaseRNRiveError(type: "DataBindingError")


    static func mapToRNRiveError(riveError: NSError) -> BaseRNRiveError? {
        guard let riveErrorName = riveError.userInfo["name"] as? String else {
            // If we can't get the error name, return a generic error with the description
            var genericError = BaseRNRiveError(type: "UnknownError")
            genericError.message = riveError.localizedDescription
            return genericError
        }

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
        case "TextRunNotFoundError":
            resultError = RNRiveError.TextRunNotFoundError
            break;
        case "DataBindingError":
            resultError = RNRiveError.DataBindingError
            break;
        default:
            return nil
        }
        resultError?.message = riveError.localizedDescription
        return resultError
    }
}


func createFileNotFoundError() -> NSError {
    return NSError(domain: RiveErrorDomain, code: RiveErrorCode.fileNotFound.rawValue, userInfo: [NSLocalizedDescriptionKey: "File not found", "name": "FileNotFound"])
}

func createMalformedFileError() -> NSError {
    return NSError(domain: RiveErrorDomain, code: RiveErrorCode.malformedFile.rawValue, userInfo: [NSLocalizedDescriptionKey: "Malformed Rive File", "name": "Malformed"])
}

func createAssetFileError(_ assetName: String) -> NSError {
    return NSError(domain: RiveErrorDomain, code: RiveErrorCode.assetFileError.rawValue, userInfo: [NSLocalizedDescriptionKey: "Could not load Rive asset: \(assetName)", "name": "FileNotFound"])
}

func createIncorrectRiveURL(_ url: String) -> NSError {
    return NSError(domain: RiveErrorDomain, code: RiveErrorCode.incorrectRiveURL.rawValue, userInfo: [NSLocalizedDescriptionKey: "Unable to download Rive file from: \(url)", "name": "IncorrectRiveFileURL"])
}

func getRiveFile(resourceName: String, resourceExt: String=".riv") throws ->  RiveFile {
    guard let url = Bundle.main.url(forResource: resourceName, withExtension: resourceExt) else {
        throw createFileNotFoundError()
    }
    return try importRiveFile(from: url)
}

func getRiveURLResource(from urlString: String) throws -> RiveFile {
    guard let url = URL.init(string: urlString) else {
        RCTLogWarn("Failed to locate resource from \(urlString)")
        throw createIncorrectRiveURL(urlString)
        
    }
    
    return try importRiveFile(from: url)
}

func importRiveFile(from url: URL) throws ->  RiveFile {
    guard var data = try? Data(contentsOf: url) else {
        throw createFileNotFoundError()
    }
    let bytes = [UInt8](data)
    
    return try data.withUnsafeMutableBytes{(riveBytes:UnsafeMutableRawBufferPointer) throws ->RiveFile in
        guard let rawPointer = riveBytes.baseAddress else {
            throw createMalformedFileError()
        }
        let pointer = rawPointer.bindMemory(to: UInt8.self, capacity: bytes.count)
        
            let riveFile = try RiveFile(bytes:pointer, byteLength: UInt64(bytes.count))
            return riveFile
    }
}

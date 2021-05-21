func getRiveFile(resourceName: String, resourceExt: String=".riv") -> RiveFile {
    guard let url = Bundle.main.url(forResource: resourceName, withExtension: resourceExt) else {
        fatalError("Failed to locate \(resourceName) in bundle.")
    }
    return importRiveFile(from: url)
}

func getRiveURLResource(from urlString: String) -> RiveFile {
    guard let url = URL.init(string: urlString) else {
        fatalError("Failed to locate resource from \(urlString)")
    }
    
    return importRiveFile(from: url)
}

func importRiveFile(from url: URL) -> RiveFile {
    guard var data = try? Data(contentsOf: url) else {
        fatalError("Failed to load data from the \(url).")
    }
    let bytes = [UInt8](data)
    
    return data.withUnsafeMutableBytes{(riveBytes:UnsafeMutableRawBufferPointer)->RiveFile in
        guard let rawPointer = riveBytes.baseAddress else {
            fatalError("File pointer is messed up")
        }
        let pointer = rawPointer.bindMemory(to: UInt8.self, capacity: bytes.count)
        
        guard let riveFile = RiveFile(bytes:pointer, byteLength: UInt64(bytes.count)) else {
            fatalError("Failed to import \(url).")
        }
        return riveFile
    }
}

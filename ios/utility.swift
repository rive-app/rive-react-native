

func getRiveFile(resourceName: String, resourceExt: String=".riv") -> RiveFile? {
    guard let url = Bundle.main.url(forResource: resourceName, withExtension: resourceExt) else {
        RCTLogWarn("Failed to locate \(resourceName) in bundle.")
        return nil
    }
    return importRiveFile(from: url)
}

func getRiveURLResource(from urlString: String) -> RiveFile? {
    guard let url = URL.init(string: urlString) else {
        RCTLogWarn("Failed to locate resource from \(urlString)")
        return nil
    }
    
    return importRiveFile(from: url)
}

func importRiveFile(from url: URL) -> RiveFile? {
    guard var data = try? Data(contentsOf: url) else {
        RCTLogWarn("Failed to load data from the \(url).")
        return nil
    }
    let bytes = [UInt8](data)
    
    return data.withUnsafeMutableBytes{(riveBytes:UnsafeMutableRawBufferPointer)->RiveFile? in
        guard let rawPointer = riveBytes.baseAddress else {
            RCTLogWarn("File pointer from the: \(url) is messed up.")
            return nil
        }
        let pointer = rawPointer.bindMemory(to: UInt8.self, capacity: bytes.count)
        
        guard let riveFile = RiveFile(bytes:pointer, byteLength: UInt64(bytes.count)) else {
            RCTLogWarn("Failed to import \(url).")
            return nil
        }
        return riveFile
    }
}

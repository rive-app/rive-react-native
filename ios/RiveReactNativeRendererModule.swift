//
//  RiveReactNativeRendererModule.swift
//  rive-react-native
//
//  Created by Peter G Hayes on 31/05/2024.
//

import Foundation
import RiveRuntime

@objc(RiveReactNativeRendererModule)
class RiveReactNativeRendererModule: NSObject {
    
    @objc(defaultRenderer:androidRenderer:)
    func defaultRenderer(_ iosRenderer: String, androidRenderer: String) -> Void {
        let rnRendererType = RNRiveRendererType.mapToRNRiveRendererType(value: iosRenderer)
        RenderContextManager.shared().defaultRenderer = RNRiveRendererType.mapToRendererType(rnRendererType: rnRendererType)
    }
    // Required to register the module with React Native
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
}

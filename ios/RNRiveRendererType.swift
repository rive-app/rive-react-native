//
//  RNRiveRendererType.swift
//  rive-react-native
//
//  Created by Peter G Hayes on 31/05/2024.
//

import Foundation
import RiveRuntime

enum RNRiveRendererType: String {
    case Rive = "rive"
    case Skia = "skia"
    case CoreGraphics = "coreGraphics"
    
    static func mapToRNRiveRendererType(value: String) -> RNRiveRendererType {
        if let rnEnum = RNRiveRendererType(rawValue: value) {
            return rnEnum
        } else {
            fatalError("Unsupported renderer type: \(value)")
        }
    }
    
    static func mapToRendererType(rnRendererType: RNRiveRendererType) -> RendererType {
        switch rnRendererType {
        case .Rive:
            return RendererType.riveRenderer
        case .Skia:
            return RendererType.skiaRenderer
        case .CoreGraphics:
            return RendererType.cgRenderer
        }
    }
}


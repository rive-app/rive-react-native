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
    case CoreGraphics = "coreGraphics"

    static func mapToRNRiveRendererType(value: String) -> RNRiveRendererType {
        if let rnEnum = RNRiveRendererType(rawValue: value) {
            return rnEnum
        } else {
            RCTLogWarn("Unsupported renderer type: \(value), defaulting to Rive")
            return .Rive
        }
    }

    static func mapToRendererType(rnRendererType: RNRiveRendererType) -> RendererType {
        switch rnRendererType {
        case .Rive:
            return RendererType.riveRenderer
        case .CoreGraphics:
            return RendererType.cgRenderer
        }
    }
}


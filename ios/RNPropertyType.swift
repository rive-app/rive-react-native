//
//  RNPropertyType.swift
//  rive-react-native
//
//  Created by Peter G Hayes on 02/05/2025.
//

import Foundation

enum RNPropertyType: String {
    case Number = "number"
    case String = "string"
    case Boolean = "boolean"
    case Color = "color"
    case Trigger = "trigger"
    case Enum = "enum"
    
    static func mapToRNPropertyType(value: String) -> RNPropertyType {
        if let rnEnum = RNPropertyType(rawValue: value) {
            return rnEnum
        } else {
            fatalError("Unsupported property type: \(value)")
        }
    }
}

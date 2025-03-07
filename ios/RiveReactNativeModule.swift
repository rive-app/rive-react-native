//
//  RiveReactNativeModule.swift
//  RiveReactNative
//
//  Created by Peter G Hayes on 07/03/2025.
//  Copyright © 2025 Facebook. All rights reserved.
//

import Foundation

@objc(RiveReactNativeModule)
class RiveReactNativeModule: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "RiveReactNativeModule";
    }
    
    @objc weak var bridge: RCTBridge?
    
    @objc(getBooleanState:inputName:resolver:rejecter:)
    func getBooleanState(_ node: NSNumber, inputName: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) -> Void {
        
        DispatchQueue.main.async {
            guard let bridge = self.bridge,
                  let view = bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                rejecter("VIEW_NOT_FOUND", "Could not find RiveReactNativeView", nil)
                return
            }
            let value = view.getBooleanState(inputName: inputName)
            resolver(value)
        }
    }
    
    @objc(getNumberState:inputName:resolver:rejecter:)
    func getNumberState(_ node: NSNumber, inputName: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) -> Void {
        
        DispatchQueue.main.async {
            guard let bridge = self.bridge,
                  let view = bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                rejecter("VIEW_NOT_FOUND", "Could not find RiveReactNativeView", nil)
                return
            }
            let value = view.getNumberState(inputName: inputName)
            resolver(value)
        }
    }
    
    @objc(getBooleanStateAtPath:inputName:path:resolver:rejecter:)
    func getBooleanStateAtPath(_ node: NSNumber, inputName: String, path: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) -> Void {
        
        DispatchQueue.main.async {
            guard let bridge = self.bridge,
                  let view = bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                rejecter("VIEW_NOT_FOUND", "Could not find RiveReactNativeView", nil)
                return
            }
            let value = view.getBooleanStateAtPath(inputName: inputName, path: path)
            resolver(value)
        }
    }
    
    @objc(getNumberStateAtPath:inputName:path:resolver:rejecter:)
    func getNumberStateAtPath(_ node: NSNumber, inputName: String, path: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) -> Void {
        
        DispatchQueue.main.async {
            guard let bridge = self.bridge,
                  let view = bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                rejecter("VIEW_NOT_FOUND", "Could not find RiveReactNativeView", nil)
                return
            }
            let value = view.getNumberStateAtPath(inputName: inputName, path: path)
            resolver(value)
        }
    }
    
    // Required to register the module with React Native
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
}

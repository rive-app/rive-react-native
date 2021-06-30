import UIKit
import RiveRuntime

@objc(RiveReactNativeViewManager)
class RiveReactNativeViewManager: RCTViewManager {
    
    override func view() -> UIView! {
        return RiveReactNativeView()
    }
    
    @objc func play(_ node: NSNumber, animationNames: [String], loopMode: String, direction: String, areStateMachines: Bool) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! RiveReactNativeView
            component.play(animationNames: animationNames, rnLoopMode: RNLoopMode.mapToRNLoopMode(value: loopMode), rnDirection: RNDirection.mapToRNDirection(value: direction), areStateMachines: areStateMachines)
            
        }
    }
    
    @objc func pause(_ node: NSNumber, animationNames: [String], areStateMachines: Bool) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! RiveReactNativeView
            component.pause(animationNames: animationNames, areStateMachines: areStateMachines)
        }
    }
    
    @objc func stop(_ node: NSNumber, animationNames: [String], areStateMachines: Bool) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! RiveReactNativeView
            component.stop(animationNames: animationNames, areStateMachines: areStateMachines)
        }
    }
    
    @objc func reset(_ node: NSNumber) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! RiveReactNativeView
            component.reset()
        }
    }
    
    @objc func fireState(_ node: NSNumber, stateMachineName: String, inputName: String) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! RiveReactNativeView
            component.fireState(stateMachineName: stateMachineName, inputName: inputName)
        }
    }
    @objc func setBooleanState(_ node: NSNumber, stateMachineName: String, inputName: String, value: Bool) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! RiveReactNativeView
            component.setBooleanState(stateMachineName: stateMachineName, inputName: inputName, value: value)
        }
    }
    
    @objc func setNumberState(_ node: NSNumber, stateMachineName: String, inputName: String, value: NSNumber) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! RiveReactNativeView
            component.setNumberState(stateMachineName: stateMachineName, inputName: inputName, value: Float(truncating: value))
        }
    }

    @objc static override func requiresMainQueueSetup() -> Bool {
        return false
    }
}

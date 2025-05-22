import Foundation
import RiveRuntime

@objc(RiveReactNativeViewManager)
class RiveReactNativeViewManager: RCTViewManager {

    override func view() -> UIView! {
            let view = RiveReactNativeView()
            view.bridge = self.bridge
            return view
        }

    @objc func play(_ node: NSNumber, animationName: String, loop: String, direction: String, isStateMachine: Bool) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for play")
                return
            }
            component.play(animationName: animationName, rnLoopMode: RNLoopMode.mapToRNLoopMode(value: loop), rnDirection: RNDirection.mapToRNDirection(value: direction), isStateMachine: isStateMachine);

        }
    }

    @objc func pause(_ node: NSNumber) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for pause")
                return
            }
            component.pause()
        }
    }

    @objc func stop(_ node: NSNumber) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for stop")
                return
            }
            component.stop()
        }
    }

    @objc func reset(_ node: NSNumber) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for reset")
                return
            }
            component.reset()
        }
    }

    @objc func fireState(_ node: NSNumber, stateMachineName: String, inputName: String) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for fireState")
                return
            }
            component.fireState(stateMachineName: stateMachineName, inputName: inputName)
        }
    }

    @objc func setBooleanState(_ node: NSNumber, stateMachineName: String, inputName: String, value: Bool) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for setBooleanState")
                return
            }
            component.setBooleanState(stateMachineName: stateMachineName, inputName: inputName, value: value)
        }
    }

    @objc func setNumberState(_ node: NSNumber, stateMachineName: String, inputName: String, value: NSNumber) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for setNumberState")
                return
            }
            component.setNumberState(stateMachineName: stateMachineName, inputName: inputName, value: Float(truncating: value))
        }
    }

    @objc func fireStateAtPath(_ node: NSNumber, inputName: String, path: String) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for fireStateAtPath")
                return
            }
            component.fireStateAtPath(inputName: inputName, path: path)
        }
    }

    @objc func setBooleanStateAtPath(_ node: NSNumber, inputName: String, value: Bool, path: String) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for setBooleanStateAtPath")
                return
            }
            component.setBooleanStateAtPath(inputName: inputName, value: value, path: path)
        }
    }

    @objc func setNumberStateAtPath(_ node: NSNumber, inputName: String, value: NSNumber, path: String) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for setNumberStateAtPath")
                return
            }
            component.setNumberStateAtPath(inputName: inputName, value: Float(truncating: value), path: path)
        }
    }

    @objc func touchBegan(_ node: NSNumber, x: NSNumber, y: NSNumber) {
        DispatchQueue.main.async {
            guard let view = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for touchBegan")
                return
            }
            let touch = CGPoint(x: x.doubleValue, y: y.doubleValue)
            view.touchBegan(touch)
        }
    }

    @objc func touchEnded(_ node: NSNumber, x: NSNumber, y: NSNumber) {
        DispatchQueue.main.async {
            guard let view = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for touchEnded")
                return
            }
            let touch = CGPoint(x: x.doubleValue, y: y.doubleValue)
            view.touchEnded(touch)
        }
    }

    @objc func setTextRunValue(_ node: NSNumber, textRunName: String, textRunValue: String) {
        DispatchQueue.main.async {
            guard let view = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for setTextRunValue")
                return
            }
            do {
                try view.setTextRunValue(textRunName: textRunName, textRunValue: textRunValue)
            } catch {
                RCTLogError("Failed to set text run value: \(error.localizedDescription)")
            }
        }
    }

    @objc func setTextRunValueAtPath(_ node: NSNumber, textRunName: String, textRunValue: String, path: String) {
        DispatchQueue.main.async {
            guard let view = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for setTextRunValueAtPath")
                return
            }
            do {
                try view.setTextRunValueAtPath(textRunName: textRunName, textRunValue: textRunValue, path: path)
            } catch {
                RCTLogError("Failed to set text run value at path: \(error.localizedDescription)")
            }
        }
    }

    @objc func setBooleanPropertyValue(_ node: NSNumber, path: String, value: Bool) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for setBooleanPropertyValue")
                return
            }
            component.setBooleanPropertyValue(path: path, value: value)
        }
    }

    @objc func setStringPropertyValue(_ node: NSNumber, path: String, value: String) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for setStringPropertyValue")
                return
            }
            component.setStringPropertyValue(path: path, value: value)
        }
    }

    @objc func setNumberPropertyValue(_ node: NSNumber, path: String, value: NSNumber) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for setNumberPropertyValue")
                return
            }
            component.setNumberPropertyValue(path: path, value: Float(truncating: value))
        }
    }

    @objc func setColorPropertyValue(_ node: NSNumber, path: String, r: NSNumber, g: NSNumber, b: NSNumber, a: NSNumber) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for setColorPropertyValue")
                return
            }
            component.setColorPropertyValue(path: path, r: r.intValue, g: g.intValue, b: b.intValue, a: a.intValue)
        }
    }

    @objc func setEnumPropertyValue(_ node: NSNumber, path: String, value: String) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for setEnumPropertyValue")
                return
            }
            component.setEnumPropertyValue(path: path, value: value)
        }
    }

    @objc func fireTriggerProperty(_ node: NSNumber, path: String) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
                RCTLogError("Could not cast view to RiveReactNativeView for fireTriggerProperty")
                return
            }
            component.fireTriggerProperty(path: path)
        }
    }

    @objc func registerPropertyListener(_ node: NSNumber, path: String, propertyType: String) {
        DispatchQueue.main.async {
            guard let component = self.bridge.uiManager.view(forReactTag: node) as? RiveReactNativeView else {
              RCTLogError("Could not cast view to RiveReactNativeView for registerPropertyListener")
              return
            }
            component.registerPropertyListener(path: path, propertyType: propertyType)
        }
    }

    @objc static override func requiresMainQueueSetup() -> Bool {
        return false
    }
}

import UIKit
import RiveRuntime

@objc(RiveReactNativeViewManager)
class RiveReactNativeViewManager: RCTViewManager {

    override func view() -> UIView! {
            let view = RiveReactNativeView()
            view.bridge = self.bridge
            return view
        }

    private func withRiveReactNativeView(_ node: NSNumber, _ file: String=#file, _ line: UInt=#line, _ handler: @escaping (RiveReactNativeView) -> Void) {
        DispatchQueue.main.async {
            guard let bridge = self.bridge else {
                RCTSwiftLog.error("Bridge is nil when trying to access RiveReactNativeView", file: file, line: line)
                return
            }

            guard let view = bridge.uiMan ager.view(forReactTag: node) else {
                RCTSwiftLog.error("Could not find view with tag: \(node)", file: file, line:line)
                return
            }

            guard let riveView = view as? RiveReactNativeView else {
                RCTSwiftLog.error("View with tag \(node) is not a RiveReactNativeView, got \(String(describing: type(of: view))) instead", file: file, line: line)
                return
            }

            handler(riveView)
        }
    }

    @objc func play(_ node: NSNumber, animationName: String, loop: String, direction: String, isStateMachine: Bool) {
        withRiveReactNativeView(node) {
            $0.play(animationName: animationName, rnLoopMode: RNLoopMode.mapToRNLoopMode(value: loop), rnDirection: RNDirection.mapToRNDirection(value: direction), isStateMachine: isStateMachine)
        }
    }

    @objc func pause(_ node: NSNumber) {
        withRiveReactNativeView(node) { $0.pause() }
    }

    @objc func stop(_ node: NSNumber) {
        withRiveReactNativeView(node) { $0.stop() }
    }

    @objc func reset(_ node: NSNumber) {
        withRiveReactNativeView(node) { $0.reset() }
    }

    @objc func fireState(_ node: NSNumber, stateMachineName: String, inputName: String) {
        withRiveReactNativeView(node) { $0.fireState(stateMachineName: stateMachineName, inputName: inputName) }
    }

    @objc func setBooleanState(_ node: NSNumber, stateMachineName: String, inputName: String, value: Bool) {
        withRiveReactNativeView(node) { $0.setBooleanState(stateMachineName: stateMachineName, inputName: inputName, value: value) }
    }

    @objc func setNumberState(_ node: NSNumber, stateMachineName: String, inputName: String, value: NSNumber) {
        withRiveReactNativeView(node) { $0.setNumberState(stateMachineName: stateMachineName, inputName: inputName, value: Float(truncating: value)) }
    }

    @objc func fireStateAtPath(_ node: NSNumber, inputName: String, path: String) {
        withRiveReactNativeView(node) { $0.fireStateAtPath(inputName: inputName, path: path) }
    }

    @objc func setBooleanStateAtPath(_ node: NSNumber, inputName: String, value: Bool, path: String) {
        withRiveReactNativeView(node) { $0.setBooleanStateAtPath(inputName: inputName, value: value, path: path) }
    }

    @objc func setNumberStateAtPath(_ node: NSNumber, inputName: String, value: NSNumber, path: String) {
        withRiveReactNativeView(node) { $0.setNumberStateAtPath(inputName: inputName, value: Float(truncating: value), path: path) }
    }

    @objc func touchBegan(_ node: NSNumber, x: NSNumber, y: NSNumber) {
        withRiveReactNativeView(node) {
            let touch = CGPoint(x: x.doubleValue, y: y.doubleValue)
            $0.touchBegan(touch)
        }
    }

    @objc func touchEnded(_ node: NSNumber, x: NSNumber, y: NSNumber) {
        withRiveReactNativeView(node) {
            let touch = CGPoint(x: x.doubleValue, y: y.doubleValue)
            $0.touchEnded(touch)
        }
    }

    @objc func setTextRunValue(_ node: NSNumber, textRunName: String, textRunValue: String) {
        withRiveReactNativeView(node) {
            do {
                try $0.setTextRunValue(textRunName: textRunName, textRunValue: textRunValue)
            } catch {
                RCTLogError("Failed to set text run value: \(error.localizedDescription)")
            }
        }
    }

    @objc func setTextRunValueAtPath(_ node: NSNumber, textRunName: String, textRunValue: String, path: String) {
        withRiveReactNativeView(node) {
            do {
                try $0.setTextRunValueAtPath(textRunName: textRunName, textRunValue: textRunValue, path: path)
            } catch {
                RCTLogError("Failed to set text run value at path: \(error.localizedDescription)")
            }
        }
    }

    @objc func setBooleanPropertyValue(_ node: NSNumber, path: String, value: Bool) {
        withRiveReactNativeView(node) { $0.setBooleanPropertyValue(path: path, value: value) }
    }

    @objc func setStringPropertyValue(_ node: NSNumber, path: String, value: String) {
        withRiveReactNativeView(node) { $0.setStringPropertyValue(path: path, value: value) }
    }

    @objc func setNumberPropertyValue(_ node: NSNumber, path: String, value: NSNumber) {
        withRiveReactNativeView(node) { $0.setNumberPropertyValue(path: path, value: Float(truncating: value)) }
    }

    @objc func setColorPropertyValue(_ node: NSNumber, path: String, r: NSNumber, g: NSNumber, b: NSNumber, a: NSNumber) {
        withRiveReactNativeView(node) { $0.setColorPropertyValue(path: path, r: r.intValue, g: g.intValue, b: b.intValue, a: a.intValue) }
    }

    @objc func setEnumPropertyValue(_ node: NSNumber, path: String, value: String) {
        withRiveReactNativeView(node) { $0.setEnumPropertyValue(path: path, value: value) }
    }

    @objc func fireTriggerProperty(_ node: NSNumber, path: String) {
        withRiveReactNativeView(node) { $0.fireTriggerProperty(path: path) }
    }

    @objc func registerPropertyListener(_ node: NSNumber, path: String, propertyType: String) {
        withRiveReactNativeView(node) { $0.registerPropertyListener(path: path, propertyType: propertyType) }
    }

    @objc static override func requiresMainQueueSetup() -> Bool {
        return false
    }
}

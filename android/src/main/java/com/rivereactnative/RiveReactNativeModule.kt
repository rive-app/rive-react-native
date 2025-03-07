package com.rivereactnative

import com.facebook.react.bridge.*
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.UIManagerModule

class RiveReactNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "RiveReactNativeModule"

  private fun <T> handleState(node: Int, promise: Promise, stateGetter: (RiveReactNativeView) -> T) {
    val uiManager = UIManagerHelper.getUIManager(reactApplicationContext, node)
    val view = uiManager?.resolveView(node) as? RiveReactNativeView
    if (view != null) {
      val value = stateGetter(view)
      promise.resolve(value)
    } else {
      promise.reject("VIEW_NOT_FOUND", "Could not find RiveReactNativeView")
    }
  }

  @ReactMethod
  fun getBooleanState(node: Int, inputName: String, promise: Promise) {
    handleState(node, promise) { view -> view.getBooleanState(inputName) }
  }

  @ReactMethod
  fun getNumberState(node: Int, inputName: String, promise: Promise) {
    handleState(node, promise) { view -> view.getNumberState(inputName) }
  }

  @ReactMethod
  fun getBooleanStateAtPath(node: Int, inputName: String, path: String, promise: Promise) {
    handleState(node, promise) { view -> view.getBooleanStateAtPath(inputName, path) }
  }

  @ReactMethod
  fun getNumberStateAtPath(node: Int, inputName: String, path: String, promise: Promise) {
    handleState(node, promise) { view -> view.getNumberStateAtPath(inputName, path) }
  }
}

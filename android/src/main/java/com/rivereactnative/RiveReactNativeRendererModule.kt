package com.rivereactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import app.rive.runtime.kotlin.core.Rive

class RiveReactNativeRendererModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "RiveReactNativeRendererModule"

  @ReactMethod fun defaultRenderer(iosRenderer: String, androidRenderer: String) {
    val rnRendererType = RNRiveRendererType.mapToRNRiveRendererType(androidRenderer);
    val rendererType = RNRiveRendererType.mapToRiveRendererType(rnRendererType);
    Rive.init(reactApplicationContext, defaultRenderer = rendererType)
  }
}

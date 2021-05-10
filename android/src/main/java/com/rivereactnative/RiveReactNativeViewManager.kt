package com.rivereactnative

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class RiveReactNativeViewManager : SimpleViewManager<RiveReactNativeView>() {
  private enum class Commands {
    PLAY,
    PAUSE,
    STOP
  }

  override fun getName() = "RiveReactNativeView"

  override fun getCommandsMap(): Map<String, Int>? {
    return MapBuilder.of(
      "play",
      Commands.PLAY.ordinal,
      "pause",
      Commands.PAUSE.ordinal,
      "stop",
      Commands.STOP.ordinal
    )
  }

  override fun receiveCommand(view: RiveReactNativeView, commandType: Int, args: ReadableArray?) {
    when (commandType) {
      Commands.PLAY.ordinal -> view.play()
      Commands.PAUSE.ordinal -> view.pause()
      Commands.STOP.ordinal -> view.stop()
      else -> {
      }
    }
  }

  override fun createViewInstance(reactContext: ThemedReactContext): RiveReactNativeView {
    return RiveReactNativeView(reactContext)
  }

  @ReactProp(name = "resourceName")
  fun setResourceName(view: RiveReactNativeView, resourceName: String) {
    view.setResourceName(resourceName)
  }

  @ReactProp(name = "fit")
  fun setFit(view: RiveReactNativeView, fit: String) {
    view.setFit(RNFit.mapToRNFit(fit))
  }

  @ReactProp(name = "alignment")
  fun setAlignment(view: RiveReactNativeView, alignment: String) {
    view.setAlignment(RNAlignment.mapToRNAlignment(alignment))
  }
}

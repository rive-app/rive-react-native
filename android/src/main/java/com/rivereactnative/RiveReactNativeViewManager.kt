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
    STOP,
    RESET
  }


  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Map<String, String>>? {
    val builder: MapBuilder.Builder<String, Map<String, String>> = MapBuilder.builder<String, Map<String, String>>()
    for (event in RiveReactNativeView.Events.values()) {
      builder.put(event.toString(), MapBuilder.of("registrationName", event.toString()))
    }
    return builder.build()
  }

  override fun getName() = "RiveReactNativeView"

  override fun getCommandsMap(): Map<String, Int>? {
    return MapBuilder.of(
      "play",
      Commands.PLAY.ordinal,
      "pause",
      Commands.PAUSE.ordinal,
      "stop",
      Commands.STOP.ordinal,
      "reset",
      Commands.RESET.ordinal
    )
  }

  override fun receiveCommand(view: RiveReactNativeView, commandType: Int, args: ReadableArray?) {
    when (commandType) {
      Commands.PLAY.ordinal -> {
        args?.let {
          val animationNames = it.getArray(0)!!
          val loopMode = it.getString(1)!!
          val direction = it.getString(2)!!
          val areStateMachines = it.getBoolean(3)
          view.run {
            val rnLoopMode = RNLoopMode.mapToRNLoopMode(loopMode)
            val rnDirection = RNDirection.mapToRNDirection(direction)
            play((animationNames.toArrayList() as ArrayList<String>).toList(), rnLoopMode, rnDirection, areStateMachines)
          }
        }

      }
      Commands.PAUSE.ordinal -> {
        args?.let {
          val animationNames = it.getArray(0)!!
          val areStateMachines = it.getBoolean(1)
          view.run {
            pause((animationNames.toArrayList() as ArrayList<String>).toList(), areStateMachines)
          }
        }
      }
      Commands.STOP.ordinal -> view.stop()
      Commands.RESET.ordinal -> view.reset()
      else -> {
      }
    }
  }

  override fun createViewInstance(reactContext: ThemedReactContext): RiveReactNativeView {
    return RiveReactNativeView(reactContext)
  }

  override fun onAfterUpdateTransaction(view: RiveReactNativeView) {
    super.onAfterUpdateTransaction(view)
    view.update()
  }

  @ReactProp(name = "resourceName")
  fun setResourceName(view: RiveReactNativeView, resourceName: String?) {
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

  @ReactProp(name = "url")
  fun setUrl(view: RiveReactNativeView, url: String?) {
    view.setUrl(url)
  }

  @ReactProp(name = "autoplay")
  fun setAutoplay(view: RiveReactNativeView, autoplay: Boolean) {
    view.setAutoplay(autoplay)
  }

  @ReactProp(name = "artboardName")
  fun setArtboardName(view: RiveReactNativeView, artboardName: String) {
    view.setArtboardName(artboardName);
  }

  @ReactProp(name = "animationName")
  fun setAnimationName(view: RiveReactNativeView, animationName: String) {
    view.setAnimationName(animationName)
  }

  @ReactProp(name = "stateMachineName")
  fun setStateMachineName(view: RiveReactNativeView, stateMachineName: String) {
    view.setStateMachineName(stateMachineName)
  }
}

package com.rivereactnative

import android.util.Log
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class RiveReactNativeViewManager : SimpleViewManager<RiveReactNativeView>() {
  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Map<String, String>>? {
    val builder: MapBuilder.Builder<String, Map<String, String>> = MapBuilder.builder<String, Map<String, String>>()
    for (event in RiveReactNativeView.Events.values()) {
      builder.put(event.toString(), MapBuilder.of("registrationName", event.toString()))
    }
    return builder.build()
  }

  override fun getName() = "RiveReactNativeView"

  override fun receiveCommand(view: RiveReactNativeView, commandId: String, args: ReadableArray?) {
    when (commandId) {
      // Playback Controls

      "play" -> {
        args?.let {
          val animationName = it.getString(0)
          val loopMode = it.getString(1)
          val direction = it.getString(2)
          val isStateMachine = it.getBoolean(3)
          view.run {
            val rnLoopMode = RNLoopMode.mapToRNLoopMode(loopMode)
            val rnDirection = RNDirection.mapToRNDirection(direction)
            play(animationName, rnLoopMode, rnDirection, isStateMachine)
          }
        }

      }
      "pause" -> view.pause()
      "stop" -> view.stop()
      "reset" -> view.reset()

      // StateMachine inputs

      "fireState" -> {
        args?.let {
          val stateMachineName = it.getString(0)
          val inputName = it.getString(1)
          view.run {
            fireState(stateMachineName, inputName)
          }
        }
      }
      "setBooleanState" -> {
        args?.let {
          val stateMachineName = it.getString(0)
          val inputName = it.getString(1)
          val value = it.getBoolean(2)
          view.run {
            setBooleanState(stateMachineName, inputName, value)
          }
        }
      }
      "setNumberState" -> {
        args?.let {
          val stateMachineName = it.getString(0)
          val inputName = it.getString(1)
          val value = it.getDouble(2)
          view.run {
            setNumberState(stateMachineName, inputName, value.toFloat())
          }
        }
      }
      "fireStateAtPath" -> {
        args?.let {
          val inputName = it.getString(0)
          val path = it.getString(1)
          view.run {
            fireStateAtPath(inputName, path)
          }
        }
      }
      "setBooleanStateAtPath" -> {
        args?.let {
          val inputName = it.getString(0)
          val value = it.getBoolean(1)
          val path = it.getString(2)
          view.run {
            setBooleanStateAtPath(inputName, value, path)
          }
        }
      }
      "setNumberStateAtPath" -> {
        args?.let {
          val inputName = it.getString(0)
          val value = it.getDouble(1)
          val path = it.getString(2)
          view.run {
            setNumberStateAtPath(inputName, value.toFloat(), path)
          }
        }
      }

      // Touch Events

      "touchBegan" -> {
        args?.let {
          val x: Double = it.getDouble(0)
          val y: Double = it.getDouble(1)
          view.run {
            this.touchBegan(x.toFloat(), y.toFloat())
          }
        }
      }
      "touchEnded" -> {
        args?.let {
          val x: Double = it.getDouble(0)
          val y: Double = it.getDouble(1)
          view.run {
            this.touchEnded(x.toFloat(), y.toFloat())
          }
        }
      }

      // Text Run

      "setTextRunValue" -> {
        args?.let {
          val textRunName: String = it.getString(0)
          val textValue: String = it.getString(1)
          view.run {
            this.setTextRunValue(textRunName, textValue)
          }
        }
      }

      // Other

      else -> { }
    }
  }

  override fun createViewInstance(reactContext: ThemedReactContext): RiveReactNativeView {
    return RiveReactNativeView(reactContext)
  }

  override fun onDropViewInstance(view: RiveReactNativeView) {
    view.dispose();
    super.onDropViewInstance(view)
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

  @ReactProp(name = "layoutScaleFactor")
  fun setLayoutScaleFactor(view: RiveReactNativeView, layoutScaleFactor: Double) {
    if (!layoutScaleFactor.isNaN() && layoutScaleFactor > 0) {
        // Only set layoutScaleFactor if it's a valid positive float
        view.setLayoutScaleFactor(layoutScaleFactor.toFloat())
    } else {
        // Handle other cases, e.g., NaN, -1, or other non-float-like values
        view.setLayoutScaleFactor(null)
    }
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
  @ReactProp(name = "isUserHandlingErrors")
  fun setIsUserHandlingErrors(view: RiveReactNativeView, isUserHandlingErrors: Boolean) {
    view.setIsUserHandlingErrors(isUserHandlingErrors)
  }

  @ReactProp(name = "initialAssetsHandled")
  fun setInitialAssetsHandled(view: RiveReactNativeView, initialAssetsHandled: ReadableMap?) {
    val assetMap = mutableMapOf<String, String>()
    if (initialAssetsHandled != null) {
      val iterator = initialAssetsHandled.keySetIterator()
      while (iterator.hasNextKey()) {
        val key = iterator.nextKey()
        val value = initialAssetsHandled.getString(key)
        if (value != null) {
          assetMap[key] = value
        }
      }
      view.setHandledAssets(assetMap)
    }
  }
}

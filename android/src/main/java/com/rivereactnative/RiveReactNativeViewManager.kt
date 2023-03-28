package com.rivereactnative

import android.view.MotionEvent
import android.util.Log
import com.facebook.react.bridge.ReadableArray
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
    Log.d("XYZ", "COMMAND -> $commandId ${view.isAttachedToWindow}")
    when (commandId) {
      // Playback Controls

      "play" -> {
        args?.let {
          val animationName = it.getString(0)!!
          val loopMode = it.getString(1)!!
          val direction = it.getString(2)!!
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
          val stateMachineName = it.getString(0)!!
          val inputName = it.getString(1)!!
          view.run {
            fireState(stateMachineName, inputName)
          }
        }
      }
      "setBooleanState" -> {
        args?.let {
          val stateMachineName = it.getString(0)!!
          val inputName = it.getString(1)!!
          val value = it.getBoolean(2)
          view.run {
            setBooleanState(stateMachineName, inputName, value)
          }
        }
      }
      "setNumberState" -> {
        args?.let {
          val stateMachineName = it.getString(0)!!
          val inputName = it.getString(1)!!
          val value = it.getDouble(2)
          view.run {
            setNumberState(stateMachineName, inputName, value.toFloat())
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

      // Other

      else -> { }
    }
  }

  override fun createViewInstance(reactContext: ThemedReactContext): RiveReactNativeView {
    return RiveReactNativeView(reactContext)
  }

  override fun onAfterUpdateTransaction(view: RiveReactNativeView) {
    super.onAfterUpdateTransaction(view)
    Log.d("XYZ", "Bout to update ${view.isAttachedToWindow}")
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
  @ReactProp(name = "isUserHandlingErrors")
  fun setIsUserHandlingErrors(view: RiveReactNativeView, isUserHandlingErrors: Boolean) {
    view.setIsUserHandlingErrors(isUserHandlingErrors)
  }
}

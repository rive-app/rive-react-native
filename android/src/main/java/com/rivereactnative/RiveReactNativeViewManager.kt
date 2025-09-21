package com.rivereactnative

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class RiveReactNativeViewManager : SimpleViewManager<RiveReactNativeView>() {
  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Map<String, String>>? {
    val builder: MapBuilder.Builder<String, Map<String, String>> =
      MapBuilder.builder<String, Map<String, String>>()
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
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val animationName = it.getString(0)!!
          val loopMode = it.getString(1)!!
          val direction = it.getString(2)!!
          val isStateMachine = it.getBoolean(3)!!
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
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val stateMachineName = it.getString(0)!!
          val inputName = it.getString(1)!!
          view.fireState(stateMachineName, inputName)
        }
      }

      "setBooleanState" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val stateMachineName = it.getString(0)!!
          val inputName = it.getString(1)!!
          val value = it.getBoolean(2)!!
          view.setBooleanState(stateMachineName, inputName, value)
        }
      }

      "setNumberState" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val stateMachineName = it.getString(0)!!
          val inputName = it.getString(1)!!
          val value = it.getDouble(2)!!
          view.setNumberState(stateMachineName, inputName, value.toFloat())
        }
      }

      "fireStateAtPath" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val inputName = it.getString(0)!!
          val path = it.getString(1)!!
          view.fireStateAtPath(inputName, path)
        }
      }

      "setBooleanStateAtPath" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val inputName = it.getString(0)!!
          val value = it.getBoolean(1)!!
          val path = it.getString(2)!!
          view.setBooleanStateAtPath(inputName, value, path)
        }
      }

      "setNumberStateAtPath" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val inputName = it.getString(0)!!
          val value = it.getDouble(1)!!
          val path = it.getString(2)!!
          view.setNumberStateAtPath(inputName, value.toFloat(), path)
        }
      }

      // Data Binding
      "setBooleanPropertyValue" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val path = it.getString(0)!!
          val value = it.getBoolean(1)!!
          view.setBooleanPropertyValue(path, value)
        }
      }

      "setStringPropertyValue" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val path = it.getString(0)!!
          val value = it.getString(1)!!
          view.setStringPropertyValue(path, value)
        }
      }

      "setNumberPropertyValue" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val path = it.getString(0)!!
          val value = it.getDouble(1)!!
          view.setNumberPropertyValue(path, value.toFloat())
        }
      }

      "setColorPropertyValue" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val path = it.getString(0)!!
          val r = it.getDouble(1)!!
          val g = it.getDouble(2)!!
          val b = it.getDouble(3)!!
          val a = it.getDouble(4)!!
          view.setColorPropertyValue(path, r.toInt(), g.toInt(), b.toInt(), a.toInt())
        }
      }

      "setEnumPropertyValue" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val path = it.getString(0)!!
          val value = it.getString(1)!!
          view.setEnumPropertyValue(path, value)
        }
      }

      "fireTriggerProperty" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val path = it.getString(0)!!
          view.fireTriggerProperty(path)!!
        }
      }

      "registerPropertyListener" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val path = it.getString(0)!!
          val propertyType = it.getString(1)!!
          view.registerPropertyListener(path, propertyType)
        }
      }

      // Touch Events

      "touchBegan" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val x: Double = it.getDouble(0)!!
          val y: Double = it.getDouble(1)!!
          view.touchBegan(x.toFloat(), y.toFloat())
        }
      }

      "touchEnded" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val x: Double = it.getDouble(0)!!
          val y: Double = it.getDouble(1)!!
          view.touchEnded(x.toFloat(), y.toFloat())
        }
      }

      // Text Run

      "setTextRunValue" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val textRunName: String = it.getString(0)!!
          val textValue: String = it.getString(1)!!
          view.setTextRunValue(textRunName, textValue)
        }
      }

      "setTextRunValueAtPath" -> {
        args?.let {
          // Don't remove the !! - some versions of Android/Kotlin/Android-Studio may return null
          val textRunName: String = it.getString(0)!!
          val textValue: String = it.getString(1)!!
          val path: String = it.getString(2)!!
          view.setTextRunValueAtPath(textRunName, textValue, path)
        }
      }

      // Other

      else -> {}
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

  @ReactProp(name = "referencedAssets")
  fun setReferencedAssets(view: RiveReactNativeView, source: ReadableMap?) {
    view.setReferencedAssets(source)
  }

  @ReactProp(name = "dataBinding")
  fun setDataBinding(view: RiveReactNativeView, source: ReadableMap?) {
    view.setDataBinding(source)
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

package com.rivereactnative

import android.util.Log
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class RiveReactNativeViewManager : SimpleViewManager<RiveReactNativeView>() {
  private val TAG = "RiveReactNativeViewManager"
  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Map<String, String>>? {
    val builder: MapBuilder.Builder<String, Map<String, String>> =
      MapBuilder.builder<String, Map<String, String>>()
    for (event in RiveReactNativeView.Events.values()) {
      builder.put(event.toString(), MapBuilder.of("registrationName", event.toString()))
    }
    return builder.build().toMutableMap()
  }

  override fun getName() = "RiveReactNativeView"

  override fun receiveCommand(view: RiveReactNativeView, commandId: String, args: ReadableArray?) {
    when (commandId) {
      // Playback Controls

      "play" -> {
        args?.let {
          try {
            val animationName = it.getString(0) ?: ""
            val loopMode = it.getString(1) ?: "loop"
            val direction = it.getString(2) ?: "forwards"
            val isStateMachine = it.getBoolean(3)
            view.run {
              val rnLoopMode = RNLoopMode.mapToRNLoopMode(loopMode)
              val rnDirection = RNDirection.mapToRNDirection(direction)
              play(animationName, rnLoopMode, rnDirection, isStateMachine)
            }
          } catch (e: Exception) {
            Log.e(TAG, "Error in play command: ${e.message}")
          }
        }

      }

      "pause" -> view.pause()
      "stop" -> view.stop()
      "reset" -> view.reset()

      // StateMachine inputs

      "fireState" -> {
        args?.let {
          try {
            val stateMachineName = it.getString(0) ?: ""
            val inputName = it.getString(1) ?: ""
            if (stateMachineName.isEmpty() || inputName.isEmpty()) {
              Log.e(TAG, "fireState: stateMachineName or inputName is empty")
              return@let
            }
            view.fireState(stateMachineName, inputName)
          } catch (e: Exception) {
            Log.e(TAG, "Error in fireState command: ${e.message}")
          }
        }
      }

      "setBooleanState" -> {
        args?.let {
          try {
            val stateMachineName = it.getString(0) ?: ""
            val inputName = it.getString(1) ?: ""
            if (stateMachineName.isEmpty() || inputName.isEmpty()) {
              Log.e(TAG, "setBooleanState: stateMachineName or inputName is empty")
              return@let
            }
            val value = it.getBoolean(2)
            view.setBooleanState(stateMachineName, inputName, value)
          } catch (e: Exception) {
            Log.e(TAG, "Error in setBooleanState command: ${e.message}")
          }
        }
      }

      "setNumberState" -> {
        args?.let {
          try {
            val stateMachineName = it.getString(0) ?: ""
            val inputName = it.getString(1) ?: ""
            if (stateMachineName.isEmpty() || inputName.isEmpty()) {
              Log.e(TAG, "setNumberState: stateMachineName or inputName is empty")
              return@let
            }
            val value = it.getDouble(2)
            view.setNumberState(stateMachineName, inputName, value.toFloat())
          } catch (e: Exception) {
            Log.e(TAG, "Error in setNumberState command: ${e.message}")
          }
        }
      }

      "fireStateAtPath" -> {
        args?.let {
          try {
            val inputName = it.getString(0) ?: ""
            val path = it.getString(1) ?: ""
            if (inputName.isEmpty() || path.isEmpty()) {
              Log.e(TAG, "fireStateAtPath: inputName or path is empty")
              return@let
            }
            view.fireStateAtPath(inputName, path)
          } catch (e: Exception) {
            Log.e(TAG, "Error in fireStateAtPath command: ${e.message}")
          }
        }
      }

      "setBooleanStateAtPath" -> {
        args?.let {
          try {
            val inputName = it.getString(0) ?: ""
            val path = it.getString(2) ?: ""
            if (inputName.isEmpty() || path.isEmpty()) {
              Log.e(TAG, "setBooleanStateAtPath: inputName or path is empty")
              return@let
            }
            val value = it.getBoolean(1)
            view.setBooleanStateAtPath(inputName, value, path)
          } catch (e: Exception) {
            Log.e(TAG, "Error in setBooleanStateAtPath command: ${e.message}")
          }
        }
      }

      "setNumberStateAtPath" -> {
        args?.let {
          try {
            val inputName = it.getString(0) ?: ""
            val path = it.getString(2) ?: ""
            if (inputName.isEmpty() || path.isEmpty()) {
              Log.e(TAG, "setNumberStateAtPath: inputName or path is empty")
              return@let
            }
            val value = it.getDouble(1)
            view.setNumberStateAtPath(inputName, value.toFloat(), path)
          } catch (e: Exception) {
            Log.e(TAG, "Error in setNumberStateAtPath command: ${e.message}")
          }
        }
      }

      // Data Binding
      "setBooleanPropertyValue" -> {
        args?.let {
          try {
            val path = it.getString(0) ?: ""
            if (path.isEmpty()) {
              Log.e(TAG, "setBooleanPropertyValue: path is empty")
              return@let
            }
            val value = it.getBoolean(1)
            view.setBooleanPropertyValue(path, value)
          } catch (e: Exception) {
            Log.e(TAG, "Error in setBooleanPropertyValue command: ${e.message}")
          }
        }
      }

      "setStringPropertyValue" -> {
        args?.let {
          try {
            val path = it.getString(0) ?: ""
            val value = it.getString(1) ?: ""
            if (path.isEmpty()) {
              Log.e(TAG, "setStringPropertyValue: path is empty")
              return@let
            }
            view.setStringPropertyValue(path, value)
          } catch (e: Exception) {
            Log.e(TAG, "Error in setStringPropertyValue command: ${e.message}")
          }
        }
      }

      "setNumberPropertyValue" -> {
        args?.let {
          try {
            val path = it.getString(0) ?: ""
            if (path.isEmpty()) {
              Log.e(TAG, "setNumberPropertyValue: path is empty")
              return@let
            }
            val value = it.getDouble(1)
            view.setNumberPropertyValue(path, value.toFloat())
          } catch (e: Exception) {
            Log.e(TAG, "Error in setNumberPropertyValue command: ${e.message}")
          }
        }
      }

      "setColorPropertyValue" -> {
        args?.let {
          try {
            val path = it.getString(0) ?: ""
            if (path.isEmpty()) {
              Log.e(TAG, "setColorPropertyValue: path is empty")
              return@let
            }
            val r = it.getDouble(1)
            val g = it.getDouble(2)
            val b = it.getDouble(3)
            val a = it.getDouble(4)
            view.setColorPropertyValue(path, r.toInt(), g.toInt(), b.toInt(), a.toInt())
          } catch (e: Exception) {
            Log.e(TAG, "Error in setColorPropertyValue command: ${e.message}")
          }
        }
      }

      "setEnumPropertyValue" -> {
        args?.let {
          try {
            val path = it.getString(0) ?: ""
            val value = it.getString(1) ?: ""
            if (path.isEmpty()) {
              Log.e(TAG, "setEnumPropertyValue: path is empty")
              return@let
            }
            view.setEnumPropertyValue(path, value)
          } catch (e: Exception) {
            Log.e(TAG, "Error in setEnumPropertyValue command: ${e.message}")
          }
        }
      }

      "fireTriggerProperty" -> {
        args?.let {
          try {
            val path = it.getString(0) ?: ""
            if (path.isEmpty()) {
              Log.e(TAG, "fireTriggerProperty: path is empty")
              return@let
            }
            view.fireTriggerProperty(path) // Remove the !! as this method returns Unit (void)
          } catch (e: Exception) {
            Log.e(TAG, "Error in fireTriggerProperty command: ${e.message}")
          }
        }
      }

      "registerPropertyListener" -> {
        args?.let {
          try {
            val path = it.getString(0) ?: ""
            val propertyType = it.getString(1) ?: ""
            if (path.isEmpty() || propertyType.isEmpty()) {
              Log.e(TAG, "registerPropertyListener: path or propertyType is empty")
              return@let
            }
            view.registerPropertyListener(path, propertyType)
          } catch (e: Exception) {
            Log.e(TAG, "Error in registerPropertyListener command: ${e.message}")
          }
        }
      }

      // Touch Events

      "touchBegan" -> {
        args?.let {
          try {
            val x = it.getDouble(0)
            val y = it.getDouble(1)
            view.touchBegan(x.toFloat(), y.toFloat())
          } catch (e: Exception) {
            Log.e(TAG, "Error in touchBegan command: ${e.message}")
          }
        }
      }

      "touchEnded" -> {
        args?.let {
          try {
            val x = it.getDouble(0)
            val y = it.getDouble(1)
            view.touchEnded(x.toFloat(), y.toFloat())
          } catch (e: Exception) {
            Log.e(TAG, "Error in touchEnded command: ${e.message}")
          }
        }
      }

      // Text Run

      "setTextRunValue" -> {
        args?.let {
          try {
            val textRunName = it.getString(0) ?: ""
            val textValue = it.getString(1) ?: ""
            if (textRunName.isEmpty()) {
              Log.e(TAG, "setTextRunValue: textRunName is empty")
              return@let
            }
            view.setTextRunValue(textRunName, textValue)
          } catch (e: Exception) {
            Log.e(TAG, "Error in setTextRunValue command: ${e.message}")
          }
        }
      }

      "setTextRunValueAtPath" -> {
        args?.let {
          try {
            val textRunName = it.getString(0) ?: ""
            val textValue = it.getString(1) ?: ""
            val path = it.getString(2) ?: ""
            if (textRunName.isEmpty() || path.isEmpty()) {
              Log.e(TAG, "setTextRunValueAtPath: textRunName or path is empty")
              return@let
            }
            view.setTextRunValueAtPath(textRunName, textValue, path)
          } catch (e: Exception) {
            Log.e(TAG, "Error in setTextRunValueAtPath command: ${e.message}")
          }
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

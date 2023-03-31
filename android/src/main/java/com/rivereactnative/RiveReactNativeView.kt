package com.rivereactnative

import android.widget.FrameLayout
import android.util.Log
import app.rive.runtime.kotlin.PointerEvents
import app.rive.runtime.kotlin.RiveAnimationView
import app.rive.runtime.kotlin.RiveArtboardRenderer
import app.rive.runtime.kotlin.core.*
import app.rive.runtime.kotlin.core.errors.*
import com.android.volley.NetworkResponse
import com.android.volley.ParseError
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.HttpHeaderParser
import com.android.volley.toolbox.Volley
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.modules.core.ExceptionsManagerModule
import com.facebook.react.uimanager.ThemedReactContext
import java.io.UnsupportedEncodingException
import kotlin.IllegalStateException


class RiveReactNativeView(private val context: ThemedReactContext) : FrameLayout(context) {
  private var riveAnimationView: RiveAnimationView = RiveAnimationView(context)
  private var resId: Int = -1
  private var url: String? = null
  private var animationName: String? = null
  private var stateMachineName: String? = null
  private var artboardName: String? = null
  private var fit: Fit = Fit.CONTAIN
  private var alignment: Alignment = Alignment.CENTER
  private var autoplay: Boolean = false;
  private var shouldBeReloaded = true
  private var exceptionManager: ExceptionsManagerModule? = null
  private var isUserHandlingErrors = false

  enum class Events(private val mName: String) {
    PLAY("onPlay"),
    PAUSE("onPause"),
    STOP("onStop"),
    LOOP_END("onLoopEnd"),
    STATE_CHANGED("onStateChanged"),
    ERROR("onError");

    override fun toString(): String {
      return mName
    }
  }

  init {
    val listener = object : RiveArtboardRenderer.Listener {
      override fun notifyLoop(animation: PlayableInstance) {
        if (animation is LinearAnimationInstance) {
          onLoopEnd(animation.name, RNLoopMode.mapToRNLoopMode(animation.loop))
        } else {
          throw IllegalArgumentException("Only animation can be passed as an argument")
        }
      }

      override fun notifyPause(animation: PlayableInstance) {
        if (animation is LinearAnimationInstance) {
          onPause(animation.name)
        }
        if (animation is StateMachineInstance) {
          onPause(animation.name, true)
        }
      }

      override fun notifyPlay(animation: PlayableInstance) {
        if (animation is LinearAnimationInstance) {
          onPlay(animation.name)
        }
        if (animation is StateMachineInstance) {
          onPlay(animation.name, true)
        }
      }

      override fun notifyStateChanged(stateMachineName: String, stateName: String) {
        onStateChanged(stateMachineName, stateName)
      }

      override fun notifyStop(animation: PlayableInstance) {
        if (animation is LinearAnimationInstance) {
          onStop(animation.name)
        }
        if (animation is StateMachineInstance) {
          onStop(animation.name, true)
        }
      }

    }
    riveAnimationView.registerListener(listener)
    riveAnimationView.autoplay = false
    autoplay = false
    addView(riveAnimationView)
  }

  fun onPlay(animationName: String, isStateMachine: Boolean = false) {
    val reactContext = context as ReactContext

    val data = Arguments.createMap()
    data.putString("animationName", animationName)
    data.putBoolean("isStateMachine", isStateMachine)

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.PLAY.toString(), data)
  }

  fun onPause(animationName: String, isStateMachine: Boolean = false) {
    val reactContext = context as ReactContext

    val data = Arguments.createMap()
    data.putString("animationName", animationName)
    data.putBoolean("isStateMachine", isStateMachine)

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.PAUSE.toString(), data)
  }

  fun onStop(animationName: String, isStateMachine: Boolean = false) {
    val reactContext = context as ReactContext

    val data = Arguments.createMap()
    data.putString("animationName", animationName)
    data.putBoolean("isStateMachine", isStateMachine)

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.STOP.toString(), data)
  }

  fun onLoopEnd(animationName: String, loopMode: RNLoopMode) {
    val reactContext = context as ReactContext

    val data = Arguments.createMap()
    data.putString("animationName", animationName)
    data.putString("loopMode", loopMode.toString())

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.LOOP_END.toString(), data)
  }

  fun onStateChanged(stateMachineName: String, stateName: String) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    data.putString("stateMachineName", stateMachineName)
    data.putString("stateName", stateName)

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.STATE_CHANGED.toString(), data)
  }

  fun play(animationName: String, rnLoopMode: RNLoopMode, rnDirection: RNDirection, isStateMachine: Boolean) {
    val loop = RNLoopMode.mapToRiveLoop(rnLoopMode)
    val direction = RNDirection.mapToRiveDirection(rnDirection)
    if (animationName.isEmpty()) {
      riveAnimationView.play(loop, direction) // intentionally we skipped areStateMachines argument to keep same behaviour as it is in the native sdk
    } else {
      try {
        riveAnimationView.play(animationName, loop, direction, isStateMachine)
      } catch (ex: RiveException) {
        handleRiveException(ex)
      }
    }
  }

  fun pause() {
    try {
      riveAnimationView.pause()
    } catch (ex: RiveException) {
      handleRiveException(ex)
    }
  }

  fun stop() {
    try {
      riveAnimationView.stop()
    } catch (ex: RiveException) {
      handleRiveException(ex)
    }
  }

  fun reset() {
    url?.let {
      if (resId == -1) {
        riveAnimationView.artboardRenderer?.reset()
      }
    } ?: run {
      if (resId != -1) {
        riveAnimationView.reset()
      }
    }
  }

  fun touchBegan(x: Float, y: Float) {
    riveAnimationView.artboardRenderer?.pointerEvent(PointerEvents.POINTER_DOWN, x, y)
  }

  fun touchEnded(x: Float, y: Float) {
    riveAnimationView.artboardRenderer?.pointerEvent(PointerEvents.POINTER_UP, x, y)
  }

  fun update() {
    reloadIfNeeded()
  }

  fun setResourceName(resourceName: String?) {
    resourceName?.let {
      resId = resources.getIdentifier(resourceName, "raw", context.packageName)
      if (resId == 0) {
        resId = -1
      }
    } ?: run {
      resId = -1
    }

    shouldBeReloaded = true
  }

  fun setFit(rnFit: RNFit) {
    val riveFit = RNFit.mapToRiveFit(rnFit)
    this.fit = riveFit
    riveAnimationView.fit = riveFit
  }

  fun setAlignment(rnAlignment: RNAlignment) {
    val riveAlignment = RNAlignment.mapToRiveAlignment(rnAlignment)
    this.alignment = riveAlignment
    riveAnimationView.alignment = riveAlignment
  }

  fun setAutoplay(autoplay: Boolean) {
    this.autoplay = autoplay
    shouldBeReloaded = true
  }

  fun setUrl(url: String?) {
    this.url = url
    shouldBeReloaded = true
  }


  private fun resetRiveResource() {
    url?.let {
      if (resId == -1) {
        setUrlRiveResource(it, false)
      } else {
        throw IllegalStateException("You cannot pass both resourceName and url at the same time")
      }
    } ?: run {
      if (resId != -1) {
        try {
          riveAnimationView.setRiveResource(
            resId,
            fit = this.fit,
            alignment = this.alignment,
            autoplay = autoplay,
            stateMachineName = this.stateMachineName,
            animationName = this.animationName,
            artboardName = this.artboardName
          )
          url = null
        } catch (ex: RiveException) {
          handleRiveException(ex)
        }
      } else {
        handleFileNotFound()
      }
    }
  }

  private fun reloadIfNeeded() {
    if (shouldBeReloaded) {
      url?.let {
        if (resId == -1) {
          setUrlRiveResource(it)
        } else {
          throw IllegalStateException("You cannot pass both resourceName and url at the same time")
        }
      } ?: run {
        if (resId != -1) {
          try {
            riveAnimationView.setRiveResource(
              resId,
              fit = this.fit,
              alignment = this.alignment,
              autoplay = this.autoplay,
              stateMachineName = this.stateMachineName,
              animationName = this.animationName,
              artboardName = this.artboardName
            )
            url = null
          } catch (ex: RiveException) {
            handleRiveException(ex)
          }

        } else {
          handleFileNotFound()
        }
      }
      shouldBeReloaded = false
    }
  }


  private fun setUrlRiveResource(url: String, autoplay: Boolean = this.autoplay) {
    val queue = Volley.newRequestQueue(context)
    val stringRequest = RNRiveFileRequest(url, { bytes ->
      try {
        riveAnimationView.setRiveBytes(
          bytes,
          fit = this.fit,
          alignment = this.alignment,
          autoplay = autoplay,
          stateMachineName = this.stateMachineName,
          animationName = this.animationName,
          artboardName = this.artboardName
        )
      } catch (ex: RiveException) {
        handleRiveException(ex)
      }
    }, {
      if (isUserHandlingErrors) {
        val rnRiveError = RNRiveError.IncorrectRiveFileUrl
        rnRiveError.message = "Unable to download Rive file from: $url"
        sendErrorToRN(rnRiveError)
      } else {
        showRNRiveError("Unable to download Rive file $url", it)
      }

    })
    queue.add(stringRequest)
  }

  fun setArtboardName(artboardName: String) {
    try {
      this.artboardName = artboardName
      riveAnimationView.artboardName = artboardName // it causes reloading
    } catch (ex: RiveException) {
      handleRiveException(ex)
    }
  }

  fun setAnimationName(animationName: String) {
    this.animationName = animationName
    riveAnimationView.artboardRenderer?.animationName = animationName
    shouldBeReloaded = true
  }

  fun setStateMachineName(stateMachineName: String) {
    try {
      this.stateMachineName = stateMachineName
      riveAnimationView.artboardRenderer?.stateMachineName = stateMachineName
      shouldBeReloaded = true
    } catch (ex: RiveException) {
      handleRiveException(ex)
    }
  }

  fun setIsUserHandlingErrors(isUserHandlingErrors: Boolean) {
    this.isUserHandlingErrors = isUserHandlingErrors
  }

  fun fireState(stateMachineName: String, inputName: String) {
    try {
      riveAnimationView.fireState(stateMachineName, inputName)
    } catch (ex: RiveException) {
      handleRiveException(ex);
    }
  }

  fun setBooleanState(stateMachineName: String, inputName: String, value: Boolean) {
    try {
      riveAnimationView.setBooleanState(stateMachineName, inputName, value)
    } catch (ex: RiveException) {
      handleRiveException(ex)
    }
  }

  fun setNumberState(stateMachineName: String, inputName: String, value: Float) {
    try {
      riveAnimationView.setNumberState(stateMachineName, inputName, value)
    } catch (ex: RiveException) {
      handleRiveException(ex)
    }
  }

  private fun handleRiveException(exception: RiveException) {
    if (isUserHandlingErrors) {
      val rnRiveError = RNRiveError.mapToRNRiveError(exception)
      rnRiveError?.let {
        sendErrorToRN(rnRiveError)
      }
    } else {
      showRNRiveError("${exception.message}", exception)
    }
  }

  private fun handleFileNotFound() {
    if (isUserHandlingErrors) {
      val rnRiveError = RNRiveError.FileNotFound
      rnRiveError.message = "File resource not found. You must provide correct url or resourceName!"
      sendErrorToRN(rnRiveError)
    } else {
      throw IllegalStateException("File resource not found. You must provide correct url or resourceName!")
    }
  }

  private fun sendErrorToRN(error: RNRiveError) {
    val reactContext = context as ReactContext
    val data = Arguments.createMap()
    data.putString("type", error.toString())
    data.putString("message", error.message)
    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.ERROR.toString(), data)
  }

  private fun showRNRiveError(message: String, error: Throwable) {
    val errorMap = Arguments.createMap()
    errorMap.putString("message", message)
    errorMap.putArray("stack", createStackTraceForRN(error.stackTrace))
    exceptionManager?.reportException(errorMap)
  }

  private fun createStackTraceForRN(stackTrace: Array<StackTraceElement>): ReadableArray {
    val stackTraceReadableArray = Arguments.createArray()
    for (stackTraceElement in stackTrace) {
      val stackTraceElementMap = Arguments.createMap()
      stackTraceElementMap.putString("methodName", stackTraceElement.methodName)
      stackTraceElementMap.putInt("lineNumber", stackTraceElement.lineNumber)
      stackTraceElementMap.putString("file", stackTraceElement.fileName)

      stackTraceReadableArray.pushMap(stackTraceElementMap)
    }
    return stackTraceReadableArray
  }
}

class RNRiveFileRequest(
  url: String,
  private val listener: Response.Listener<ByteArray>,
  errorListener: Response.ErrorListener
) : Request<ByteArray>(Method.GET, url, errorListener) {

  override fun deliverResponse(response: ByteArray) = listener.onResponse(response)

  override fun parseNetworkResponse(response: NetworkResponse?): Response<ByteArray> {
    return try {
      val bytes = response?.data ?: ByteArray(0)
      Response.success(bytes, HttpHeaderParser.parseCacheHeaders(response))
    } catch (e: UnsupportedEncodingException) {
      Response.error(ParseError(e))
    }
  }
}


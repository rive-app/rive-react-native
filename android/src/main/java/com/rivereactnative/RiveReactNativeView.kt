package com.rivereactnative

import android.widget.FrameLayout
import androidx.lifecycle.*
import app.rive.runtime.kotlin.RiveAnimationView
import app.rive.runtime.kotlin.RiveDrawable
import app.rive.runtime.kotlin.core.*
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.util.RNLog
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.IOException
import java.net.URL
import kotlin.IllegalStateException

class RiveReactNativeView(private val context: ThemedReactContext) : FrameLayout(context), LifecycleEventListener {
  private var riveAnimationView: RiveAnimationView
  private var resId: Int = -1
  private var url: String? = null
  private var shouldBeReloaded = true

  enum class Events(private val mName: String) {
    PLAY("onPlay"),
    PAUSE("onPause"),
    STOP("onStop"),
    LOOP_END("onLoopEnd"),
    STATE_CHANGED("onStateChanged");

    override fun toString(): String {
      return mName
    }
  }

  init {
    context.addLifecycleEventListener(this)
    riveAnimationView = RiveAnimationView(context)
    val listener = object : RiveDrawable.Listener {
      override fun notifyLoop(animation: PlayableInstance) {
        if (animation is LinearAnimationInstance) {
          onLoopEnd(animation.animation.name, RNLoopMode.mapToRNLoopMode(animation.loop))
        } else {
          throw IllegalArgumentException("Only animation can be passed as an argument")
        }
      }

      override fun notifyPause(animation: PlayableInstance) {
        if (animation is LinearAnimationInstance) {
          onPause(animation.animation.name)
        }
        if (animation is StateMachineInstance) {
          onPause(animation.stateMachine.name, true)
        }
      }

      override fun notifyPlay(animation: PlayableInstance) {
        if (animation is LinearAnimationInstance) {
          onPlay(animation.animation.name)
        }
        if (animation is StateMachineInstance) {
          onPlay(animation.stateMachine.name, true)
        }
      }

      override fun notifyStateChanged(stateMachineName: String, stateName: String) {
        onStateChanged(stateMachineName, stateName)
      }


      override fun notifyStop(animation: PlayableInstance) {
        if (animation is LinearAnimationInstance) {
          onStop(animation.animation.name)
        }
        if (animation is StateMachineInstance) {
          onStop(animation.stateMachine.name, true)
        }
      }

    }
    riveAnimationView.registerListener(listener)
    riveAnimationView.autoplay = false
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

  fun play(animationNames: List<String>, rnLoopMode: RNLoopMode, rnDirection: RNDirection, areStateMachines: Boolean) {
    val loop = RNLoopMode.mapToRiveLoop(rnLoopMode)
    val direction = RNDirection.mapToRiveDirection(rnDirection)
    if (animationNames.isEmpty()) {
      riveAnimationView.play(loop, direction) // intentionally we skipped areStateMachines argument to keep same behaviour as it is in the native sdk
    } else {
      riveAnimationView.play(animationNames, loop, direction, areStateMachines)
    }

  }

  fun pause(animationNames: List<String>, areStateMachines: Boolean) {
    if (animationNames.isEmpty()) {
      riveAnimationView.pause() // intentionally we skipped areStateMachines argument to keep same behaviour as it is in the native sdk
    } else {
      riveAnimationView.pause(animationNames, areStateMachines)
    }
  }

  fun stop(animationNames: List<String>, areStateMachines: Boolean) {
    if (animationNames.isEmpty()) {
      resetRiveResource()
    } else {
      riveAnimationView.stop(animationNames, areStateMachines)
    }
  }

  fun reset() {
    url?.let {
      if (resId == -1) {
        riveAnimationView.drawable.reset()
      }
    } ?: run {
      if (resId != -1) {
        riveAnimationView.reset()
      }
    }
  }

  fun update() {
    reloadIfNeeded()
  }

  fun setResourceName(resourceName: String?) {
    resourceName?.let {
      resId = resources.getIdentifier(resourceName, "raw", context.packageName)
      if (resId == 0) {
        RNLog.w(context as ReactContext, "Failed to locate .riv file: $resourceName")
        resId = -1
      }
    } ?: run {
      resId = -1
    }

    shouldBeReloaded = true
  }

  fun setFit(rnFit: RNFit) {
    val riveFit = RNFit.mapToRiveFit(rnFit)
    riveAnimationView.fit = riveFit
    riveAnimationView.drawable.invalidateSelf() // TODO: probably it should be a responsibility of rive-android itself
  }

  fun setAlignment(rnAlignment: RNAlignment) {
    val riveAlignment = RNAlignment.mapToRiveAlignment(rnAlignment)
    riveAnimationView.alignment = riveAlignment
    riveAnimationView.drawable.invalidateSelf() // TODO: probably it should be a responsibility of rive-android itself
  }

  fun setAutoplay(autoplay: Boolean) {
    riveAnimationView.autoplay = autoplay
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
        riveAnimationView.setRiveResource(
          resId,
          fit = riveAnimationView.fit,
          alignment = riveAnimationView.alignment,
          autoplay = false,
          stateMachineName = riveAnimationView.drawable.stateMachineName,
          animationName = riveAnimationView.drawable.animationName,
          artboardName = riveAnimationView.artboardName
        )
      } else {
        throw IllegalStateException("File resource not found. You must provide correct url or resourceName!")
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
          riveAnimationView.setRiveResource(
            resId,
            fit = riveAnimationView.fit,
            alignment = riveAnimationView.alignment,
            autoplay = riveAnimationView.autoplay,
            stateMachineName = riveAnimationView.drawable.stateMachineName,
            animationName = riveAnimationView.drawable.animationName,
            artboardName = riveAnimationView.artboardName
          )
          url = null
        } else {
          throw IllegalStateException("File resource not found. You must provide correct url or resourceName!")
        }
      }
      shouldBeReloaded = false
    }
  }

  private fun setUrlRiveResource(url: String, autoplay: Boolean = riveAnimationView.autoplay) {
    val httpClient = HttpClient()
    httpClient.byteLiveData.observe(context.currentActivity as LifecycleOwner, // needs a fix
      Observer { bytes ->
        // Pass the Rive file bytes to the animation view
        riveAnimationView.setRiveBytes(
          bytes,
          fit = riveAnimationView.fit,
          alignment = riveAnimationView.alignment,
          autoplay = autoplay,
          stateMachineName = riveAnimationView.drawable.stateMachineName,
          animationName = riveAnimationView.drawable.animationName,
          artboardName = riveAnimationView.artboardName
        )
      }
    )
    httpClient.fetchUrl(url, context)
  }

  fun setArtboardName(artboardName: String) {
    riveAnimationView.artboardName = artboardName // it causes reloading
    riveAnimationView.drawable.invalidateSelf()
  }

  fun setAnimationName(animationName: String) {
    riveAnimationView.drawable.animationName = animationName
    shouldBeReloaded = true
  }

  fun setStateMachineName(stateMachineName: String) {
    riveAnimationView.drawable.stateMachineName = stateMachineName
    shouldBeReloaded = true
  }

  fun fireState(stateMachineName: String, inputName: String) {
    riveAnimationView.fireState(stateMachineName, inputName)
  }

  fun setBooleanState(stateMachineName: String, inputName: String, value: Boolean) {
    riveAnimationView.setBooleanState(stateMachineName, inputName, value)
  }

  fun setNumberState(stateMachineName: String, inputName: String, value: Float) {
    riveAnimationView.setNumberState(stateMachineName, inputName, value)
  }

  override fun onHostResume() {
  }

  override fun onHostPause() {
  }

  override fun onHostDestroy() {
    riveAnimationView.destroy()
  }
}

class HttpClient : ViewModel() {
  var byteLiveData = MutableLiveData<ByteArray>()

  fun fetchUrl(url: String, reactContext: ReactContext) {
    viewModelScope.launch {
      withContext(Dispatchers.IO) {
        fetchAsync(url, reactContext)
      }
    }
  }

  private fun fetchAsync(url: String, reactContext: ReactContext) {
    try {
      byteLiveData.postValue(URL(url).openStream().use { it.readBytes() })
    } catch (e: IOException) {
      RNLog.w(reactContext, "Failed to load .riv file from the $url")
    }
  }
}


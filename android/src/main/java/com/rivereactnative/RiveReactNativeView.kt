package com.rivereactnative

import android.widget.FrameLayout
import androidx.lifecycle.*
import app.rive.runtime.kotlin.RiveAnimationView
import app.rive.runtime.kotlin.RiveDrawable
import app.rive.runtime.kotlin.core.LayerState
import app.rive.runtime.kotlin.core.LinearAnimationInstance
import app.rive.runtime.kotlin.core.PlayableInstance
import app.rive.runtime.kotlin.core.StateMachineInstance
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.ThemedReactContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.lang.IllegalStateException
import java.net.URL

class RiveReactNativeView(private val context: ThemedReactContext) : FrameLayout(context), LifecycleEventListener {
  private var riveAnimationView: RiveAnimationView
  private var resId: Int = -1
  private var url: String? = null
  private val httpClient = ViewModelProvider(context.currentActivity as ViewModelStoreOwner).get(HttpClient::class.java)
  private var shouldBeReloaded = true

  enum class Events(private val mName: String) {
    PLAY("onPlay"),
    PAUSE("onPause"),
    STOP("onStop"),
    LOOP_END("onLoopEnd");

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
          onLoopEnd(animation.animation.name)
        }
        if (animation is StateMachineInstance) {
          onLoopEnd(animation.stateMachine.name, true)
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

      override fun notifyStateChanged(state: LayerState) {
        //TODO("Not yet implemented")
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

  fun onLoopEnd(animationName: String, isStateMachine: Boolean = false) {
    val reactContext = context as ReactContext

    val data = Arguments.createMap()
    data.putString("animationName", animationName)
    data.putBoolean("isStateMachine", isStateMachine)

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, Events.LOOP_END.toString(), data)
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

  fun stop() {
    shouldBeReloaded = true
    reloadIfNeeded()
  }

  fun update() {
    reloadIfNeeded()
  }

  fun setResourceName(resourceName: String?) {
    resourceName?.let {
      resId = resources.getIdentifier(resourceName, "raw", context.packageName)
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

  private fun reloadIfNeeded() {
    if (shouldBeReloaded) {
      url?.let {
        if (resId == -1) {
          setUrlRiveResource(it)
        }
      } ?: run {
        if (resId != -1) {
          riveAnimationView.setRiveResource(resId, fit = riveAnimationView.fit, alignment = riveAnimationView.alignment, autoplay = riveAnimationView.autoplay)
          url = null
        } else {
          throw IllegalStateException("You must provide a url or a resourceName!")
        }
      }
      shouldBeReloaded = false
    }
  }

  private fun setUrlRiveResource(url: String) {
    httpClient.byteLiveData.observe(context.currentActivity as LifecycleOwner, // needs a fix
      Observer { bytes ->
        // Pass the Rive file bytes to the animation view
        riveAnimationView.setRiveBytes(
          bytes,
          fit = riveAnimationView.fit,
          alignment = riveAnimationView.alignment,
          autoplay = riveAnimationView.autoplay
        )
      }
    )
    httpClient.fetchUrl(url)
  }

  fun setArtboardName(artboardName: String) {
    riveAnimationView.artboardName = artboardName // it causes reloading
  }

  fun setAnimationName(animationName: String) {
    riveAnimationView.drawable.animationName = animationName
    shouldBeReloaded = true
  }

  fun setStateMachineName(stateMachineName: String) {
    riveAnimationView.drawable.stateMachineName = stateMachineName
    shouldBeReloaded = true
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

  fun fetchUrl(url: String) {
    viewModelScope.launch {
      withContext(Dispatchers.IO) {
        fetchAsync(url)
      }
    }
  }

  private fun fetchAsync(url: String) {
    byteLiveData.postValue(URL(url).openStream().use { it.readBytes() })
  }
}


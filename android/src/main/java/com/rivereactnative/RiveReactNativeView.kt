package com.rivereactnative

import android.widget.FrameLayout
import app.rive.runtime.kotlin.RiveAnimationView
import app.rive.runtime.kotlin.RiveDrawable
import app.rive.runtime.kotlin.core.LayerState
import app.rive.runtime.kotlin.core.LinearAnimationInstance
import app.rive.runtime.kotlin.core.PlayableInstance
import app.rive.runtime.kotlin.core.StateMachineInstance
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter

class RiveReactNativeView(private val context: ThemedReactContext) : FrameLayout(context), LifecycleEventListener {

  enum class Events(private val mName: String) {
    PLAY("onPlay"),
    PAUSE("onPause");

    override fun toString(): String {
      return mName
    }
  }

  private var riveAnimationView: RiveAnimationView

  init {
    context.addLifecycleEventListener(this)
    riveAnimationView = RiveAnimationView(context)
    val listener = object : RiveDrawable.Listener {
      override fun notifyLoop(animation: PlayableInstance) {
        //TODO("Not yet implemented")
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
        //TODO("Not yet implemented")
      }

    }
    riveAnimationView.registerListener(listener)
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

  fun play() {
    riveAnimationView.play()
  }

  fun pause() {
    riveAnimationView.pause()
  }

  fun stop() {
    riveAnimationView.reset()
    riveAnimationView.stop()
  }

  fun setResourceName(resourceName: String) {
    val (propsFit, propsAlignment) = Pair(riveAnimationView.fit, riveAnimationView.alignment)
    val resId = resources.getIdentifier(resourceName, "raw", context.packageName)

    riveAnimationView.setRiveResource(resId, fit = propsFit, alignment = propsAlignment)
  }

  fun setFit(rnFit: RNFit) {
    val riveFit = RNFit.mapToRiveFit(rnFit)
    riveAnimationView.fit = riveFit
  }

  fun setAlignment(rnAlignment: RNAlignment) {
    val riveAlignment = RNAlignment.mapToRiveAlignment(rnAlignment)
    riveAnimationView.alignment = riveAlignment
  }

  override fun onHostResume() {
  }

  override fun onHostPause() {
  }

  override fun onHostDestroy() {
    riveAnimationView.destroy()
  }
}


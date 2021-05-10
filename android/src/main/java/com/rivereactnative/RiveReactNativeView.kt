package com.rivereactnative

import android.widget.FrameLayout
import app.rive.runtime.kotlin.RiveAnimationView
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.uimanager.ThemedReactContext

class RiveReactNativeView(private val context: ThemedReactContext) : FrameLayout(context), LifecycleEventListener {
  private var riveAnimationView: RiveAnimationView? = null

  init {
    context.addLifecycleEventListener(this)
    riveAnimationView = RiveAnimationView(context)
    addView(riveAnimationView)
  }

  fun play() {
    riveAnimationView?.play()
  }

  fun pause() {
    riveAnimationView?.pause()
  }

  fun stop() {
    riveAnimationView?.reset()
    riveAnimationView?.stop()
  }

  fun setResourceName(resourceName: String) {
    val (propsFit, propsAlignment) = Pair(riveAnimationView?.fit, riveAnimationView?.alignment)
    val resId = resources.getIdentifier(resourceName, "raw", context.packageName)

    if (propsFit != null) {
      if (propsAlignment != null) {
        riveAnimationView?.setRiveResource(resId, fit = propsFit, alignment = propsAlignment)
      } else {
        riveAnimationView?.setRiveResource(resId, fit = propsFit)
      }
    } else {
      if(propsAlignment != null) {
        riveAnimationView?.setRiveResource(resId, alignment = propsAlignment)
      } else {
        riveAnimationView?.setRiveResource(resId)
      }
    }
  }

  fun setFit(rnFit: RNFit) {
    val riveFit = RNFit.mapToRiveFit(rnFit)
    riveAnimationView?.fit = riveFit
  }

  fun setAlignment(rnAlignment: RNAlignment) {
    val riveAlignment = RNAlignment.mapToRiveAlignment(rnAlignment)
    riveAnimationView?.alignment = riveAlignment
  }

  override fun onHostResume() {
    riveAnimationView?.play()
  }

  override fun onHostPause() {
    riveAnimationView?.pause()
  }

  override fun onHostDestroy() {
    riveAnimationView?.destroy()
  }
}


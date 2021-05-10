package com.rivereactnative

import RNAlignment
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
    val propsFit = riveAnimationView?.fit
    val resId = resources.getIdentifier(resourceName, "raw", context.packageName)
    propsFit?.let {
      riveAnimationView?.setRiveResource(resId, fit = it) // we want to keep the old value because JS is our source of truth
    } ?: run {
      riveAnimationView?.setRiveResource(resId)
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


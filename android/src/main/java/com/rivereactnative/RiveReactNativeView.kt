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
    riveAnimationView?.setRiveResource(resources.getIdentifier(resourceName, "raw", context.packageName))
  }

  fun setFit(rnFit: RNFit) {
    val riveFit = RNFit.mapToRiveFit(rnFit)
    riveAnimationView?.fit = riveFit
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


package com.rivereactnative

import RNAlignment.Companion.mapToRiveAlignment
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

  fun setAlignment(alignment: String) {
    val riveAlignment = mapToRiveAlignment(alignment)
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


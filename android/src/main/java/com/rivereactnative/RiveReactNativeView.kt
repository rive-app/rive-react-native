package com.rivereactnative

import android.widget.FrameLayout
import androidx.lifecycle.*
import app.rive.runtime.kotlin.RiveAnimationView
import app.rive.runtime.kotlin.core.Fit
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.uimanager.ThemedReactContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.net.URL

class RiveReactNativeView(private val context: ThemedReactContext) : FrameLayout(context), LifecycleEventListener {
  private var riveAnimationView: RiveAnimationView? = null
  private val httpClient = ViewModelProvider(context.currentActivity as ViewModelStoreOwner).get(HttpClient::class.java)
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

  fun setUrl(url: String) {
    httpClient.byteLiveData.observe(context.currentActivity as LifecycleOwner,
      Observer { bytes ->
          // Pass the Rive file bytes to the animation view
          riveAnimationView?.setRiveBytes(
            bytes,
            // Fit the animation to the cover the entire view
            fit = riveAnimationView!!.fit,
            alignment = riveAnimationView!!.alignment
          )
      }
    )
    httpClient.fetchUrl(url)
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

class HttpClient: ViewModel() {
  var byteLiveData = MutableLiveData<ByteArray>()

  fun fetchUrl(url: String) {
    viewModelScope.launch{
      withContext(Dispatchers.IO) {
        fetchAsync(url)
      }
    }
  }

  private fun fetchAsync(url: String) {
    byteLiveData.postValue(URL(url).openStream().use { it.readBytes() })
  }
}


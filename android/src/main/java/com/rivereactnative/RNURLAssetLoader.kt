package com.rivereactnative

import android.content.Context
import android.util.Log
import app.rive.runtime.kotlin.core.BytesRequest
import app.rive.runtime.kotlin.core.FileAsset
import app.rive.runtime.kotlin.core.FileAssetLoader
import com.android.volley.toolbox.Volley

class RNURLAssetLoader(context: Context, assetMap: MutableMap<String, String>?) : FileAssetLoader() {
  private val assets = assetMap
  private val queue = Volley.newRequestQueue(context)

  override fun loadContents(asset: FileAsset, inBandBytes: ByteArray): Boolean {
    val url = assets?.get(asset.name) ?: return false

    val request = BytesRequest(
      url,
      { bytes -> asset.decode(bytes) },
      {
        Log.e("Request", "onAssetLoaded: failed to load asset from $url")
        it.printStackTrace()
      }
    )

    queue.add(request)

    return true
  }
}

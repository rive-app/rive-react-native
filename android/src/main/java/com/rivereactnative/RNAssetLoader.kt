package com.rivereactnative

import android.content.Context
import android.content.res.Resources
import android.util.Log
import app.rive.runtime.kotlin.core.BytesRequest
import app.rive.runtime.kotlin.core.FileAsset
import app.rive.runtime.kotlin.core.FileAssetLoader
import com.android.volley.toolbox.Volley
import java.io.IOException

class RNAssetLoader(private val context: Context, private val urlAssets: MutableMap<String, String>?, private val bundledAssets: MutableMap<String, String>?) : FileAssetLoader() {
  private val queue = Volley.newRequestQueue(context)
  private val tag = "RNAssetLoader"

  override fun loadContents(asset: FileAsset, inBandBytes: ByteArray): Boolean {
    val url = urlAssets?.get(asset.name)
    val name = bundledAssets?.get(asset.name)

    if (url != null) {
      val request = BytesRequest(
        url,
        { bytes -> asset.decode(bytes) },
        {
          Log.e(tag, "failed to load url asset from $url")
          it.printStackTrace()
        }
      )

      queue.add(request)

      return true
    } else if (name != null) {
      val assetId = context.resources.getIdentifier(name, "raw", context.packageName)

      return try {
        context.resources.openRawResource(assetId).use { inputStream ->
          asset.decode(inputStream.readBytes())
          true
        }
      } catch (e: IOException) {
        Log.e(tag, "Error loading bundled asset: ${asset.name}", e)
        false
      } catch (e: Resources.NotFoundException) {
        Log.e(tag, "Bundled asset not found: ${asset.name}", e)
        false
      }
    }

    return false
  }
}

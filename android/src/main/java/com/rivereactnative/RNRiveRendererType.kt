package com.rivereactnative

import app.rive.runtime.kotlin.core.RendererType

enum class RNRiveRendererType(private val rendererTypeName: String) {
  Rive("rive"),
  Skia("skia"),
  Canvas("canvas");

  override fun toString(): String {
    return rendererTypeName
  }

  companion object {
    fun mapToRNRiveRendererType(rendererType: String): RNRiveRendererType {
      return values().first { it.rendererTypeName == rendererType }
    }

    fun mapToRiveRendererType(rnRendererType: RNRiveRendererType): RendererType {
      return when (rnRendererType) {
        Rive -> RendererType.Rive
        Skia -> RendererType.Skia
        Canvas -> RendererType.Canvas
      }
    }
  }
}


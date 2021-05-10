package com.rivereactnative

import app.rive.runtime.kotlin.core.Fit

enum class RNFit(private val mValue: String) {
  Cover("cover"),
  Contain("contain"),
  Fill("fill"),
  FitWidth( "fitWidth"),
  FitHeight("fitHeight"),
  None("none"),
  ScaleDown("scaleDown");

  override fun toString(): String {
    return mValue
  }

  companion object {
    fun mapToRiveFit(v: String): Fit {
      return when (v) {
        "cover" -> Fit.COVER
        "contain" -> Fit.CONTAIN
        "fill" -> Fit.FILL
        "fitWidth" -> Fit.FIT_WIDTH
        "fitHeight" -> Fit.FIT_HEIGHT
        "none" -> Fit.NONE
        "scaleDown" -> Fit.SCALE_DOWN
        else -> throw IllegalStateException("Unsupported Fit type")
      }
    }
  }
}

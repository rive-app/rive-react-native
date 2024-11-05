package com.rivereactnative

import app.rive.runtime.kotlin.core.Fit

enum class RNFit(private val mValue: String) {
  Cover("cover"),
  Contain("contain"),
  Fill("fill"),
  FitWidth("fitWidth"),
  FitHeight("fitHeight"),
  None("none"),
  ScaleDown("scaleDown");

  override fun toString(): String {
    return mValue
  }

  companion object {

    fun mapToRNFit(fit: String): RNFit {
      return valueOf(values().first() { it.toString() == fit }.name)
    }

    fun mapToRiveFit(rnFit: RNFit): Fit {
      return when (rnFit) {
        Cover -> Fit.COVER
        Contain -> Fit.CONTAIN
        Fill -> Fit.FILL
        FitWidth -> Fit.FIT_WIDTH
        FitHeight -> Fit.FIT_HEIGHT
        None -> Fit.NONE
        ScaleDown -> Fit.SCALE_DOWN
      }
    }
  }
}

package com.rivereactnative

enum class RNLayerState(private val mValue: String) {
  Any("any"),
  Exit("exit"),
  Entry("entry"),
  Animation("animation");

  override fun toString(): String {
    return mValue
  }
}

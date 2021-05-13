package com.rivereactnative

import app.rive.runtime.kotlin.core.Alignment

enum class RNAlignment(private val mValue: String) {
  TopLeft("topLeft"),
  TopCenter("topCenter"),
  TopRight("topRight"),
  CenterLeft("centerLeft"),
  Center("center"),
  CenterRight("centerRight"),
  BottomLeft("bottomLeft"),
  BottomCenter("bottomCenter"),
  BottomRight("bottomRight");

  override fun toString(): String {
    return mValue
  }

  companion object {

    fun mapToRNAlignment(alignment: String): RNAlignment {
      return valueOf(values().first() { it.toString() == alignment }.name)
    }

    fun mapToRiveAlignment(v: RNAlignment): Alignment {
      return when (v) {
        TopLeft -> Alignment.TOP_LEFT
        TopCenter -> Alignment.TOP_CENTER
        TopRight -> Alignment.TOP_RIGHT
        CenterLeft -> Alignment.CENTER_LEFT
        Center -> Alignment.CENTER
        CenterRight -> Alignment.CENTER_RIGHT
        BottomLeft -> Alignment.BOTTOM_LEFT
        BottomCenter -> Alignment.BOTTOM_CENTER
        BottomRight -> Alignment.BOTTOM_RIGHT
        else -> throw IllegalStateException("Unsupported Alignment type")
      }
    }
  }
}

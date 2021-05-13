package com.rivereactnative

import app.rive.runtime.kotlin.core.Direction

enum class RNDirection(private val mValue: String) {
  Backwards("backwards"),
  Auto("auto"),
  Forwards("forwards");

  override fun toString(): String {
    return mValue
  }

  companion object {
    fun mapToRNDirection(direction: String): RNDirection {
      return valueOf(values().first() { it.toString() == direction }.name)
    }

    fun mapToRiveDirection(rnDirection: RNDirection): Direction {
      return when (rnDirection) {
        Backwards -> Direction.BACKWARDS
        Auto -> Direction.AUTO
        Forwards -> Direction.FORWARDS
      }
    }
  }
}

package com.rivereactnative

import app.rive.runtime.kotlin.core.Loop as RiveLoop

enum class RNLoopMode(private val mValue: String) {
  OneShot("oneShot"),
  Loop("loop"),
  PingPong("pingPong"),
  None("none");

  override fun toString(): String {
    return mValue
  }

  companion object {
    fun mapToRNLoopMode(loopMode: String): RNLoopMode {
      return valueOf(values().first() { it.toString() == loopMode }.name)
    }

    fun mapToRiveLoop(rnLoopMode: RNLoopMode): RiveLoop {
      return when (rnLoopMode) {
        OneShot -> RiveLoop.ONESHOT
        Loop -> RiveLoop.LOOP
        PingPong -> RiveLoop.PINGPONG
        None -> RiveLoop.NONE
      }
    }
  }
}

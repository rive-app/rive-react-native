package com.rivereactnative

import app.rive.runtime.kotlin.core.Loop as RiveLoop

enum class RNLoopMode(private val mValue: String) {
  OneShot("oneShot"),
  Loop("loop"),
  PingPong("pingPong"),
  Auto("auto");

  override fun toString(): String {
    return mValue
  }

  companion object {
    fun mapToRNLoopMode(loopMode: String): RNLoopMode {
      return valueOf(values().first() { it.toString() == loopMode }.name)
    }

    fun mapToRNLoopMode(riveLoopMode: RiveLoop): RNLoopMode {
        return when (riveLoopMode) {
          RiveLoop.ONESHOT -> OneShot
          RiveLoop.LOOP -> Loop
          RiveLoop.PINGPONG -> PingPong
          RiveLoop.AUTO -> Auto
        }
      }

    fun mapToRiveLoop(rnLoopMode: RNLoopMode): RiveLoop {
      return when (rnLoopMode) {
        OneShot -> RiveLoop.ONESHOT
        Loop -> RiveLoop.LOOP
        PingPong -> RiveLoop.PINGPONG
        Auto -> RiveLoop.AUTO
      }
    }
  }
}

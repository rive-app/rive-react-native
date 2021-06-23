package com.rivereactnative

import app.rive.runtime.kotlin.core.errors.*

enum class RNError(private val mValue: String) {
  FileNotFound("FileNotFound"),
  UnsupportedRuntimeVersion("UnsupportedRuntimeVersion"),
  IncorrectRiveFileUrl("IncorrectRiveFileUrl");

  var message: String = "Default message"

  override fun toString(): String {
    return mValue
  }

  companion object {
    fun mapToRNError(ex: RiveException): RNError? {
      return when (ex) {
        is ArtboardException -> {
          null
        }
        is UnsupportedRuntimeVersionException -> {
          val err = UnsupportedRuntimeVersion
          err.message = ex.message!!
          return err
        }
        is MalformedFileException -> {
          null
        }
        is AnimationException -> {
          null
        }
        is StateMachineException -> {
          null
        }
        else -> null
      }
    }
  }
}

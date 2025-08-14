package com.rivereactnative

import app.rive.runtime.kotlin.core.errors.*

enum class RNRiveError(private val mValue: String) {
  FileNotFound("FileNotFound"),
  UnsupportedRuntimeVersion("UnsupportedRuntimeVersion"),
  IncorrectRiveFileUrl("IncorrectRiveFileUrl"),
  IncorrectAnimationName("IncorrectAnimationName"),
  MalformedFile("MalformedFile"),
  IncorrectArtboardName("IncorrectArtboardName"),
  IncorrectStateMachineName("IncorrectStateMachineName"),
  IncorrectStateMachineInput("IncorrectStateMachineInput"),
  TextRunNotFoundError("TextRunNotFoundError"),
  DataBindingError("DataBindingError");

  var message: String = "Default message"

  override fun toString(): String {
    return mValue
  }

  companion object {
    fun mapToRNRiveError(ex: RiveException): RNRiveError? {
      return when (ex) {
        is ArtboardException -> {
          val err = IncorrectArtboardName
          err.message = ex.message ?: "Unknown artboard exception"
          return err
        }
        is UnsupportedRuntimeVersionException -> {
          val err = UnsupportedRuntimeVersion
          err.message = ex.message ?: "Unsupported runtime version"
          return err
        }
        is MalformedFileException -> {
          val err = MalformedFile
          err.message = ex.message ?: "Malformed file"
          return err
        }
        is AnimationException -> {
          val err = IncorrectAnimationName
          err.message = ex.message ?: "Unknown animation exception"
          return err
        }
        is StateMachineException -> {
          val err = IncorrectStateMachineName
          err.message = ex.message ?: "Unknown state machine exception"
          return err
        }
        is StateMachineInputException -> {
          val err = IncorrectStateMachineInput
          err.message = ex.message ?: "Unknown state machine input exception"
          return err
        }
        is TextValueRunException -> {
          val err = TextRunNotFoundError
          err.message = ex.message ?: "Text run not found"
          return err
        }
        is ViewModelException -> {
          val err = DataBindingError
          err.message = ex.message ?: "Data binding error"
          return err
        }
        else -> null
      }
    }
  }
}

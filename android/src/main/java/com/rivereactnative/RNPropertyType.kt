package com.rivereactnative

enum class RNPropertyType(private val mValue: kotlin.String) {
  Number("number"),
  String("string"),
  Boolean("boolean"),
  Color("color"),
  Trigger("trigger"),
  Enum("enum");

  override fun toString(): kotlin.String {
    return mValue
  }

  companion object {

    fun mapToRNPropertyType(propertyType: kotlin.String): RNPropertyType {
      return valueOf(entries.first() { it.toString() == propertyType }.name)
    }
  }
}

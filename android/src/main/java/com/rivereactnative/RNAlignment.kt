import app.rive.runtime.kotlin.core.Alignment

enum class RNAlignment(private val mValue: String) {
  TopLeft("topLeft"),
  TopCenter("topCenter"),
  TopRight("topRight"),
  CenterLeft( "centerLeft"),
  Center("center"),
  CenterRight("centerRight"),
  BottomLeft("bottomLeft"),
  BottomCenter("bottomCenter"),
  BottomRight("bottomRight");

  override fun toString(): String {
    return mValue
  }

  companion object {
    fun mapToRiveAlignment(v: String): Alignment {
      return when (v) {
        "topLeft" -> Alignment.TOP_LEFT
        "topCenter" -> Alignment.TOP_CENTER
        "topRight" -> Alignment.TOP_RIGHT
        "centerLeft" -> Alignment.CENTER_LEFT
        "center" -> Alignment.CENTER
        "centerRight" -> Alignment.CENTER_RIGHT
        "bottomLeft" -> Alignment.BOTTOM_LEFT
        "bottomCenter" -> Alignment.BOTTOM_CENTER
        "bottomRight" -> Alignment.BOTTOM_RIGHT
        else -> throw IllegalStateException("Unsupported Alignment type")
      }
    }
  }
}

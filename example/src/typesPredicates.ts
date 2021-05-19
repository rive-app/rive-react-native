export function isEnum<EnumType extends { [key: string]: string }>(
  enumType: EnumType,
  enumValue: string
): enumValue is EnumType[keyof EnumType] {
  return Object.values(enumType).includes(enumValue);
}

export function isEnumKey<EnumType extends { [key: string]: string }>(
  enumType: EnumType,
  enumKey: string | number | symbol
): enumKey is keyof EnumType {
  return Object.keys(enumType).includes(enumKey.toString());
}

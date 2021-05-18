export function isEnumKey<EnumType>(
  enumType: EnumType,
  enumKey: string | number | symbol
): enumKey is keyof EnumType {
  return Object.keys(enumType).includes(enumKey.toString());
}

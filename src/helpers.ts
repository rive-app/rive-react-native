import { RNRiveError, RNRiveErrorType } from './types';

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export function isEnum<EnumType extends { [key: string]: string }>(
  enumType: EnumType,
  enumValue: string
): enumValue is EnumType[keyof EnumType] {
  return Object.values(enumType).includes(enumValue);
}

export function convertErrorFromNativeToRN(errorFromNative: {
  type: string;
  message: string;
}): RNRiveError | null {
  if (isEnum(RNRiveErrorType, errorFromNative.type)) {
    return {
      type: errorFromNative.type,
      message: errorFromNative.message,
    };
  }
  return null;
}

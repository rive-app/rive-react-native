//
//  RiveReactNativeModuleBridge.m
//  RiveReactNative
//
//  Created by Peter G Hayes on 07/03/2025.
//  Copyright © 2025 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RiveReactNativeModule, NSObject)

RCT_EXTERN_METHOD(getBooleanState:(nonnull NSNumber *)node inputName:(nonnull NSString *)inputName resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getNumberState:(nonnull NSNumber *)node inputName:(nonnull NSString *)inputName resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getBooleanStateAtPath:(nonnull NSNumber *)node inputName:(nonnull NSString *)inputName path:(nonnull NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getNumberStateAtPath:(nonnull NSNumber *)node inputName:(nonnull NSString *)inputName path:(nonnull NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end

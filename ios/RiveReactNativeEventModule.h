//
//  RiveReactNativeEventModule.h
//  RiveReactNative
//
//  Created by Peter G Hayes on 05/05/2025.
//  Copyright © 2025 Facebook. All rights reserved.
//

#ifndef RiveReactNativeEventModule_h
#define RiveReactNativeEventModule_h

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@interface RiveReactNativeEventModule : RCTEventEmitter <RCTBridgeModule>
- (BOOL)isListenerActive:(NSString *)eventName;
- (void)removeListenerByName:(NSString *)eventName;
@end

#endif /* RiveReactNativeEventModule_h */

//
//  RiveReactNativeRendererModuleBridge.m
//  rive-react-native
//
//  Created by Peter G Hayes on 31/05/2024.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RiveReactNativeRendererModule, NSObject)

RCT_EXTERN_METHOD(defaultRenderer:(NSString *)iosRenderer androidRenderer:(NSString *)androidRenderer)

@end

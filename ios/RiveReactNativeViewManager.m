#import "React/RCTBridgeModule.h"
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(RiveReactNativeViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(resourceName, NSString)
RCT_EXPORT_VIEW_PROPERTY(url, NSString)
RCT_EXPORT_VIEW_PROPERTY(fit, NSString)
RCT_EXPORT_VIEW_PROPERTY(alignment, NSString)
RCT_EXPORT_VIEW_PROPERTY(onPlay, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPause, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStop, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoopEnd, RCTDirectEventBlock)

RCT_EXTERN_METHOD(play:(nonnull NSNumber *)node animationNames:(nonnull NSArray *)animationNames loopMode:(NSString)loopMode direction:(NSString)direction areStateMachines:(BOOL)areStateMachines)
RCT_EXTERN_METHOD(pause:(nonnull NSNumber *)node animationNames:(nonnull NSArray *)animationNames areStateMachines:(BOOL)areStateMachines)


@end


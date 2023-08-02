
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(RiveReactNativeViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(resourceName, NSString)
RCT_EXPORT_VIEW_PROPERTY(url, NSString)
RCT_EXPORT_VIEW_PROPERTY(fit, NSString)
RCT_EXPORT_VIEW_PROPERTY(alignment, NSString)
RCT_EXPORT_VIEW_PROPERTY(autoplay, BOOL)
RCT_EXPORT_VIEW_PROPERTY(artboardName, NSString)
RCT_EXPORT_VIEW_PROPERTY(animationName, NSString)
RCT_EXPORT_VIEW_PROPERTY(stateMachineName, NSString)
RCT_EXPORT_VIEW_PROPERTY(isUserHandlingErrors, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onPlay, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPause, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStop, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoopEnd, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateChanged, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock)

RCT_EXTERN_METHOD(play:(nonnull NSNumber *)node animationName:(nonnull NSString)animationName loop:(NSString)loopMode direction:(NSString)direction isStateMachine:(BOOL)isStateMachine)
RCT_EXTERN_METHOD(pause:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(stop:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(reset:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(fireState:(nonnull NSNumber *)node stateMachineName:(nonnull NSString)stateMachineName inputName:(nonnull NSString)inputName)
RCT_EXTERN_METHOD(setBooleanState:(nonnull NSNumber *)node stateMachineName:(nonnull NSString)stateMachineName inputName:(nonnull NSString)inputName value:(BOOL)value)
RCT_EXTERN_METHOD(setNumberState:(nonnull NSNumber *)node stateMachineName:(nonnull NSString)stateMachineName inputName:(nonnull NSString)inputName value:(nonnull NSNumber *)value)
RCT_EXTERN_METHOD(touchBegan:(nonnull NSNumber *)node x:(nonnull NSNumber*)x y:(nonnull NSNumber*)y)
RCT_EXTERN_METHOD(touchMoved:(nonnull NSNumber *)node x:(nonnull NSNumber*)x y:(nonnull NSNumber*)y)
RCT_EXTERN_METHOD(touchEnded:(nonnull NSNumber *)node x:(nonnull NSNumber*)x y:(nonnull NSNumber*)y)
RCT_EXTERN_METHOD(touchCancelled:(nonnull NSNumber *)node x:(nonnull NSNumber*)x y:(nonnull NSNumber*)y)
RCT_EXTERN_METHOD(setTextRunValue:(nonnull NSNumber *)node textRunName:(nonnull NSString)textRunName textRunValue:(nonnull
    NSString)textRunValue)
@end


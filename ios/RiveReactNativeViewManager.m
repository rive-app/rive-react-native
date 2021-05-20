#import "React/RCTBridgeModule.h"
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(RiveReactNativeViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(resourceName, NSString)
 
RCT_EXTERN_METHOD(play:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(pause:(nonnull NSNumber *)node)


@end


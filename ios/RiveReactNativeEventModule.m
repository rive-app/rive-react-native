//
//  RiveReactNativeEventModule.m
//  RiveReactNative
//
//  Created by Peter G Hayes on 05/05/2025.
//  Copyright © 2025 Facebook. All rights reserved.
//

#import "RiveReactNativeEventModule.h"

@implementation RiveReactNativeEventModule {
    BOOL hasListeners;
    NSMutableSet<NSString *> *_activeListeners;
}

RCT_EXPORT_MODULE();

- (instancetype)init {
    self = [super init];
    if (self) {
        _activeListeners = [NSMutableSet new];
    }
    return self;
}

// Called by React Native to determine which listeners are supported in JS
- (NSArray<NSString *> *)supportedEvents {
    return _activeListeners.allObjects;
}

// Called by React Native when a listener is added from JS
- (void)addListener:(NSString *)eventName {
    [_activeListeners addObject:eventName];
    [super addListener:eventName];
}

// Called by React Native when removeListeners is called from JS
// We intentionally do not clean up all the listeners in
// _activeListeners, as this object is shared between all
// created views. We only ever clean up particular listeners
// tied to a view. See removeListenerByName.
- (void)removeListeners:(double)count {
    [super removeListeners:count];
}

// Used to manually clean up the listeners when a view is disposed
- (void)removeListenerByName:(NSString *)eventName {
    [_activeListeners removeObject:eventName];
}

// Used to determine if a particular listener has already been added.
// Used in RiveReactNativeView to send a "loaded" event to JS when Rive
// is ready, which we only want to do if the listener was actually added
// from JS (as part of the useRive() hook).
- (BOOL)isListenerActive:(NSString *)eventName {
    return [_activeListeners containsObject:eventName];
}

@end

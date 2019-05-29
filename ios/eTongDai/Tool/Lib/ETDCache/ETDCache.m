//
//  ETDCache.m
//  eTongDai
//
//  Created by cn on 2017/12/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDCache.h"
#import <React/RCTConvert.h>

@implementation ETDCache

RCT_EXPORT_MODULE(); 

RCT_EXPORT_METHOD(setCacheString:(NSString *)cacheString forKey:(NSString *)key) {
  if (nil != cacheString && nil != key) {
    [[NSUserDefaults standardUserDefaults] setObject:cacheString forKey:key];
  }
}

RCT_EXPORT_METHOD(cacheStringForKey:(NSString *)key callback:(RCTResponseSenderBlock)callback) {
  NSString *cache = @"";
  if (nil != key) {
    cache = [[NSUserDefaults standardUserDefaults] objectForKey:key];
  }
  
  if (callback) {
    callback(@[cache]);
  }
}

- (NSString *)getCacheStringForKey:(NSString *)key {
  NSString *cache = @"";
  if (nil != key) {
    cache = [[NSUserDefaults standardUserDefaults] objectForKey:key];
  }
  return cache;
}


//
//RCT_ENUM_CONVERTER(CodePushInstallMode, (@{ @"codePushInstallModeImmediate": @(CodePushInstallModeImmediate),
//                                            @"codePushInstallModeOnNextRestart": @(CodePushInstallModeOnNextRestart),
//                                            @"codePushInstallModeOnNextResume": @(CodePushInstallModeOnNextResume),
//                                            @"codePushInstallModeOnNextSuspend": @(CodePushInstallModeOnNextSuspend) }),
//                   CodePushInstallModeImmediate, // Default enum value
//                   integerValue)

@end

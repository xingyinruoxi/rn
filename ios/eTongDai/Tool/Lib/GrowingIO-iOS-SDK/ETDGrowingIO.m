//
//  ETDGrowingIO.m
//  eTongDai
//
//  Created by cn on 2017/10/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDGrowingIO.h"
#import "Growing.h"

#import "RCTAccessibilityManager.h"
#import "RCTAssert.h"
#import "RCTEventDispatcher.h"
#import "RCTUtils.h"

@implementation ETDGrowingIO

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(track:(NSString *)eventName properties:(NSDictionary *)keyValuePairs)
{
  // growing io
  if (nil != eventName) {
    [Growing track:eventName properties:keyValuePairs];
  }
}

RCT_EXPORT_METHOD(setCS1Value:(NSString *)value forKey:(NSString *)key)
{
  // growing io
  if (nil != value && nil != key) {
    [Growing setCS1Value:value forKey:key];
  }
}

RCT_EXPORT_METHOD(setCS2Value:(NSString *)value forKey:(NSString *)key)
{
  // growing io
  if (nil != value && nil != key) {
    [Growing setCS2Value:value forKey:key];
  }
}

RCT_EXPORT_METHOD(setCS3Value:(NSString *)value forKey:(NSString *)key)
{
  // growing io
  if (nil != value && nil != key) {
    [Growing setCS3Value:value forKey:key];
  }
}

RCT_EXPORT_METHOD(setCS4Value:(NSString *)value forKey:(NSString *)key)
{
  // growing io
  if (nil != value && nil != key) {
    [Growing setCS4Value:value forKey:key];
  }
}

RCT_EXPORT_METHOD(setCS5Value:(NSString *)value forKey:(NSString *)key)
{
  // growing io
  if (nil != value && nil != key) {
    [Growing setCS5Value:value forKey:key];
  }
}

RCT_EXPORT_METHOD(getDeviceId:(RCTResponseSenderBlock)callback) {
  NSString *str = [Growing getDeviceId];
  if (nil == str) {
    str = @"";
  }
  
  if (callback) {
    callback(@[str]);
  }
}

RCT_EXPORT_METHOD(getSessionId:(RCTResponseSenderBlock)callback) {
  NSString *str = [Growing getSessionId];
  if (nil == str) {
    str = @"";
  }
  
  if (callback) {
    callback(@[str]);
  }
}

RCT_EXPORT_METHOD(setCacheString:(NSString *)cacheString) {
  if (nil != cacheString) {
    [[NSUserDefaults standardUserDefaults] setObject:cacheString forKey:@"storyKey"];
  }
}

+ (NSDictionary *)cacheDic {
  NSMutableDictionary *dic = [[NSMutableDictionary alloc] initWithCapacity:1];
  
  NSString *cache = [[NSUserDefaults standardUserDefaults] objectForKey:@"storyKey"];
  if (nil == cache) {
    cache = @"stage1";
  }
  
  [dic setObject:cache forKey:@"mode"];
  
  return dic;
}

static NSDictionary *RCTExportedDimensions(RCTBridge *bridge)
{
  RCTAssertMainQueue();
  
  return [ETDGrowingIO cacheDic];
}

- (void)invalidate
{
  dispatch_async(dispatch_get_main_queue(), ^{
    self->_bridge = nil;
    [[NSNotificationCenter defaultCenter] removeObserver:self];
  });
}

- (NSDictionary<NSString *, id> *)constantsToExport
{
  return RCTExportedDimensions(_bridge);
  
//  NSMutableDictionary<NSString *, NSDictionary *> *constants = [NSMutableDictionary new];
//  constants[@"Dimensions"] = RCTExportedDimensions(_bridge);
//  return constants;
}

- (void)didReceiveNewContentSizeMultiplier
{
  // Report the event across the bridge.
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
  [_bridge.eventDispatcher sendDeviceEventWithName:@"didUpdateDimensions"
                                              body:RCTExportedDimensions(_bridge)];
#pragma clang diagnostic pop
}

- (void)setBridge:(RCTBridge *)bridge
{
  _bridge = bridge;
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(didReceiveNewContentSizeMultiplier)
                                               name:RCTAccessibilityManagerDidUpdateMultiplierNotification
                                             object:_bridge.accessibilityManager];
}

@end

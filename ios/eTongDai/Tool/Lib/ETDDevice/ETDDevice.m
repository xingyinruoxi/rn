//
//  ETDDevice.m
//  eTongDai
//
//  Created by cn on 2017/8/30.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDDevice.h"

@import UIKit;
#import <AdSupport/AdSupport.h>
//#import "SimulateIDFA.h"
#import "RCTAccessibilityManager.h"
#import "RCTAssert.h"
#import "RCTEventDispatcher.h"
#import "RCTUtils.h"

@implementation ETDDevice

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(isCurrentUserNotificationEnable:(RCTResponseSenderBlock)callback) {
  BOOL res = [[[UIApplication sharedApplication] currentUserNotificationSettings] types] == UIUserNotificationTypeNone;
  if (callback) {
    callback(@[[NSNumber numberWithBool:!res]]);
  }
}

RCT_EXPORT_METHOD(idfa:(RCTResponseSenderBlock)callback) {
  // 获取idfa
  NSString *idfa = @"";
  if ([[ASIdentifierManager sharedManager] isAdvertisingTrackingEnabled]) {
     idfa = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
  }
//  else {
//    idfa = [SimulateIDFA createSimulateIDFA];
//  }
  
  if (callback) {
    callback(@[idfa]);
  }
}

RCT_EXPORT_METHOD(idfv:(RCTResponseSenderBlock)callback) {
  // 获取idfa
  NSString *idfv = @"";
  if(NSClassFromString(@"UIDevice") && [UIDevice instancesRespondToSelector:@selector(identifierForVendor)]) {
    // only available in iOS >= 6.0
    idfv = [[UIDevice currentDevice].identifierForVendor UUIDString];
  }
  
  if (callback) {
    callback(@[idfv]);
  }
}

#pragma mark - UID Generation methods

+ (NSString *)idfvString {
  if(NSClassFromString(@"UIDevice") && [UIDevice instancesRespondToSelector:@selector(identifierForVendor)]) {
    // only available in iOS >= 6.0
    return [[UIDevice currentDevice].identifierForVendor UUIDString];
  }
  return nil;
}

+ (NSString *)idfaString {
  NSString *idfa = @"";
  if ([[ASIdentifierManager sharedManager] isAdvertisingTrackingEnabled]) {
    idfa = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
  }
  return idfa;
}

static NSDictionary *RCTExportedDimensions(RCTBridge *bridge)
{
  RCTAssertMainQueue();
  
  return @{@"idfaString" : [ETDDevice idfaString],
           @"idfvString" : [ETDDevice idfvString]};
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

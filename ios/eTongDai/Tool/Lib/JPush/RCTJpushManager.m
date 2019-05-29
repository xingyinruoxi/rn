//
//  RCTJpushManager.m
//  CreditLife
//
//  Created by huyajun on 2016/11/10.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTJpushManager.h"
#import "JPUSHService.h"
#import <UIKit/UIKit.h>
#import "AppDelegate.h"

@implementation RCTJpushManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(registerPushId:(NSString *)type callback:(RCTResponseSenderBlock)callback) {
  NSString *registerId = [JPUSHService registrationID]? :@"";
  if (callback) {
    callback(@[registerId]);
  }
}

//RCT_EXPORT_METHOD(configureNotificatoin:(NSDictionary *)paramera) {
//  NSSet *tags = [NSSet set];
//  if ([paramera[@"tags"] isKindOfClass:[NSArray class]]) {
//     tags = [NSSet setWithArray:paramera[@"tags"]];
//  }
//  NSString *alias =  [NSString stringWithFormat:@"%@", [paramera objectForKey:@"uid"]];
//  [JPUSHService setTags:tags alias:alias fetchCompletionHandle:^(int iResCode, NSSet *iTags, NSString *iAlias){
//    //NSLog(@"rescode: %d, \ntags: %@, \nalias: %@\n", iResCode, iTags, iAlias);
//  }];
//}

RCT_EXPORT_METHOD(isCurrentUserNotificationEnable:(RCTResponseSenderBlock)callback) {
  BOOL res = [[[UIApplication sharedApplication] currentUserNotificationSettings] types] == UIUserNotificationTypeNone;
  if (callback) {
    callback(@[[NSNumber numberWithBool:!res]]);
  }
}

RCT_EXPORT_METHOD(launchWithRemoteNotification:(NSString *)type callback:(RCTResponseSenderBlock)callback) {
  NSDictionary *dict = ((AppDelegate *)([UIApplication sharedApplication].delegate)).notificationInfo;
  dict = dict?:@{};
  if (callback) {
    callback(@[dict]);
  }
  ((AppDelegate *)([UIApplication sharedApplication].delegate)).notificationInfo = nil;
}

@end

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import "RNLaunchImage.h"
#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTPushNotificationManager.h>

#import "Growing.h"
#import <tingyunApp/NBSAppAgent.h>
#import "WXApi.h"
#import <sys/utsname.h>

//  growingioID
static NSString *growingioId = @"84873cbf3be76fe4";

// 微信分享
static NSString *kWXAppKey = @"wx579c55de139b0b31";

@interface AppDelegate () <WXApiDelegate>


@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
//  [NBSAppAgent setHttpEnabled:YES];
//  [NBSAppAgent setRedirectURL:@"tyun.etongdai.com"];
//  [NBSAppAgent startWithAppID:@"e3315a3436c94ef999310e2428bca374"];
    if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
 #ifdef NSFoundationVersionNumber_iOS_9_x_Max
    JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
     entity.types = UNAuthorizationOptionAlert|UNAuthorizationOptionBadge|UNAuthorizationOptionSound;
     [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
 
#endif
} else if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
    [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                      UIUserNotificationTypeSound |
                                                      UIUserNotificationTypeAlert)
                                          categories:nil];
  } else {
    [JPUSHService registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                                      UIRemoteNotificationTypeSound |
                                                      UIRemoteNotificationTypeAlert)
                                          categories:nil];
  }
  
  // 极光推送
  //
  // 测试环境、预生产环境:
  // 9e2cf131bcaa181162a717a3
  // bundle id:com.etongdai.product
  //
  // 生产环境:
  // aa139a1fc561a3c345dbf536
  // bundle id:com.stateunion.p2p.etongdai
  //
  // 极光推送，测试送达数，需要修改NotificationService.m中的appkey，从属bundle id按照主target从属原则即可
  [JPUSHService setupWithOption:launchOptions appKey:@"aa139a1fc561a3c345dbf536"
                        channel:nil apsForProduction:nil];
  
//  [NBSAppAgent startWithAppID:@"1f57e2d98fbf438cbe435e04e31b5b41"];
  
  NSURL *jsCodeLocation;
  
  
#ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
    jsCodeLocation = [CodePush bundleURL];
#endif
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"eTongDai"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // 启动GrowingIO
  [Growing startWithAccountId:growingioId];
  
//  [NBSAppAgent startWithAppID:@"1f57e2d98fbf438cbe435e04e31b5b41"];
  
  struct utsname systemInfo;
  uname(&systemInfo);
  NSString* platform = [NSString stringWithCString: systemInfo.machine encoding:NSASCIIStringEncoding];
//
//  // iPhone X
//  if ([platform isEqualToString:@"iPhone10,3"] ||
//      [platform isEqualToString:@"iPhone10,6"]) {
//    CGRect frame = [UIScreen mainScreen].bounds;
//    frame.origin.y = 44;
//    frame.size.height -= (frame.origin.y + 43);
//    rootViewController.view.frame = frame;
//  }
//  // 模拟器
//  if ([platform isEqualToString:@"x86_64"]) {
//      if ([UIScreen mainScreen].bounds.size.width == 375 &&
//          [UIScreen mainScreen].bounds.size.height == 812) {
//        CGRect frame = [UIScreen mainScreen].bounds;
//        frame.origin.y = 44;
//        frame.size.height -= (frame.origin.y + 43);
//        rootViewController.view.frame = frame;
//      }
//  }
  
  // 向微信注册
  [WXApi registerApp:kWXAppKey];
  [RNLaunchImage wait];
  
  // 注册agent
  [self webViewConfig];
  
  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  if ([Growing handleUrl:url])
  {
    return YES;
  }
  
  BOOL isSuc = [WXApi handleOpenURL:url delegate:self];
  return  isSuc;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
[JPUSHService registerDeviceToken:deviceToken];
  
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
 
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {

}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  
  //Optional
  NSLog(@"did Fail To Register For Remote Notifications With Error: %@", error);
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
  
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
  
}

- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
{
  return  [WXApi handleOpenURL:url delegate:self];
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
  NSDictionary * userInfo = notification.request.content.userInfo;
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  }
  completionHandler(UNNotificationPresentationOptionAlert);
}
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
  }
  completionHandler();
}

#pragma mark -

- (void)webViewConfig {
  UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectZero];
  NSString *oldAgent = [webView stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];
//  NSLog(@"old agent :%@", oldAgent);
  
  //add my info to the new agent
  NSString *newAgent = [oldAgent stringByAppendingString:@" etongdaiapp/"];
  NSString *string = [NSString stringWithFormat:@"%@%@", newAgent, [[NSBundle mainBundle] infoDictionary][@"CFBundleShortVersionString"]];
//  NSLog(@"new agent :%@", string);
  
  //regist the new agent
  NSDictionary *dictionnary = [[NSDictionary alloc] initWithObjectsAndKeys:string, @"UserAgent", nil];
  [[NSUserDefaults standardUserDefaults] registerDefaults:dictionnary];
}

@end

//@implementation NSURLRequest(DataController)
//+ (BOOL)allowsAnyHTTPSCertificateForHost:(NSString *)host
//{
//  return YES;
//}
//@end

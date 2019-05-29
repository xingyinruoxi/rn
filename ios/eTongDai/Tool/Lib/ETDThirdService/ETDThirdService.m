//
//  ETDThirdService.m
//  eTongDai
//
//  Created by cn on 2017/7/25.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDThirdService.h"
#import "Growing.h"
#import <tingyunApp/NBSAppAgent.h>

@implementation ETDThirdService

RCT_EXPORT_MODULE();

//RCT_EXPORT_METHOD(registerApp:(NSString *)AppKey activePlatforms:(NSArray *)activePlatforms TotalPlatforms : (NSDictionary *)TotalPlatforms)
RCT_EXPORT_METHOD(setUserID:(NSString *)uid)
{
  // growing io
  [Growing setCS1Value:uid forKey:@"userId"];
  
  // 听云
  [NBSAppAgent setUserIdentifier:uid];
}

@end

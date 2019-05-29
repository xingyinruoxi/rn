//
//  ETDRepaymentDateOfMonthRequest.m
//  eTongDai
//
//  Created by cn on 2017/7/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDRepaymentDateOfMonthRequest.h"
#import "ETDNetworkConfig.h"

@implementation ETDRepaymentDateOfMonthRequest

#pragma mark - config

- (nonnull id<TUNetworkConfigProtocol>)requestConfig {
  
  return [ETDNetworkConfig config];
}

- (nullable NSString *)requestUrl {
  
  return @"/V1/api/userCenter/repaymentDateOfMonth";
}

#pragma mark - parames

- (nullable NSDictionary<NSString *, id> *)requestParameters {
  NSMutableDictionary *parameters = [[NSMutableDictionary alloc] initWithCapacity:5];
  
  if (nil != self.date) {
    [parameters setObject:self.date forKey:@"date"];
  }
  
  if (nil != self.sessionId) {
    [parameters setObject:self.sessionId forKey:@"sessionId"];
  }
  
  if (nil != self.uid) {
    [parameters setObject:self.uid forKey:@"useId"];
  }
  
  return [NSDictionary dictionaryWithDictionary:parameters];
}


@end

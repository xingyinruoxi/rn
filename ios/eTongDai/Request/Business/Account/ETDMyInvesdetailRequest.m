//
//  ETDMyInvesdetailRequest.m
//  ETDApp
//
//  Created by 侯文龙 on 2017/7/12.
//  Copyright © 2017年 cn. All rights reserved.
//

#import "ETDMyInvesdetailRequest.h"
#import "ETDNetworkConfig.h"

@implementation ETDMyInvesdetailRequest

#pragma mark - config

- (nonnull id<TUNetworkConfigProtocol>)requestConfig {
    
    return [ETDNetworkConfig config];
}

- (nullable NSString *)requestUrl {
    
    return @"/V1/api/userCenter/myInvestDetail";
}


#pragma mark - parames

- (nullable NSDictionary<NSString *, id> *)requestParameters {
    NSMutableDictionary *parameters = [[NSMutableDictionary alloc] initWithCapacity:5];
    
    if (nil == self.rsbId) {
        self.rsbId = @"1";
    }
    [parameters setObject:self.rsbId forKey:@"rsbId"];
    
    if (nil == self.claId) {
        self.claId = @"1";
    }
    [parameters setObject:self.claId forKey:@"claId"];
    
    if(nil !=self.claModifyTime){
    [parameters setObject:self.claModifyTime forKey:@"claModifyTime"];
    }
   
    
    return [NSDictionary dictionaryWithDictionary:parameters];
}

@end

//
//  ETDNetworkConfig.m
//  ETDApp
//
//  Created by cn on 2017/6/22.
//  Copyright © 2017年 cn. All rights reserved.
//
//  网络配置
//

#import "ETDNetworkConfig.h"
#import "ETDNet.h"

@implementation ETDNetworkConfig

#pragma mark - required

+ (nonnull id<TUNetworkConfigProtocol>)config {
    static ETDNetworkConfig *config = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        config = [[ETDNetworkConfig alloc] init];
    });
    return config;
}

/// 用户的userId，主要用来区分缓存的目录
- (nonnull NSString *)configUserId {
    return @"0";
}

/// 请求的公共参数
- (nullable NSDictionary *)requestPublicParameters {
    NSString *appVersion = [[NSBundle mainBundle] infoDictionary][@"CFBundleShortVersionString"];
    NSMutableDictionary *parames = [[NSMutableDictionary alloc] initWithObjectsAndKeys:
                                    @"2", @"terminalType",
                                    appVersion, @"appVersion",
                                    nil];
    
    return [NSDictionary dictionaryWithDictionary:parames];
}

/// 校验请求结果
- (BOOL)requestVerifyResult:(nonnull id)result {
    if ([[result allKeys] containsObject:@"success"]) {
        id temp = [result objectForKey:@"success"];
        return [temp boolValue];
    }
    
    return NO;
}

#pragma mark - optional

/// 请求的protocol
- (nullable NSString *)requestProtocol {
    return ETD_API_Protocol;
}

/// 请求的Host
- (nullable NSString *)requestHost {
    return ETD_API_Host;
}

/// 请求的超时时间
- (NSTimeInterval)requestTimeoutInterval {
    return 30;
}

///// 请求的安全选项
//- (nullable AFSecurityPolicy *)requestSecurityPolicy {
//    AFSecurityPolicy *securityPolicy = [[AFSecurityPolicy alloc] init];
//    [securityPolicy setAllowInvalidCertificates:YES];
//    return securityPolicy;
//}

/// Http请求的方法
- (TURequestMethod)requestMethod {
    return TURequestMethodPost;
}

/// 请求的SerializerType
- (TURequestSerializerType)requestSerializerType {
    return TURequestSerializerTypeHTTP;
}

/// 请求公参的位置
- (TURequestPublicParametersType)requestPublicParametersType {
    return TURequestPublicParametersTypeBody;
}

@end

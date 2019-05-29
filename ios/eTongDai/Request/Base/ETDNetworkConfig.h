//
//  ETDNetworkConfig.h
//  ETDApp
//
//  Created by cn on 2017/6/22.
//  Copyright © 2017年 cn. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TUNetworking.h"

@interface ETDNetworkConfig : NSObject <TUNetworkConfigProtocol>

+ (nonnull id<TUNetworkConfigProtocol>)config;

@end

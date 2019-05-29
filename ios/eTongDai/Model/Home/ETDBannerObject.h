//
//  ETDBannerObject.h
//  eTongDai
//
//  Created by cn on 2017/8/16.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ETDBannerObject : NSObject

@property (strong, nonatomic) NSMutableArray<NSDictionary *> *bannerArray;

+ (void)awake:(ETDBannerObject *)obj fromData:(id)data;

@end

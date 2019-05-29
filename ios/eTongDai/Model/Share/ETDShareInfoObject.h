//
//  ETDShareInfoObject.h
//  eTongDai
//
//  Created by cn on 2017/8/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ETDShareInfoObject : NSObject

@property (copy, nonatomic) NSString *imgUrl;
@property (copy, nonatomic) NSString *pageUrl;
@property (copy, nonatomic) NSString *content;
@property (copy, nonatomic) NSString *title;

+ (void)awake:(ETDShareInfoObject *)obj fromData:(id)data;

@end

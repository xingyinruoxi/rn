//
//  ETDPersonContactObject.h
//  eTongDai
//
//  Created by cn on 2017/7/19.
//  Copyright © 2017年 Facebook. All rights reserved.
//
//  通讯录，个人信息数据建模
//

#import <Foundation/Foundation.h>

@interface ETDPersonContactObject : NSObject

@property (copy, nonatomic) NSString *name;
@property (copy, nonatomic) NSString *phone;
@property (copy, nonatomic) NSString *nameFirstLetter;

@end

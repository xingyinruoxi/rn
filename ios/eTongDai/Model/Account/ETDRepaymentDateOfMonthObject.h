//
//  ETDRepaymentDateOfMonthObject.h
//  eTongDai
//
//  Created by cn on 2017/7/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//
//  回款日历数据建模
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface ETDRepaymentDateOfMonthObject : NSObject

@property (assign, nonatomic) CGFloat planSumYuanMonth;   // 本月应还款
@property (assign, nonatomic) CGFloat actualSumYuanMonth; // 本月已还款
@property (strong, nonatomic) NSMutableArray *list;       // 预期回款日期列

+ (void)awake:(ETDRepaymentDateOfMonthObject *)obj fromData:(id)data;

@end

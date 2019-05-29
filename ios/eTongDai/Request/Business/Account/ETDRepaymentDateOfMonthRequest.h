//
//  ETDRepaymentDateOfMonthRequest.h
//  eTongDai
//
//  Created by cn on 2017/7/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//
//  还款日历,某月中预期还款日期和还款总额
//

#import "TUBaseRequest.h"

@interface ETDRepaymentDateOfMonthRequest : TUBaseRequest

@property (copy, nonatomic) NSString *date; // 还款年月，"格式为：yyyy-MM，例如：2016-01"
@property (copy, nonatomic) NSString *sessionId;
@property (copy, nonatomic) NSString *uid;

@end

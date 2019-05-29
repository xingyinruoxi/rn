//
//  ETDInvestmentCalendarView.h
//  eTongDai
//
//  Created by cn on 2017/7/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//
//  投资日历
//

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

@interface ETDInvestmentCalendarView : UIView <RCTBridgeModule>

@property (nonatomic, copy) RCTBubblingEventBlock onSelectDate;

@property (nonatomic, copy) RCTBubblingEventBlock onRequestData;
@property (nonatomic, copy) NSString *currentMonthData;

//@property (nonatomic, copy) NSString *changeDisplayMonth;

+ (UIView *)createView;

@end

//
//  ETDInvestmentCalendarViewManager.m
//  eTongDai
//
//  Created by cn on 2017/7/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDInvestmentCalendarViewManager.h"
#import "ETDInvestmentCalendarView.h"

@implementation ETDInvestmentCalendarViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
  return [ETDInvestmentCalendarView createView];
}

//currentMonthData
//onRequestData

RCT_EXPORT_VIEW_PROPERTY(onSelectDate, RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onRequestData, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(currentMonthData,  NSString);

@end

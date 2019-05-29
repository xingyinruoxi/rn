//
//  ETDContactsSelectViewManager.m
//  eTongDai
//
//  Created by cn on 2017/7/17.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDContactsSelectViewManager.h"
#import "ETDContactsSelectView.h"
#import "AppDelegate.h"

@implementation ETDContactsSelectViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
  return [ETDContactsSelectView createView];
}


RCT_EXPORT_VIEW_PROPERTY(onPopSelf, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(shareInfos,  NSString);

//RCT_EXPORT_VIEW_PROPERTY(onCitySelected, RCTBubblingEventBlock);
//RCT_EXPORT_VIEW_PROPERTY(currentCity,  NSString);

@end

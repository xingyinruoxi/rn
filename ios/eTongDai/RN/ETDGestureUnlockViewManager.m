//
//  ETDGestureUnlockViewManager.m
//  eTongDai
//
//  Created by cn on 2017/8/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDGestureUnlockViewManager.h"
#import "ETDGestureUnlockView.h"

@implementation ETDGestureUnlockViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
  return [ETDGestureUnlockView createView];
}

RCT_EXPORT_VIEW_PROPERTY(onGestureUnlockFinished, RCTBubblingEventBlock);

@end

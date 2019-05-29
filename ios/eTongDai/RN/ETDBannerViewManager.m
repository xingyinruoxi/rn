//
//  ETDBannerViewManager.m
//  eTongDai
//
//  Created by cn on 2017/8/15.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDBannerViewManager.h"
#import "ETDBannerView.h"

@implementation ETDBannerViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
  return [ETDBannerView createView];
}


RCT_EXPORT_VIEW_PROPERTY(bannerData,  NSString);
RCT_EXPORT_VIEW_PROPERTY(onClick, RCTBubblingEventBlock);

@end

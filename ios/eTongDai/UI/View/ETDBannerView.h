//
//  ETDBannerView.h
//  eTongDai
//
//  Created by cn on 2017/8/15.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

@interface ETDBannerView : UIView

@property (nonatomic, copy) NSString *bannerData;
@property (nonatomic, copy) RCTBubblingEventBlock onItemClick;

+ (UIView *)createView;

@end

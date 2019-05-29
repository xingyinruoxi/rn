//
//  ETDHomepageView.h
//  eTongDai
//
//  Created by cn on 2017/12/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

@interface ETDHomepageView : UIScrollView  <RCTBridgeModule>

+ (UIView *)createView;

@property (nonatomic, copy) RCTBubblingEventBlock onPullRefresh;
@property (nonatomic, copy) NSString *contentHeight;
@property (nonatomic, copy) NSString *refreshTitle;

@end

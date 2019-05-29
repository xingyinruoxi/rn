//
//  ETDGestureUnlockView.h
//  eTongDai
//
//  Created by cn on 2017/8/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "WUGesturesUnlockView.h"

@interface ETDGestureUnlockView : UIView

@property (nonatomic, copy) RCTBubblingEventBlock onGestureUnlockFinished;

@property (weak, nonatomic) IBOutlet WUGesturesUnlockView *unlockView;

+ (UIView *)createView;

@end

//
//  ETDGestureUnlockView.m
//  eTongDai
//
//  Created by cn on 2017/8/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDGestureUnlockView.h"

@interface ETDGestureUnlockView () <WUGesturesUnlockViewDelegate>

@end

@implementation ETDGestureUnlockView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (void)awakeFromNib {
  [super awakeFromNib];
  
  self.unlockView.delegate = self;
}


#pragma mark - public fun

+ (UIView *)createView {
  NSArray *array = [[NSBundle mainBundle] loadNibNamed:@"ETDGestureUnlockView" owner:self options:nil];
  UIView *view = [array objectAtIndex:0];
  return view;
}
- (void)setRestGestureUnlock:(NSString *)restGestureUnlock {
  if (nil != restGestureUnlock) {
    self.unlockView;
  }
}
#pragma mark - WUGesturesUnlockViewDelegate

- (void)gesturesUnlockView:(WUGesturesUnlockView *)unlockView drawRectFinished:(NSMutableString *)gesturePassword {
  if (self.onGestureUnlockFinished) {
    self.onGestureUnlockFinished(@{@"password": gesturePassword});
  }
}


@end

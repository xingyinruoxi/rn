//
//  ETDContactsSelectViewController.h
//  eTongDai
//
//  Created by cn on 2017/7/17.
//  Copyright © 2017年 Facebook. All rights reserved.
//
//  通讯录选择，发送邀请短信
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface ETDContactsSelectView : UIView

+ (UIView *)createView;

//@property (nonatomic, copy) NSString *currentCity;
//@property (nonatomic, copy) RCTBubblingEventBlock onCitySelected;

@property (nonatomic, copy) RCTBubblingEventBlock onPopSelf;
@property (nonatomic, copy) NSString *shareInfos;

@end

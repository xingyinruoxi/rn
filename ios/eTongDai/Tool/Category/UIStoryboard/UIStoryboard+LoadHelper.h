//
//  UIStoryboard+LoadHelper.h
//  ETDApp
//
//  Created by cn on 2017/6/23.
//  Copyright © 2017年 cn. All rights reserved.
//
//  UIStoryboard扩展
//  方便视图加载
//

@import UIKit;

@interface UIStoryboard (LoadHelper)

// 封装VC载入函数
+ (UIViewController *)loadVCFromSB:(NSString *)sbName vcIdentifier:(NSString *)vcIdentifier;

@end

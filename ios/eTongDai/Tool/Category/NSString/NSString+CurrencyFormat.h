//
//  NSString+CurrencyFormat.h
//  ETDApp
//
//  Created by cn on 2017/6/27.
//  Copyright © 2017年 cn. All rights reserved.
//
//  货币格式化工具
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface NSString (CurrencyFormat)

// 将货币转换为“XX亿XX万XX元”格式
// TODO：后期还需要再独立，现在固定了字体等效果
- (NSAttributedString *)currencyFromatAttributedString;

@end

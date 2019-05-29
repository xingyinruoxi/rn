//
//  UIColor+FFFFFF.h
//  ETDApp
//
//  Created by cn on 2017/6/21.
//  Copyright © 2017年 cn. All rights reserved.
//
//  UIColor扩展
//  将UI颜色标注（如：#eaeaea）转换为UIColor对象
//

#import <UIKit/UIKit.h>

@interface UIColor (HEX)

// 将十六进制颜色标记（如：0xffeaeaea）转换为UIColor对象，颜色标记包含alpha
+ (UIColor *)colorWithARGB:(unsigned int)hexColor;

// 将十六进制颜色标记（如：0xeaeaea）转换为UIColor对象，颜色标记不包含alpha
+ (UIColor *)colorWithRGB:(unsigned int)hexColor;

// 将十六进制颜色标记（如：0xeaeaea）以及alpha（0~1）数值转换为UIColor对象
+ (UIColor *)colorWithRGB:(unsigned int)hexColor alpha:(CGFloat)alpha;

@end

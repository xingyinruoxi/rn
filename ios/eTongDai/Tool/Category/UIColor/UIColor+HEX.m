//
//  UIColor+FFFFFF.m
//  ETDApp
//
//  Created by cn on 2017/6/21.
//  Copyright © 2017年 cn. All rights reserved.
//

#import "UIColor+HEX.h"

@implementation UIColor (HEX)

#pragma mark - public fun

+ (UIColor *)colorWithARGB:(unsigned int)hexColor {
    int a = (hexColor >> 24) & 0xFF;
    
    return [UIColor colorWithRGB:hexColor alpha:a / 255.0f];
}

+ (UIColor *)colorWithRGB:(unsigned int)hexColor {
    return [UIColor colorWithRGB:hexColor alpha:1.0];
}

+ (UIColor *)colorWithRGB:(unsigned int)hexColor alpha:(CGFloat)alpha {
    int r = (hexColor >> 16) & 0xFF;
    int g = (hexColor >> 8) & 0xFF;
    int b = (hexColor) & 0xFF;
    
    return [UIColor colorWithRed:r / 255.0f
                           green:g / 255.0f
                            blue:b / 255.0f
                           alpha:alpha];
}

#pragma mark - private fun



@end

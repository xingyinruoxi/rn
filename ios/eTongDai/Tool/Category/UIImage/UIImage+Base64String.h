//
//  UIImage+Base64String.h
//  ETDApp
//
//  Created by cn on 2017/7/7.
//  Copyright © 2017年 cn. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIImage (Base64String)

+ (instancetype)imageWithBase64String:(NSString *)imgString;

@end

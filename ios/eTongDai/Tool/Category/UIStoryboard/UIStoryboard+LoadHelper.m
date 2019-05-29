//
//  UIStoryboard+LoadHelper.m
//  ETDApp
//
//  Created by cn on 2017/6/23.
//  Copyright © 2017年 cn. All rights reserved.
//

#import "UIStoryboard+LoadHelper.h"

@implementation UIStoryboard (LoadHelper)

#pragma mark - public fun

+ (UIViewController *)loadVCFromSB:(NSString *)sbName vcIdentifier:(NSString *)vcIdentifier {
    UIStoryboard *sb = [UIStoryboard storyboardWithName:sbName
                                                 bundle:[NSBundle mainBundle]];
    return [sb instantiateViewControllerWithIdentifier:vcIdentifier];
}

#pragma mark - private fun

@end

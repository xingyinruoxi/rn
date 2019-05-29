//
//  UIImage+Base64String.m
//  ETDApp
//
//  Created by cn on 2017/7/7.
//  Copyright © 2017年 cn. All rights reserved.
//

#import "UIImage+Base64String.h"

@implementation UIImage (Base64String)

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

+ (instancetype)imageWithBase64String:(NSString *)imgString {
    
    NSData *data   = [[NSData alloc] initWithBase64EncodedString:imgString options:NSDataBase64DecodingIgnoreUnknownCharacters];
    
    return [UIImage imageWithData:data];;
}

@end

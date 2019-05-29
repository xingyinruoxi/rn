//
//  NSData+MD5.h
//  ETDApp
//
//  Created by cn on 2017/6/21.
//  Copyright © 2017年 cn. All rights reserved.
//
//  NSData扩展
//  增加MD5编码支持
//

#import <Foundation/Foundation.h>

@interface NSData (MD5)

// 将NSString对象转换为MD5字符串
- (NSData *)MD5;

@end
